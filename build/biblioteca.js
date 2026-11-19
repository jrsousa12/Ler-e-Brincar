// Lista e prévia da biblioteca de peças (build/pecas/). Gerado: nunca editar PECAS.md à mão.
// Uso: node build/biblioteca.js              atualiza build/pecas/PECAS.md e a foto build/previas/pecas.png
//      node build/biblioteca.js --conferir   falha se PECAS.md estiver desatualizado (sem navegador)
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const { AJUDA } = require('./desenho.js');
const pecas = require('./pecas/index.js');
const { conferir } = require('./colorir-regras');
const md = path.join(__dirname, 'pecas/PECAS.md');

function lista() {
  const linhas = ['# Peças dos desenhos de colorir', '',
    'Gerado por `node build/biblioteca.js` (não editar à mão). Foto de todas: `build/previas/pecas.png`.', '',
    'Desenho novo: montar com estas peças; o que faltar, desenhar como peça nova numa ficha de `build/pecas/` e rodar o motor de novo.',
    'Colocar: `p.nome({ x, y, e, espelho })` (sem x/y fica onde foi aprovada; `e` = escala, o traço não engrossa).', '',
    '## Base (`build/desenho.js`)', ...Object.values(AJUDA).map(t => '- ' + t)];
  for (const t of pecas.TEMAS) {
    linhas.push('', '## ' + t + ' (`build/pecas/' + t + '.js`)');
    for (const [nome, c] of Object.entries(pecas)) {
      if (c.def && c.def.tema === t) linhas.push(`- **${nome}** (encaixe ${c.def.ancora.join(',')}): ${c.def.descricao}`);
    }
  }
  return linhas.join('\n') + '\n';
}

// Confere cada peça com as regras de estilo (sem o mínimo de partes, que vale para o desenho inteiro).
function problemas() {
  const r = [];
  for (const [nome, c] of Object.entries(pecas)) {
    if (!c.def) continue;
    const s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + c() + '</svg>';
    for (const e of conferir(s).erros) r.push(nome + ': ' + e);
  }
  return r;
}

async function previa() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { return null; }
  const cel = ([n, c]) => `<figure><svg width="140" height="140" data-p="1">${c()}</svg><figcaption>${n}</figcaption></figure>`;
  const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;display:flex;flex-wrap:wrap;width:1200px;font:12px sans-serif}' +
    'figure{margin:4px;border:1px solid #ccc;border-radius:6px;text-align:center}</style>' +
    Object.entries(pecas).filter(([, c]) => c.def).map(cel).join('');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 300 } });
  await p.setContent(html);
  await p.evaluate(() => document.querySelectorAll('svg[data-p]').forEach(s => {
    const c = s.getBBox(), m = 4; s.setAttribute('viewBox', `${c.x - m} ${c.y - m} ${c.width + 2 * m} ${c.height + 2 * m}`);
  }));
  const foto = path.join(raiz, 'build/previas/pecas.png');
  fs.mkdirSync(path.dirname(foto), { recursive: true });
  await p.screenshot({ path: foto, fullPage: true });
  await b.close();
  return foto;
}

async function principal(args) {
  const erros = problemas();
  erros.forEach(e => console.log('ERRO ' + e));
  const texto = lista(), total = Object.values(pecas).filter(c => c.def).length;
  if (args.includes('--conferir')) {
    const ok = fs.existsSync(md) && fs.readFileSync(md, 'utf8') === texto;
    console.log(ok && !erros.length ? `PECAS.md em dia (${total} peças).` : ok ? 'Peças com erro.' : 'PECAS.md desatualizado: rode node build/biblioteca.js');
    return ok && !erros.length ? 0 : 1;
  }
  fs.writeFileSync(md, texto);
  const foto = await previa();
  console.log(`PECAS.md atualizado: ${total} peças.` + (foto ? ' Foto: ' + path.relative(raiz, foto) : ''));
  return erros.length ? 1 : 0;
}

if (require.main === module) principal(process.argv.slice(2)).then(c => process.exit(c));
module.exports = { lista, problemas };
