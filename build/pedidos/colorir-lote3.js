// Lote 3 de desenhos (19/11): bola, nuvem com sol, estrelas, balão, casa. Rodar: node build/colorir.js build/pedidos/colorir-lote3.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar } = require('../desenho.js');
const p = require('../pecas/index.js');

const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2].map(n => +n.toFixed(1));
// Polígono de pontas redondas (n lados): estrela (R, r) ou pentágono (R = r).
const redondo = (cx, cy, R, r, n, giro = -90, sw = 3) => {
  const v = Array.from({ length: n * 2 }, (_, i) => polar(cx, cy, i % 2 ? r : R, giro + i * 180 / n));
  let d = 'M' + m(v[v.length - 1], v[0]).join(' ');
  v.forEach((q, i) => { d += ` Q${q.join(' ')} ${m(q, v[(i + 1) % v.length]).join(' ')}`; });
  return f('path', `d="${d} Z"`, 'white', sw);
};
const estrela = (cx, cy, R, r, giro = -90, sw = 3) => redondo(cx, cy, R, r, 5, giro, sw);
const pentagono = (cx, cy, R, giro = -90) => redondo(cx, cy, R, R * 0.8, 5, giro, 2.5);

const bola = svg(
  f('circle', 'cx="254" cy="44" r="22"'), p.raiosSol({ x: 254, y: 44, e: 0.24 }),
  nuvem(20, 44, 0.9), colina(262, 24),
  f('ellipse', 'cx="150" cy="268" rx="70" ry="11"', 'white', 2.5),
  f('circle', 'cx="150" cy="166" r="94"'),
  ...[0, 1, 2, 3, 4].map(i => { const [x, y] = polar(150, 166, 70, -90 + i * 72); return pentagono(x, y, 21, -90 + i * 72 + 36); }),
  pentagono(150, 166, 30),
  ...[0, 1, 2, 3, 4].map(i => { const [a, b] = polar(150, 166, 36, -90 + i * 72), [c, d] = polar(150, 166, 50, -90 + i * 72); return solto(`M${a} ${b} L${c} ${d}`, 2.5); }),
  p.flor({ x: 44, y: 280 }), p.flor({ x: 262, y: 278, e: 1.1 }), p.tufo({ x: 90 }), p.tufo({ x: 210 })
);

const solNuvem = svg(
  p.raiosSol({ x: 88, y: 106, e: 0.6 }), p.discoSol({ x: 88, y: 106, e: 0.6 }),
  copa(170, 148, 100, 50, 9, 8, 3, 0.1),
  copa(66, 198, 46, 24, 7, 0, 3, 0.1),
  p.rostoFeliz({ x: 170, y: 148, e: 0.7 }),
  nuvem(206, 44, 0.9),
  solto('M226 218 Q236 208 246 218 Q256 208 266 218', 2.5), solto('M250 238 Q258 230 266 238 Q274 230 282 238', 2.5),
  colina(272, 14), p.flor({ x: 60, y: 286 }), p.flor({ x: 236, y: 284 }), p.tufo({ x: 150 })
);

const estrelas = svg(
  f('path', 'd="M60 130 A46 46 0 1 0 84 214 A36 36 0 1 1 60 130 Z"'),
  estrela(150, 134, 92, 44), estrela(150, 134, 56, 27, -90, 2.5),
  f('circle', 'cx="150" cy="140" r="18"', 'white', 2.5),
  olho(143, 136, 3.2), olho(157, 136, 3.2), solto('M142 146 Q150 154 158 146', 2.5),
  estrela(48, 48, 26, 12), estrela(250, 50, 30, 14), estrela(262, 168, 20, 9), estrela(236, 246, 26, 12), estrela(184, 270, 14, 6),
  estrela(196, 26, 12, 5), nuvem(70, 284, 0.9)
);

const balao = svg(
  f('circle', 'cx="40" cy="48" r="22"'), p.raiosSol({ x: 40, y: 48, e: 0.22 }),
  nuvem(206, 66, 0.9), nuvem(30, 222, 0.8), nuvem(204, 250, 0.9),
  f('path', 'd="M150 22 C62 22 36 118 92 172 C108 188 124 196 132 202 L168 202 C176 196 192 188 208 172 C264 118 238 22 150 22 Z"'),
  f('path', 'd="M150 22 C108 40 92 112 116 178 L132 202 C116 150 118 70 150 22 Z"'),
  f('path', 'd="M150 22 C192 40 208 112 184 178 L168 202 C184 150 182 70 150 22 Z"'),
  f('path', 'd="M150 22 C122 56 116 150 134 202 L166 202 C184 150 178 56 150 22 Z"'),
  solto('M116 150 Q150 164 184 150', 2.5), solto('M126 104 Q150 114 174 104', 2.5),
  f('path', 'd="M150 206 Q140 220 150 228 Q160 220 150 206 Z"', 'white', 2.5),
  solto('M134 202 L124 236', 2.5), solto('M166 202 L176 236', 2.5),
  f('path', 'd="M118 236 L182 236 Q184 274 172 282 Q150 288 128 282 Q116 274 118 236 Z"'),
  solto('M120 252 Q150 260 180 252', 2.5), solto('M122 268 Q150 276 178 268', 2.5),
  colina(288, 10)
);

const casa = svg(
  f('circle', 'cx="248" cy="46" r="24"'), p.raiosSol({ x: 248, y: 46, e: 0.26 }), nuvem(24, 56, 0.9),
  colina(266, 16),
  f('rect', 'x="196" y="62" width="26" height="62" rx="5"'),
  solto('M200 52 Q190 38 204 30 Q216 22 210 10', 2.5),
  f('rect', 'x="62" y="124" width="176" height="146" rx="10"'),
  f('path', 'd="M40 134 Q42 124 56 112 L142 40 Q150 34 158 40 L244 112 Q258 124 260 134 Q258 142 246 142 L54 142 Q42 142 40 134 Z"'),
  f('circle', 'cx="150" cy="96" r="18"', 'white', 2.5), solto('M150 78 L150 114', 2), solto('M132 96 L168 96', 2),
  p.portaArco({ x: 150, y: 270 }),
  p.janelaArco({ x: 100, y: 214, meia: 20, altura: 34, ombro: 12 }), p.janelaArco({ x: 200, y: 214, meia: 20, altura: 34, ombro: 12 }),
  p.flor({ x: 52, y: 282 }), p.flor({ x: 258, y: 280, e: 1.1 }), p.tufo({ x: 290 }), p.tufo({ x: 14 })
);

module.exports = [
  { id: 'colorir-09', svg: bola }, { id: 'colorir-12', svg: solNuvem }, { id: 'colorir-14', svg: estrelas },
  { id: 'colorir-23', svg: balao }, { id: 'colorir-04', svg: casa }
];
