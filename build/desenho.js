// Kit base dos desenhos de colorir (viewBox 300x300): traços e formas simples. As peças prontas (orelha, tronco, torre...)
// ficam em build/pecas/ (lista em build/pecas/PECAS.md). Usar nos pedidos: const k = require('../desenho.js');
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
const marca = (nome, t) => `<g data-peca="${nome}">${t}</g>`;
const nuvem = (x, y, e = 1) => marca('nuvem', f('path', `d="M${x} ${y} Q${x - 8 * e} ${y - 14 * e} ${x + 12 * e} ${y - 16 * e} Q${x + 18 * e} ${y - 34 * e} ${x + 42 * e} ${y - 26 * e} Q${x + 64 * e} ${y - 30 * e} ${x + 66 * e} ${y - 10 * e} Q${x + 80 * e} ${y - 2 * e} ${x + 66 * e} ${y + 8 * e} L${x + 6 * e} ${y + 8 * e} Q${x - 6 * e} ${y + 8 * e} ${x} ${y} Z"`, 'white', 2.5));
// Copa de folhas: contorno ondulado em volta de uma elipse (n ondas). Serve para árvore, arbusto, nuvem fofa.
// varia (0 a 0.2): deixa as ondas de tamanhos diferentes, mais natural.
const copa = (cx, cy, rx, ry, n = 9, giro = 0, sw = 3, varia = 0) => {
  const p = [];
  for (let i = 0; i < n; i++) p.push(polar(0, 0, 1, giro + i * 360 / n));
  const pts = p.map(([x, y], i) => { const m = 1 + varia * Math.sin(i * 2.4 + cx); return [+(cx + rx * m * x).toFixed(1), +(cy + ry * m * y).toFixed(1)]; });
  const d = pts.map(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % n], r = (Math.hypot(nx - x, ny - y) * 0.62).toFixed(1);
    return `A${r} ${r} 0 0 1 ${nx} ${ny}`;
  }).join(' ');
  return marca('copa', f('path', `d="M${pts[0][0]} ${pts[0][1]} ${d} Z"`, 'white', sw));
};
const colina = (y = 268, onda = 20, meio = y + 2) => marca('colina', f('path', `d="M0 300 L0 ${y} Q75 ${y - onda} 150 ${meio} Q225 ${y - onda} 300 ${y} L300 300 Z"`));
const svg = (...p) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' + p.join('') + '</svg>';
// Descrição de cada ajudante, para a lista build/pecas/PECAS.md (gerada por node build/biblioteca.js).
const AJUDA = {
  f: 'f(tag, atributos, fundo, traço): forma pintável com contorno preto arredondado',
  solto: 'solto(d, traço): enfeite que não pinta (sorriso, bigode, casca, cabinho)',
  olho: 'olho(x, y, r): bolinha preta que não pinta (pupila)',
  espelhar: 'espelhar(...partes): desenha a metade direita e copia espelhada à esquerda (eixo x=150)',
  polar: 'polar(cx, cy, r, graus): ponto num círculo (raios, pétalas)',
  nuvem: 'nuvem(x, y, escala): nuvem pequena de céu',
  copa: 'copa(cx, cy, rx, ry, ondas, giro, traço, varia): contorno de folhas ondulado (árvore, arbusto, nuvem fofa)',
  colina: 'colina(y, onda, meio): chão ondulado de ponta a ponta',
  svg: 'svg(...partes): folha 300x300 pronta'
};
module.exports = { f, solto, olho, grupo, espelhar, polar, nuvem, copa, colina, svg, AJUDA };
