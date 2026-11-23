// Motor gerador da brincadeira "Monte a Palavra": de uma linha com a palavra separada em sílabas,
// monta o item completo (sílabas para confundir tiradas de trocas típicas, nível) e grava em conteudo/silabas.js.
// Uso:
//   node build/gerar-silabas.js build/pedidos/silabas-lote1.txt            → só mostra a prévia
//   node build/gerar-silabas.js build/pedidos/silabas-lote1.txt --gravar   → acrescenta no fim de conteudo/silabas.js
// Linha do pedido (campos separados por " | "; linhas com # são comentário):
//   GA-LI-NHA | 🐔 | Bota ovo e faz có-có-ró.
//   BO-LA | ⚽ | Redonda e pula quando a gente chuta! | extras=PA,DA | nivel=1
// Trocas e níveis: build/fichas/silabas.json (calibrar ali).
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const pastaConteudo = () => process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/silabas.json'), 'utf8'));
const escrever = require('./escrever');
const SIMPLES = new RegExp(ficha.simples);
const PREFIXOS = Object.keys(ficha.consoantes).sort((a, b) => b.length - a.length);

// Troca o começo da sílaba (P→B, NH→LH...). Devolve null se não houver troca.
function trocaConsoante(s) {
  const p = PREFIXOS.find(k => s.startsWith(k));
  return p ? ficha.consoantes[p] + s.slice(p.length) : null;
}
// Troca a 1ª vogal (o U de QU/GU não conta). Recusa resultado com vogal dobrada (QUII).
function trocaVogal(s) {
  const ini = /^[QG]U/.test(s) ? 2 : 0;
  for (let i = ini; i < s.length; i++) {
    const v = ficha.vogais[s[i]];
    if (!v) continue;
    const r = s.slice(0, i) + v + s.slice(i + 1);
    return /([AEIOU])\1/.test(r) ? null : r;
  }
  return null;
}

// Sílabas para confundir: 1ª sílaba com consoante trocada, última com vogal trocada, depois as outras, depois a reserva.
function extras(silabas, quantos = ficha.extras) {
  const ult = silabas.length - 1;
  const candidatos = [trocaConsoante(silabas[0]), trocaVogal(silabas[ult]),
    ...silabas.slice(1).map(trocaConsoante), ...silabas.slice(0, ult).map(trocaVogal), ...ficha.reserva];
  const escolhidas = [];
  for (const c of candidatos) {
    if (c && !silabas.includes(c) && !escolhidas.includes(c)) escolhidas.push(c);
    if (escolhidas.length === quantos) break;
  }
  return escolhidas;
}

const nivelDe = silabas => (silabas.every(s => SIMPLES.test(s)) ? (silabas.length <= 2 ? 1 : 2) : 3);

function montar(linha) {
  const [separada, emoji, dica, ...resto] = linha.split('|').map(s => s.trim());
  const op = {};
  for (const r of resto) { const [k, ...v] = r.split('='); op[k.trim()] = v.join('=').trim(); }
  const silabas = (separada || '').toUpperCase().split('-').map(s => s.trim()).filter(Boolean);
  if (silabas.length < 2) throw new Error('separe a palavra em sílabas com hífen (ex.: BO-LA)');
  if (!emoji) throw new Error('falta o emoji');
  if (!dica) throw new Error('falta a dica');
  const palavra = silabas.join('');
  if (dica.toUpperCase().includes(palavra)) throw new Error('a dica entrega a palavra');
  const ext = op.extras ? op.extras.toUpperCase().split(',').map(s => s.trim()) : extras(silabas);
  if (ext.some(e => silabas.includes(e))) throw new Error('sílaba extra igual a uma sílaba certa');
  const nivel = op.nivel ? +op.nivel : nivelDe(silabas);
  return { palavra, silabas, extras: ext, emoji, dica, nivel };
}

function principal(args) {
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log('Uso: node build/gerar-silabas.js <pedido.txt> [--gravar]'); return 1; }
  const destino = path.join(pastaConteudo(), 'silabas.js');
  const texto = fs.readFileSync(destino, 'utf8');
  const LB = {};
  new Function('LB', texto)(LB);
  let ultimo = Math.max(0, ...LB.silabas.map(q => +q.id.split('-')[1]));
  const palavras = new Set(LB.silabas.map(q => q.palavra));
  const novas = [], erros = [];
  fs.readFileSync(arq, 'utf8').split('\n').forEach((l, n) => {
    if (!l.trim() || l.trim().startsWith('#')) return;
    try {
      const q = montar(l);
      if (palavras.has(q.palavra)) throw new Error('já existe: ' + q.palavra);
      palavras.add(q.palavra);
      novas.push(Object.assign({ id: 'sil-' + String(++ultimo).padStart(3, '0') }, q));
    } catch (e) { erros.push('linha ' + (n + 1) + ': ' + e.message); }
  });
  erros.forEach(e => console.log(e));
  const niveis = [1, 2, 3].map(k => 'n' + k + ':' + novas.filter(q => q.nivel === k).length).join(' ');
  console.log(novas.length + ' palavra(s): ' + (novas[0] ? novas[0].id + ' a ' + novas[novas.length - 1].id : '-') + ' · ' + niveis);
  if (args.includes('--ver')) novas.forEach(q => console.log(`  ${q.id} ${q.emoji} ${q.silabas.join('-')} + ${q.extras.join(',')} (n${q.nivel})`));
  if (erros.length) { console.log('Nada gravado: corrija ' + erros.length + ' erro(s).'); return 1; }
  if (!args.includes('--gravar')) { console.log('(prévia; --ver mostra cada palavra; --gravar acrescenta em conteudo/silabas.js)'); return 0; }
  const fim = texto.lastIndexOf('];');
  const antes = texto.slice(0, fim).replace(/,?\s*$/, LB.silabas.length ? ',\n' : '\n');
  fs.writeFileSync(destino, antes + novas.map(q => escrever(q) + ',').join('\n') + '\n' + texto.slice(fim));
  console.log('Gravado em conteudo/silabas.js. Agora: node build/validar.js');
  return 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar, extras, trocaConsoante, trocaVogal, nivelDe };
