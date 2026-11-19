// Kit de peças para desenhos de colorir (viewBox 300x300). Usar nos pedidos: const k = require('../desenho.js');
// Regras do estilo: só curvas e cantos arredondados; toda forma fechada, fundo branco, contorno preto;
// as de baixo primeiro (as de cima cobrem o contorno que sobrar); enfeites (sorriso, bigode) usam solto() e não pintam.
'use strict';
const RED = 'stroke-linejoin="round" stroke-linecap="round"';
const f = (tag, a, fill = 'white', sw = 3) => `<${tag} ${a} fill="${fill}" stroke="black" stroke-width="${sw}" ${RED}/>`;
const solto = (d, sw = 2.5) => `<path d="${d}" class="solto" fill="none" stroke="black" stroke-width="${sw}" ${RED}/>`;
const olho = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="black" class="solto"/>`;
const grupo = (...p) => '<g>' + p.join('') + '</g>';
// Metade desenhada à direita do eixo x=150, espelhada à esquerda (simetria perfeita).
const espelhar = (...p) => grupo(...p) + `<g transform="translate(300,0) scale(-1,1)">${p.join('')}</g>`;
const polar = (cx, cy, r, graus) => { const a = graus * Math.PI / 180; return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]; };
const nuvem = (x, y, e = 1) => f('path', `d="M${x} ${y} Q${x - 8 * e} ${y - 14 * e} ${x + 12 * e} ${y - 16 * e} Q${x + 18 * e} ${y - 34 * e} ${x + 42 * e} ${y - 26 * e} Q${x + 64 * e} ${y - 30 * e} ${x + 66 * e} ${y - 10 * e} Q${x + 80 * e} ${y - 2 * e} ${x + 66 * e} ${y + 8 * e} L${x + 6 * e} ${y + 8 * e} Q${x - 6 * e} ${y + 8 * e} ${x} ${y} Z"`, 'white', 2.5);
// Copa de folhas: contorno ondulado em volta de uma elipse (n ondas). Serve para árvore, arbusto, nuvem fofa.
const copa = (cx, cy, rx, ry, n = 9, giro = 0, sw = 3) => {
  const p = [];
  for (let i = 0; i < n; i++) p.push(polar(0, 0, 1, giro + i * 360 / n));
  const pts = p.map(([x, y]) => [+(cx + rx * x).toFixed(1), +(cy + ry * y).toFixed(1)]);
  const d = pts.map(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % n], r = (Math.hypot(nx - x, ny - y) * 0.62).toFixed(1);
    return `A${r} ${r} 0 0 1 ${nx} ${ny}`;
  }).join(' ');
  return f('path', `d="M${pts[0][0]} ${pts[0][1]} ${d} Z"`, 'white', sw);
};
const colina = (y = 268) => f('path', `d="M0 300 L0 ${y} Q75 ${y - 20} 150 ${y + 2} Q225 ${y - 20} 300 ${y} L300 300 Z"`);
const svg = (...p) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + p.join('') + '</svg>';
module.exports = { f, solto, olho, grupo, espelhar, polar, nuvem, copa, colina, svg };
