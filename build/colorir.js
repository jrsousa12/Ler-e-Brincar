// Motor de desenhos de colorir: confere, mostra a prévia e grava um lote de desenhos.
// Uso:
//   node build/colorir.js build/pedidos/<lote>.js            confere + prévia (build/previas/colorir.html e .png)
//   node build/colorir.js build/pedidos/<lote>.js --gravar   o mesmo e grava em conteudo/colorir.js
//   --sem-previa   pula a prévia (mais rápido)
// O pedido exporta uma lista: [{ id:'colorir-07', svg }] troca um desenho; [{ titulo, emoji, svg }] cria um novo
// (id seguinte livre). Desenhar com o kit build/desenho.js. Regras do estilo: build/colorir-regras.js.
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const { conferir } = require('./colorir-regras');
const raiz = path.join(__dirname, '..');
const arquivo = () => path.join(process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo'), 'colorir.js');
const pastaPrevia = () => process.env.PREVIA_PASTA || path.join(raiz, 'build/previas');

function lerExistentes(texto) {
  const LB = {};
  new Function('LB', texto)(LB);
  return LB.colorir;
}

// Junta o pedido com o conteúdo: cada desenho ganha id, titulo e emoji.
function montar(pedido, existentes) {
  let ultimo = Math.max(0, ...existentes.map(c => +c.id.split('-')[1]));
  return pedido.map((p, n) => {
    const velho = p.id && existentes.find(c => c.id === p.id);
    if (p.id && !velho) throw new Error('desenho ' + (n + 1) + ': ' + p.id + ' não existe (para criar, tire o id)');
    if (!velho && !(p.titulo && p.emoji)) throw new Error('desenho ' + (n + 1) + ': novo precisa de titulo e emoji');
    const id = velho ? velho.id : 'colorir-' + String(++ultimo).padStart(2, '0');
    return { id, titulo: p.titulo || velho.titulo, emoji: p.emoji || velho.emoji, svg: p.svg, novo: !velho };
  });
}

function gravar(lote, texto) {
  const linhas = texto.split('\n');
  for (const d of lote.filter(x => !x.novo)) {
    const i = linhas.findIndex(l => l.startsWith("{id:'" + d.id + "'"));
    const fim = /,\s*$/.test(linhas[i]) ? ',' : '';
    linhas[i] = escrever({ id: d.id, titulo: d.titulo, emoji: d.emoji, svg: d.svg }) + fim;
  }
  let t = linhas.join('\n');
  const novos = lote.filter(x => x.novo);
  if (novos.length) {
    t = t.replace(/\n\];\s*$/, novos.map(d => ',\n' + escrever({ id: d.id, titulo: d.titulo, emoji: d.emoji, svg: d.svg })).join('') + '\n];\n');
  }
  fs.writeFileSync(arquivo(), t);
}

// Página da prévia: os desenhos lado a lado, com id e título; os enfeites (solto) como no app.
function paginaPrevia(lote) {
  const cel = d => '<figure>' + d.svg.replace('<svg ', '<svg width="300" height="300" data-id="' + d.id + '" ') +
    '<figcaption>' + d.id + ' ' + d.emoji + ' ' + d.titulo + (d.novo ? ' (novo)' : '') + '</figcaption></figure>';
  return '<!doctype html><meta charset="utf-8"><title>Prévia colorir</title><style>body{margin:0;background:#fff;font:14px sans-serif;' +
    'display:flex;flex-wrap:wrap;gap:8px;width:1240px}figure{margin:4px;border:1px solid #ccc;border-radius:8px}' +
    'figcaption{text-align:center;padding:4px}.solto{pointer-events:none}</style>' + lote.map(cel).join('') + '</html>';
}

// Abre a prévia no navegador: salva a foto e avisa desenho que sai da folha (0 a 300).
async function previa(lote) {
  fs.mkdirSync(pastaPrevia(), { recursive: true });
  const html = path.join(pastaPrevia(), 'colorir.html');
  fs.writeFileSync(html, paginaPrevia(lote));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { return { foto: null, fora: {} }; }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1240, height: 400 } });
  await p.goto('file://' + html);
  const fora = await p.evaluate(() => {
    const r = {};
    document.querySelectorAll('svg[data-id]').forEach(s => {
      const c = s.getBBox(), m = 2;
      if (c.x < -m || c.y < -m || c.x + c.width > 300 + m || c.y + c.height > 300 + m) r[s.dataset.id] = 'sai da folha (passa de 0 a 300)';
    });
    return r;
  });
  const foto = path.join(pastaPrevia(), 'colorir.png');
  await p.screenshot({ path: foto, fullPage: true });
  await b.close();
  return { foto, fora };
}

async function principal(args) {
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log('Uso: node build/colorir.js <pedido.js> [--gravar] [--sem-previa]'); return 1; }
  const texto = fs.readFileSync(arquivo(), 'utf8');
  let lote;
  try { lote = montar(require(path.resolve(arq)), lerExistentes(texto)); } catch (e) { console.log('Erro: ' + e.message); return 1; }
  const { foto, fora } = args.includes('--sem-previa') ? { foto: null, fora: {} } : await previa(lote);
  let erros = 0;
  for (const d of lote) {
    const r = conferir(d.svg);
    if (fora[d.id]) r.avisos.push(fora[d.id]);
    erros += r.erros.length;
    const marca = r.erros.length ? '✗' : r.avisos.length ? '!' : '✓';
    console.log(`${marca} ${d.id} ${d.titulo}${d.novo ? ' (novo)' : ''}: ${r.partes} partes` +
      [...r.erros.map(e => ' · ERRO ' + e), ...r.avisos.map(a => ' · ' + a)].join(''));
  }
  if (foto) console.log('Prévia: ' + path.relative(raiz, foto) + ' (e .html ao lado)');
  else if (!args.includes('--sem-previa')) console.log('Prévia: build/previas/colorir.html (sem navegador para a foto)');
  if (erros) { console.log('Nada gravado: corrija ' + erros + ' erro(s).'); return 1; }
  if (!args.includes('--gravar')) { console.log('(prévia; use --gravar para gravar em conteudo/colorir.js)'); return 0; }
  gravar(lote, texto);
  console.log('Gravado: ' + lote.length + ' desenho(s). Agora: node build/tudo.js --mudados');
  return 0;
}

if (require.main === module) principal(process.argv.slice(2)).then(c => process.exit(c));
module.exports = { montar, gravar, paginaPrevia, principal };
