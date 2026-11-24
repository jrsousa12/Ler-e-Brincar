// Motor "pedir a outra IA": monta o texto pronto para colar noutra IA, já preenchido, a partir dos roteiros.
// Uso:
//   node build/pedir.js lp        [--qtd 20] [--serie 2|3] [--bncc EF35LP04] [--tema "texto"]
//   node build/pedir.js mat       [--qtd 20] [--serie 2|3] [--bncc EF02MA08] [--tema "texto"]
//   node build/pedir.js silabas   [--qtd 15]          (Monte a Palavra)
//   node build/pedir.js ordem     [--qtd 10]          (Ordem dos Fatos)
//   node build/pedir.js historia  [--qtd 3] [--nivel 1|2|3]
//   node build/pedir.js ideia     [--qtd 5] [--materia mat|lp]   (ideias de brincadeira nova)
//   --lote nome troca o nome do lote (padrão: o próximo loteN livre em build/pedidos/)
// Escolhe sozinho: o tema com menos itens (lp/mat), os níveis com menos itens, e manda a lista do que já
// existe para a outra IA não repetir. Grava o texto em build/previas/pedido-<tipo>.txt e mostra onde
// salvar a resposta e o que rodar depois. Ficha: build/fichas/pedir.json. Roteiros: build/roteiros/.
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('./pedir-dados');
const { opcao } = require('./importar-comum.js');
const raiz = path.join(__dirname, '..');
const TIPOS = Object.keys(D.ficha.roteiros);
const NOME_NIVEL = { 1: 'tipo 1 (2 sílabas simples)', 2: 'tipo 2 (3 sílabas simples)', 3: 'tipo 3 (com sílaba difícil)' };

// Só o trecho entre "---- INÍCIO ----" e "---- FIM ----" do roteiro
function trecho(tipo) {
  const txt = fs.readFileSync(path.join(__dirname, 'roteiros', D.ficha.roteiros[tipo]), 'utf8');
  const m = txt.match(/---- INÍCIO ----\n([\s\S]*?)\n---- FIM ----/);
  if (!m) throw new Error('roteiro ' + D.ficha.roteiros[tipo] + ' sem as linhas INÍCIO e FIM');
  return m[1].trim();
}

const lista = nomes => nomes.join(', ');
const juntar = partes => partes.length < 2 ? partes.join('') : partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1];

// Valores de cada [colchete] e o resumo do que foi escolhido
function preencher(tipo, op) {
  const v = { 'QUANTIDADE': op.qtd };
  let resumo = '', serie = op.serie || 2, bncc = '';
  if (tipo === 'lp' || tipo === 'mat') {
    const t = D.tema(tipo, op);
    serie = op.serie || t.serie;
    bncc = op.tema ? '' : t.bncc;
    v.TEMA = op.tema || t.tema;
    resumo = op.tema ? 'tema dado: ' + op.tema : 'tema: ' + t.tema + ' (' + t.bncc + ', hoje com ' + t.tem + ' itens)';
  } else if (tipo === 'silabas') {
    const s = D.silabas(op.qtd);
    v.NÍVEIS = juntar(s.niveis.map(x => x.qtd + ' do ' + NOME_NIVEL[x.nivel]));
    v['JÁ EXISTEM'] = lista(s.existem);
    resumo = s.existem.length + ' palavras já existem; pedido: ' + v.NÍVEIS;
  } else if (tipo === 'ordem') {
    const o = D.ordem();
    v['JÁ EXISTEM'] = o.map(x => '- ' + x.titulo).join('\n');
    resumo = o.length + ' sequências já existem';
  } else if (tipo === 'historia') {
    const h = D.historias(op);
    serie = h.serie;
    v.NÍVEL = h.nivel;
    v['JÁ EXISTEM'] = lista(h.existem);
    resumo = h.existem.length + ' histórias já existem; pedido: nível ' + h.nivel + ' (' + serie + 'º ano)';
  } else if (tipo === 'ideia') {
    const b = D.brincadeiras();
    const mat = op.materia || b.materia;
    v.MATÉRIA = mat === 'mat' ? 'Matemática' : 'Língua Portuguesa';
    v['JÁ EXISTEM'] = lista(b.existem.map(x => x.emoji + ' ' + x.nome));
    resumo = b.existem.length + ' brincadeiras já existem; foco: ' + v.MATÉRIA;
  }
  v['2º ou 3º'] = serie + 'º';
  return { v, resumo, serie, bncc };
}

// Troca cada [NOME] (ou [NOME, ex.: ...]) pelo valor; avisa se sobrar colchete sem valor
function trocar(texto, v) {
  let saida = texto;
  for (const [k, valor] of Object.entries(v)) {
    saida = saida.split('[' + k + ']').join(String(valor));
    saida = saida.replace(new RegExp('\\[' + k + ',[^\\]]*\\]', 'g'), String(valor));
  }
  const sobra = saida.match(/\[[A-ZÀ-Ú0-9º][^\]\n]*\]/g);
  if (sobra) throw new Error('colchete sem valor no roteiro: ' + sobra.join(' '));
  return saida;
}

function principal(argv) {
  const args = [...argv];
  const op = {
    qtd: opcao(args, 'qtd'), serie: +opcao(args, 'serie') || 0, nivel: +opcao(args, 'nivel') || 0,
    bncc: opcao(args, 'bncc'), tema: opcao(args, 'tema'), materia: opcao(args, 'materia'), lote: opcao(args, 'lote')
  };
  const tipo = args[0];
  if (!TIPOS.includes(tipo)) { console.log('Uso: node build/pedir.js <' + TIPOS.join('|') + '> [--qtd N] [--serie 2|3] ...'); return 1; }
  if (op.serie && ![2, 3].includes(op.serie)) { console.log('Erro: --serie precisa ser 2 ou 3'); return 1; }
  op.qtd = +op.qtd || D.ficha.qtd[tipo];
  try {
    const { v, resumo, serie, bncc } = preencher(tipo, op);
    const texto = trocar(trecho(tipo), v);
    const lote = op.lote || D.proximoLote(tipo);
    const arq = path.relative(raiz, path.join(D.pastaPedidos(), D.ficha.destino[tipo].replace('{lote}', lote)));
    const passos = D.ficha.depois[tipo].map(p => p.replace('{arq}', arq).replace('{txt}', arq.replace(/\.json$/, '.txt'))
      .replace('{serie}', serie).replace(' --bncc {bncc}', bncc ? ' --bncc ' + bncc : ''));
    const saida = path.join(process.env.PREVIAS_RAIZ || path.join(raiz, 'build/previas'), 'pedido-' + tipo + '.txt');
    fs.mkdirSync(path.dirname(saida), { recursive: true });
    fs.writeFileSync(saida, texto + '\n');
    console.log('Pedido de ' + tipo + ': ' + op.qtd + ' itens; ' + resumo);
    console.log('Texto para colar na outra IA: ' + path.relative(raiz, saida) + ' (' + texto.split('\n').length + ' linhas)');
    console.log('Resposta da outra IA: salvar em ' + arq);
    passos.forEach((p, i) => console.log('Depois ' + (i + 1) + ': ' + p));
    return 0;
  } catch (e) {
    console.log('Erro: ' + e.message);
    return 1;
  }
}

if (require.main === module) process.exitCode = principal(process.argv.slice(2));
module.exports = { principal, trocar, trecho };
