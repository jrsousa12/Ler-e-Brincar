// Motor de figuras da Matemática: põe apoioVisual (figuras) em contas que ainda não têm.
// Uso: node build/figuras-mat.js build/pedidos/figuras-<lote>.txt   (prévia: mostra as figuras)
//      ... --gravar                                                   (grava só a linha de cada item)
// Linha do pedido:
//   mat-005 | 🍬                           automático pelo enunciado: "a + b", "a − b", "a × b", "dobro de n"
//   mat-026 | 🔟🔟 | 2 dezenas |            à mão: esquerda | operador | direita
// Recusa item que não existe, que não é de Matemática ou que já tem figuras.
'use strict';
const fs = require('fs');
const { linhas, partir } = require('./pedido');
const { achar } = require('./item');
const { apoio } = require('./gerar-mat');
const escrever = require('./escrever');

// Figuras automáticas a partir do enunciado
function automatico(enunciado, emoji) {
  const conta = enunciado.match(/(\d+)\s*([+−×x])\s*(\d+)/);
  if (conta) return apoio(conta[2] === 'x' ? '×' : conta[2], +conta[1], +conta[3], emoji);
  const dobro = enunciado.match(/dobro de (\d+)/i);
  if (dobro) return apoio('×', 2, +dobro[1], emoji);
  return null;
}

function montar(t) {
  const { campos } = partir(t);
  const id = campos[0];
  const { item } = achar(id);
  if (item.materia !== 'matematica') throw new Error(id + ' não é de Matemática');
  if (item.apoioVisual) throw new Error(id + ' já tem figuras');
  let vis;
  if (campos.length >= 3) vis = { esquerda: campos[1], operador: campos[2], direita: campos[3] || '' };
  else {
    if (!campos[1]) throw new Error(id + ': falta o emoji');
    vis = automatico(item.enunciado, campos[1]);
    if (!vis) throw new Error(id + ': não achei a conta no enunciado; escreva esquerda | operador | direita');
  }
  return { id, vis, enunciado: item.enunciado };
}

function principal(args) {
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log('Uso: node build/figuras-mat.js <pedido.txt> [--gravar]'); return 1; }
  const prontos = [], erros = [];
  for (const { n, t } of linhas(arq)) {
    try { prontos.push(montar(t)); } catch (e) { erros.push('linha ' + n + ': ' + e.message); }
  }
  prontos.forEach(p => console.log(`${p.id} · ${p.enunciado}\n   ${p.vis.esquerda}  ${p.vis.operador}  ${p.vis.direita}`));
  erros.forEach(e => console.log('ERRO ' + e));
  if (erros.length) { console.log('Nada gravado: corrija os erros.'); return 1; }
  if (!args.includes('--gravar')) { console.log(`Prévia: ${prontos.length} item(ns). Para gravar: --gravar`); return 0; }
  for (const p of prontos) {
    const r = achar(p.id);
    r.item.apoioVisual = p.vis;
    const fim = /,\s*$/.test(r.linhas[r.i]) ? ',' : '';
    r.linhas[r.i] = escrever(r.item) + fim;
    fs.writeFileSync(r.arquivo, r.linhas.join('\n'));
  }
  console.log(`Gravado: figuras em ${prontos.length} item(ns). Agora: node build/validar.js`);
  return 0;
}

if (require.main === module) {
  try { process.exit(principal(process.argv.slice(2))); }
  catch (e) { console.log('ERRO: ' + e.message); process.exit(1); }
}
module.exports = { automatico };
