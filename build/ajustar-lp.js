// Motor de ajuste de Português: acha e corrige a resposta certa comprida demais (a criança acerta
// só pelo tamanho) e, nas perguntas de "pista", a certa com palavras que não estão no texto.
// Corta só o final da frase num ponto seguro; o que não der para corrigir fica listado como pendente.
// Uso:
//   node build/ajustar-lp.js build/pedidos/lp-<lote>.txt [--gravar]      → no pedido, antes do gerar-lp
//   node build/ajustar-lp.js --conteudo [lp-245..lp-314 | lp-250 ...] [--gravar]   → no conteúdo já gravado
// Sem --gravar é só prévia. Regras em build/ajustar-regras.js; limites em build/fichas/ajustar.json.
'use strict';
const fs = require('fs');
const escrever = require('./escrever');
const { achar, todos } = require('./item');
const { ajustarCerta } = require('./ajustar-regras');

const MOLDES_SEM_ESCOLHA = ['troca', 'grafia', 'palavra', 'silabas', 'alfabetica'];
const curto = s => (s.length > 70 ? s.slice(0, 67) + '...' : s);

// Uma linha de pedido de escolha → linha nova (ou a mesma) + relatório
function ajustarLinha(linha) {
  const campos = linha.split('|').map(s => s.trim());
  if (MOLDES_SEM_ESCOLHA.includes(campos[0])) return null;
  const pos = campos.map((c, i) => i).filter(i => i > 0 && !/^\w+=/.test(campos[i]));
  const ops = pos.slice(1, 4);
  const iCerta = ops.find(i => campos[i].startsWith('*'));
  if (ops.length < 3 || iCerta === undefined) return null;
  const certa = campos[iCerta].replace(/^\*\s*/, '');
  const erradas = ops.filter(i => i !== iCerta).map(i => campos[i]);
  const r = ajustarCerta(certa, erradas, campos[pos[0]]);
  if (r.mudou) campos[iCerta] = '*' + r.nova;
  return Object.assign(r, { antes: certa, linha: campos.join(' | ') });
}

function relatar(rotulo, r, saida) {
  if (r.mudou) saida.mudados.push(rotulo + ': "' + curto(r.antes) + '" → "' + r.nova + '"');
  if (r.pendente) saida.pendentes.push(rotulo + ': ' + r.pendente);
}

function noPedido(arq, gravar) {
  const saida = { mudados: [], pendentes: [] };
  const linhas = fs.readFileSync(arq, 'utf8').split('\n');
  const novas = linhas.map((l, n) => {
    if (!l.trim() || l.trim().startsWith('#')) return l;
    const r = ajustarLinha(l.trim());
    if (!r) return l;
    relatar('linha ' + (n + 1), r, saida);
    return r.mudou ? r.linha : l;
  });
  if (gravar && saida.mudados.length) fs.writeFileSync(arq, novas.join('\n'));
  return saida;
}

// Ids: "lp-245..lp-314", ids soltos, ou nada (= todo o Português)
function idsPedidos(args) {
  const lp = todos().filter(x => x.nome === 'lp').map(x => x.id);
  if (!args.length) return lp;
  const num = id => +id.split('-').pop();
  return args.flatMap(a => {
    const m = a.match(/^(lp-\d+)\.\.(lp-\d+)$/);
    return m ? lp.filter(id => num(id) >= num(m[1]) && num(id) <= num(m[2])) : [a];
  });
}

function noConteudo(ids, gravar) {
  const saida = { mudados: [], pendentes: [] };
  for (const id of ids) {
    const r0 = achar(id), q = r0.item;
    if (q.tipo !== 'multipla' || !Array.isArray(q.opcoes) || typeof q.correta !== 'number') continue;
    const certa = String(q.opcoes[q.correta]);
    const r = ajustarCerta(certa, q.opcoes.filter((o, i) => i !== q.correta).map(String), q.enunciado);
    relatar(id, Object.assign(r, { antes: certa }), saida);
    if (gravar && r.mudou) {
      q.opcoes[q.correta] = r.nova;
      const fim = /,\s*$/.test(r0.linhas[r0.i]) ? ',' : '';
      r0.linhas[r0.i] = escrever(q) + fim;
      fs.writeFileSync(r0.arquivo, r0.linhas.join('\n'));
    }
  }
  return saida;
}

function principal(args) {
  const gravar = args.includes('--gravar');
  const resto = args.filter(a => !a.startsWith('--'));
  let saida;
  if (args.includes('--conteudo')) saida = noConteudo(idsPedidos(resto), gravar);
  else if (resto[0]) saida = noPedido(resto[0], gravar);
  else { console.log('Uso: node build/ajustar-lp.js <pedido.txt> | --conteudo [lp-245..lp-314] [--gravar]'); return 1; }
  saida.mudados.forEach(l => console.log('corrigido ' + l));
  saida.pendentes.forEach(l => console.log('PENDENTE ' + l));
  console.log(saida.mudados.length + ' corrigido(s), ' + saida.pendentes.length + ' pendente(s)' +
    (gravar ? (saida.mudados.length ? ' · gravado. Agora: node build/validar.js' : '') : ' (prévia; use --gravar)'));
  return 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { ajustarLinha, principal };
