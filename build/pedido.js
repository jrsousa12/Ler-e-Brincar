// Peças comuns dos geradores de conteúdo (gerar-mat, gerar-lp, gerar-historia).
// Ler o pedido, separar campos, opções com *, achar o próximo id, gravar no fim do conteudo/*.js.
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const pastaConteudo = () => process.env.CONTEUDO_RAIZ || path.join(__dirname, '..', 'conteudo');

// "a | b | chave=valor" → { campos: ['a','b'], extra: {chave:'valor'} }
function partir(linha) {
  const extra = {};
  const campos = linha.split('|').map(s => s.trim()).filter(p => {
    const m = p.match(/^(\w+)=(.*)$/);
    if (m) extra[m[1]] = m[2].trim();
    return !m;
  });
  return { campos, extra };
}

// Opções do pedido: a certa leva * na frente; depois delas, a explicação (opcional).
// ['*Feliz', 'Com medo', 'Doente', 'explicação'] → { opcoes, correta, explicacao }
function escolha(campos) {
  const opcoes = campos.slice(0, 3);
  const certas = opcoes.filter(o => o.startsWith('*'));
  if (opcoes.length < 3) throw new Error('precisa de 3 opções (a certa com * na frente)');
  if (certas.length !== 1) throw new Error('marque com * exatamente uma opção certa');
  const limpas = opcoes.map(o => o.replace(/^\*\s*/, ''));
  if (new Set(limpas.map(o => o.toLowerCase())).size !== 3) throw new Error('opções repetidas');
  return { opcoes: limpas, correta: opcoes.findIndex(o => o.startsWith('*')), explicacao: campos[3] || '' };
}

// Linhas úteis do pedido (sem vazias e sem comentário #), com o número da linha
function linhas(arq) {
  return fs.readFileSync(arq, 'utf8').split('\n').map((t, i) => ({ n: i + 1, t: t.trim() }))
    .filter(l => l.t && !l.t.startsWith('#'));
}

// Abre conteudo/<arquivo>.js e devolve o texto, a lista e o caminho
function abrir(arquivo, chave) {
  const destino = path.join(pastaConteudo(), arquivo + '.js');
  const texto = fs.readFileSync(destino, 'utf8');
  const LB = {};
  new Function('window', 'LB', texto)({ LB }, LB); // alguns arquivos usam window.LB
  return { destino, texto, lista: LB[chave] };
}

const ultimoNumero = lista => Math.max(0, ...lista.map(q => +q.id.split('-').pop()));
const novoId = (prefixo, n, digitos) => prefixo + '-' + String(n).padStart(digitos, '0');

// Acrescenta os itens antes do "];" final, um por linha
function gravar(destino, texto, itens) {
  const fim = texto.lastIndexOf('];');
  const novas = itens.map(q => escrever(q) + ',').join('\n');
  fs.writeFileSync(destino, texto.slice(0, fim).replace(/,?\s*$/, ',\n') + novas + '\n' + texto.slice(fim));
}

// Roteiro comum dos geradores de uma linha por item.
// cfg: { arquivo, chave, prefixo, digitos, montar(linha) → item (com _emoji opcional), uso, repetido?, grupo? }
function rodar(cfg, args) {
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log(cfg.uso); return 1; }
  const { destino, texto, lista } = abrir(cfg.arquivo, cfg.chave);
  let ultimo = ultimoNumero(lista);
  // repetido = mesmo enunciado com as mesmas opções (ou o que cfg.repetido disser)
  const chave = cfg.repetido || (q => q.enunciado + ' | ' + [...(q.opcoes || [])].map(String).sort().join(' / '));
  const enunciados = new Set(lista.map(chave));
  const novas = [], problemas = [];
  let emojiAnterior = null;
  for (const { n, t } of linhas(arq)) {
    try {
      const q = cfg.montar(t);
      if (enunciados.has(chave(q))) throw new Error('já existe no conteúdo: "' + chave(q) + '"');
      (q._avisos || []).forEach(a => problemas.push('linha ' + n + ': aviso, ' + a));
      if (q._emoji && q._emoji === emojiAnterior) problemas.push('linha ' + n + ': aviso, mesmo emoji da anterior (' + q._emoji + ')');
      emojiAnterior = q._emoji;
      delete q._emoji; delete q._avisos;
      enunciados.add(chave(q));
      novas.push(Object.assign({ id: novoId(cfg.prefixo, ++ultimo, cfg.digitos) }, q));
    } catch (e) { problemas.push('linha ' + n + ': ' + e.message); }
  }
  return concluir(cfg, args, problemas, novas, destino, texto, cfg.grupo || (q => q.habilidadeBNCC));
}

// Resumo + gravação (também usado pelo gerador de histórias)
function concluir(cfg, args, problemas, novas, destino, texto, grupo) {
  const erros = problemas.filter(p => !p.includes(': aviso,'));
  problemas.forEach(p => console.log(p));
  const conta = {};
  novas.forEach(q => { const g = grupo(q); conta[g] = (conta[g] || 0) + 1; });
  const faixa = novas[0] ? novas[0].id + ' a ' + novas[novas.length - 1].id : '-';
  console.log(novas.length + ' atividade(s): ' + faixa + ' · ' + JSON.stringify(conta));
  if (args.includes('--ver')) novas.forEach(q => console.log(JSON.stringify(q)));
  if (erros.length) { console.log('Nada gravado: corrija ' + erros.length + ' erro(s).'); return 1; }
  if (!args.includes('--gravar')) { console.log('(prévia; use --gravar para acrescentar em conteudo/' + cfg.arquivo + '.js)'); return 0; }
  gravar(destino, texto, novas);
  console.log('Gravado em conteudo/' + cfg.arquivo + '.js. Agora: node build/validar.js');
  return 0;
}

module.exports = { partir, escolha, linhas, abrir, ultimoNumero, novoId, gravar, rodar, concluir };
