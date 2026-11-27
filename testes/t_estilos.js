// Teste guardado: organização do CSS (Etapa A, 27/11). Uso: node testes/t_estilos.js
// Confere: todo CSS de css/ está no index.html e no sw.js; cada seletor tem um só dono
// (base, peças ou tela), fora os arquivos que só ajustam por cima (temas, tablet, movimento, impressão);
// e a lista de telas do motor antes/depois carrega.
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// Todos os .css de css/ (com subpastas)
const todos = [];
(function andar(dir) {
  for (const f of fs.readdirSync(path.join(raiz, dir))) {
    const rel = dir + '/' + f;
    if (fs.statSync(path.join(raiz, rel)).isDirectory()) andar(rel); else if (f.endsWith('.css')) todos.push(rel);
  }
})('css');

const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(raiz, 'sw.js'), 'utf8');
const ligados = [...html.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)">/g)].map(m => m[1]);
for (const f of todos) {
  ok(ligados.includes(f), `${f} não está no index.html`);
  ok(sw.includes(`'${f}'`), `${f} não está na lista do sw.js`);
}
for (const f of ligados) ok(todos.includes(f), `index.html liga ${f}, que não existe`);
ok(ligados[0] === 'css/fontes.css' && ligados[1] === 'css/base.css', 'fontes e base vêm primeiro');
ok(ligados[ligados.length - 1] === 'css/movimento.css', 'movimento vem por último');
const pos = (f) => ligados.indexOf(f);
ok(ligados.filter(f => f.startsWith('css/pecas/')).every(f => pos(f) < pos('css/telas/inicio.css')), 'peças vêm antes das telas');

// Seletores fora de @media: cada um num só arquivo (os de ajuste por cima podem repetir)
const POR_CIMA = ['css/tema-creme.css', 'css/escuro.css', 'css/tablet.css', 'css/movimento.css', 'css/impressao.css'];
const dono = {};
for (const f of todos.filter(f => !POR_CIMA.includes(f))) {
  let t = fs.readFileSync(path.join(raiz, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // tira os blocos @media/@keyframes inteiros (com as chaves de dentro)
  let i;
  while ((i = t.indexOf('@')) >= 0) {
    let j = t.indexOf('{', i), n = 1, k = j + 1;
    if (j < 0) break;
    for (; k < t.length && n; k++) n += t[k] === '{' ? 1 : t[k] === '}' ? -1 : 0;
    t = t.slice(0, i) + t.slice(k);
  }
  for (const m of t.matchAll(/([^{}]+)\{[^}]*\}/g)) {
    for (const sel of m[1].split(',').map(s => s.trim()).filter(Boolean)) {
      if (dono[sel] && dono[sel] !== f) ok(false, `"${sel}" está em ${dono[sel]} e em ${f} (deixar num só)`);
      dono[sel] = f;
    }
  }
}
ok(Object.keys(dono).length > 150, 'poucos seletores lidos: ' + Object.keys(dono).length);

// Motor antes/depois: lista de telas única
const t = require(path.join(raiz, 'build/capturas-telas'));
ok(t.TELAS.length >= 14 && t.TELAS_EXTRAS.length >= 10, 'lista de telas do motor antes/depois');
ok(t.TELAS_EXTRAS.every(([, , antes]) => !antes || [...t.TELAS, ...t.TELAS_EXTRAS].some(([n]) => n === antes)), 'tela de partida inexistente');

console.log(falhas ? `t_estilos: ${falhas} falha(s)` : `t_estilos: ok (${todos.length} CSS, ${Object.keys(dono).length} seletores com dono único)`);
process.exit(falhas ? 1 : 0);
