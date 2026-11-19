// Formas de pontas redondas, tiradas do lote 3 (colorir-09 bola, colorir-14 estrelas). Centro em 0,0: usar com x, y.
'use strict';
const { f, polar } = require('../desenho.js');
const tema = 'formas';
const meio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2].map(n => +n.toFixed(1));
// n pontas, vértices alternados (R fora, r dentro) viram curvas com o vértice como controle.
const redondo = (R, r, n, giro, sw) => {
  const v = Array.from({ length: n * 2 }, (_, i) => polar(0, 0, i % 2 ? r : R, giro + i * 180 / n));
  let d = 'M' + meio(v[v.length - 1], v[0]).join(' ');
  v.forEach((q, i) => { d += ` Q${q.join(' ')} ${meio(q, v[(i + 1) % v.length]).join(' ')}`; });
  return f('path', `d="${d} Z"`, 'white', sw);
};

module.exports = [
  { nome: 'estrela', descricao: 'estrela de cinco pontas redondas (opções R: raio de fora 30, r: raio de dentro, padrão 0,47 de R, giro, sw: traço 3)', ancora: [0, 0],
    desenho: (o) => { const R = o.R || 30; return redondo(R, o.r || R * 0.47, 5, o.giro ?? -90, o.sw || 3); } },
  { nome: 'pentagono', descricao: 'pentágono de cantos redondos, remendo de bola (opções R: raio 22, giro; traço 2,5)', ancora: [0, 0],
    desenho: (o) => { const R = o.R || 22; return redondo(R, R * 0.8, 5, o.giro ?? -90, 2.5); } }
].map(p => Object.assign(p, { tema }));
