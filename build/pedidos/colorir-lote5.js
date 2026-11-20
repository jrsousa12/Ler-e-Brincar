// Lote 5 de desenhos (19/11; suavizado 20/11): carro, sapo, arco-íris, bolo, estrela-do-mar. Rodar: node build/colorir.js build/pedidos/colorir-lote5.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');
const { caixa, estrela, solMini, ov } = require('./_curvas.js');

const sol = (x, y) => [solMini(x, y, 30)];

// ---- Carro: cavas de roda no corpo, motorista sorrindo, retrovisor e grade ----
const carro = svg(
  ...sol(254, 46), nuvem(18, 50, 0.9), colina(282, 10),
  f('path', 'd="M50 152 Q58 96 98 94 L150 94 Q190 98 214 152 Z"'),
  f('path', 'd="M26 196 Q26 150 70 148 L248 148 Q290 150 292 196 L292 228 Q292 242 278 242 L258 242 A38 38 0 0 0 182 242 L132 242 A38 38 0 0 0 56 242 L40 242 Q26 242 26 228 Z"'),
  f('path', 'd="M68 148 Q74 114 98 110 L118 110 L118 148 Z"', 'white', 2.5), f('path', 'd="M132 110 L152 110 Q180 114 198 148 L132 148 Z"', 'white', 2.5),
  ov(158, 130, 13, 13, 0, 2.5, 'white'), olho(153, 128, 2.5), olho(163, 128, 2.5), solto('M152 135 Q158 140 164 135', 2),
  solto('M125 152 L125 236', 2.5), solto('M136 176 L154 176', 3), solto('M206 148 Q214 138 222 142', 3),
  ov(278, 184, 10, 13, 0, 2.5, 'white'), ov(42, 186, 9, 9, 0, 2.5, 'white'),
  caixa(250, 202, 38, 10, 5, 'white', 2.5), caixa(30, 206, 26, 10, 5, 'white', 2.5),
  f('circle', 'cx="94" cy="244" r="31"'), f('circle', 'cx="94" cy="244" r="17"', 'white', 2.5), f('circle', 'cx="94" cy="244" r="6"', 'white', 2.5),
  f('circle', 'cx="220" cy="244" r="31"'), f('circle', 'cx="220" cy="244" r="17"', 'white', 2.5), f('circle', 'cx="220" cy="244" r="6"', 'white', 2.5),
  p.flor({ x: 44, y: 286 }), p.flor({ x: 262, y: 286, e: 1.1 })
);

// ---- Sapo: coxas, patinhas, barriga, mãos redondas e olhos grandes ----
const sapo = svg(
  ...sol(254, 44), nuvem(18, 50, 0.9), colina(272, 12),
  ov(150, 268, 122, 20, 0, 3, 'white'),
  espelhar(ov(226, 214, 38, 54, 18, 3, 'white'), ov(236, 266, 40, 11, 0, 3, 'white'), ov(272, 262, 7, 7, 0, 2.5, 'white'), ov(278, 274, 7, 7, 0, 2.5, 'white'), ov(262, 276, 6, 6, 0, 2.5, 'white')),
  ov(150, 198, 82, 72, 0, 3, 'white'), ov(150, 214, 52, 48, 0, 2.5, 'white'),
  ov(150, 120, 84, 52, 0, 3, 'white'),
  espelhar(f('path', 'd="M188 198 Q206 200 208 228 L208 248 Q208 258 196 258 Q182 258 182 248 L180 228 Q178 204 188 198 Z"'), ov(196, 262, 17, 9, 0, 2.5, 'white')),
  espelhar(ov(192, 80, 26, 26, 0, 3, 'white'), ov(192, 82, 16, 16, 0, 2.5, 'white'), olho(192, 84, 7), ov(218, 128, 11, 7, 0, 2.5, 'white')),
  solto('M92 126 Q150 168 208 126', 3), olho(142, 100, 2.5), olho(158, 100, 2.5),
  ov(150, 66, 7, 7, 0, 2.5, 'white'), ov(134, 74, 5, 5, 0, 2.5, 'white'), ov(166, 74, 5, 5, 0, 2.5, 'white'),
  solto('M240 120 Q250 98 266 126', 2), ov(272, 134, 9, 6, 0, 2.5, 'white'), ov(266, 122, 7, 4, 0, 2, 'white')
);

// ---- Arco-íris: faixas largas, sol e nuvens com carinha ----
const faixa = (ro, ri) => f('path', `d="M${150 - ro} 252 A${ro} ${ro} 0 0 1 ${150 + ro} 252 L${150 + ri} 252 A${ri} ${ri} 0 0 0 ${150 - ri} 252 Z"`);
const arco = svg(
  ...sol(52, 56), nuvem(204, 52, 0.9),
  ...[[144, 122], [122, 100], [100, 78], [78, 56], [56, 34]].map(([a, b]) => faixa(a, b)),
  f('path', 'd="M116 252 A34 34 0 0 1 184 252 Z"'),
  copa(66, 254, 58, 32, 8, 0, 3, 0.1), copa(234, 254, 58, 32, 8, 10, 3, 0.1),
  olho(54, 250, 3.5), olho(78, 250, 3.5), solto('M58 262 Q66 270 74 262', 2.5), olho(222, 250, 3.5), olho(246, 250, 3.5), solto('M226 262 Q234 270 242 262', 2.5),
  colina(286, 8), p.flor({ x: 150, y: 286 }), p.flor({ x: 44, y: 284 }), p.flor({ x: 256, y: 284 })
);

// ---- Bolo: cobertura simétrica com gotas, cerejas, velas, fita e bandeirinhas ----
// Cobertura de bolo: tampa lisa em cima e gotas embaixo (n gotas, profundidades alternadas).
const cobertura = (x0, x1, yt, yb, n, fundo, rasa) => {
  const w = (x1 - x0) / n; let d = `M${x0} ${yb} Q${x0} ${yt} ${x0 + 16} ${yt} L${x1 - 16} ${yt} Q${x1} ${yt} ${x1} ${yb}`;
  for (let i = 0; i < n; i++) d += ` Q${+(x1 - w * (i + 0.5)).toFixed(1)} ${yb + (i % 2 ? rasa : fundo)} ${+(x1 - w * (i + 1)).toFixed(1)} ${yb}`;
  return f('path', `d="${d} Z"`);
};
const vela = x => [caixa(x, 62, 12, 44, 5), solto(`M${x} 78 L${x + 12} 72 M${x} 94 L${x + 12} 88`, 2), f('path', `d="M${x + 6} 58 Q${x - 8} 42 ${x + 6} 22 Q${x + 20} 42 ${x + 6} 58 Z"`, 'white', 2.5)];
const bandeira = t => {
  const x = 300 * t, y = +(14 * (1 - t) ** 2 + 2 * 50 * (1 - t) * t + 14 * t * t).toFixed(1);
  return f('path', `d="M${x - 15} ${y} L${x + 15} ${y} Q${x + 15} ${y + 20} ${x} ${y + 36} Q${x - 15} ${y + 20} ${x - 15} ${y} Z"`, 'white', 2.5);
};
const bolo = svg(
  solto('M0 14 Q150 86 300 14', 2.5), ...[0.06, 0.16, 0.26, 0.74, 0.84, 0.94].map(bandeira),
  estrela(40, 132, 16, 7), estrela(262, 120, 20, 9), estrela(30, 196, 11, 5), estrela(272, 186, 12, 5),
  colina(288, 6), ov(150, 264, 126, 20, 0, 3, 'white'),
  caixa(50, 180, 200, 82, 16),
  f('rect', 'x="50" y="236" width="200" height="14"', 'white', 2.5),
  cobertura(50, 250, 172, 206, 5, 36, 20),
  caixa(92, 108, 116, 64, 14),
  cobertura(92, 208, 102, 134, 3, 34, 34),
  ...vela(118), ...vela(144), ...vela(170),
  ov(96, 98, 9, 9, 0, 2.5, 'white'), solto('M96 89 Q100 80 106 78', 2), ov(204, 98, 9, 9, 0, 2.5, 'white'), solto('M204 89 Q200 80 194 78', 2),
  ...[70, 110, 150, 190, 230].map(x => ov(x, x % 80 ? 196 : 202, 6, 6, x, 2.5))
);

// ---- Estrela-do-mar: braços curvos de pontas redondas, bolinhas, estrelinha e concha ----
const estrelaCurva = (cx, cy, R, rc = 0.26) => {
  const q = (r, g) => polar(cx, cy, r, g).join(' ');
  let d = `M${q(R * 0.9, -96)}`;
  for (let i = 0; i < 5; i++) {
    const a = -90 + i * 72;
    d += ` Q${q(R * 1.06, a)} ${q(R * 0.9, a + 6)} Q${q(R * rc, a + 36)} ${q(R * 0.9, a + 72 - 6)}`;
  }
  return f('path', `d="${d} Z"`);
};
const estrelaMar = svg(
  solto('M10 26 Q40 14 70 26 Q100 38 130 26 Q160 14 190 26 Q220 38 250 26 Q270 20 290 26', 2.5),
  ov(40, 72, 11, 11, 0, 2.5, 'white'), ov(66, 46, 7, 7, 0, 2.5, 'white'), ov(262, 84, 10, 10, 0, 2.5, 'white'), ov(276, 116, 6, 6, 0, 2.5, 'white'),
  colina(278, 14),
  f('path', 'd="M246 292 Q228 256 250 226 Q256 256 268 266 Q272 244 290 224 Q292 262 276 292 Z"'),
  f('path', 'd="M14 292 Q2 262 18 242 Q28 266 36 292 Z"'),
  estrelaCurva(150, 146, 118),
  ...[0, 1, 2, 3, 4].flatMap(i => [[52, 7], [74, 5.5], [96, 4]].map(([r, t]) => { const [x, y] = polar(150, 146, r, -90 + i * 72); return ov(x, y, t, t, r, 2.5); })),
  ov(150, 146, 30, 30, 0, 2.5, 'white'), olho(139, 140, 3.5), olho(161, 140, 3.5), solto('M138 154 Q150 164 162 154', 2.5),
  f('path', 'd="M64 292 Q48 258 80 246 Q112 258 96 292 Z"', 'white', 2.5), solto('M80 250 L80 290 M70 252 L63 288 M90 252 L97 288', 2),
  estrelaCurva(210, 276, 22, 0.3), olho(204, 274, 2), olho(216, 274, 2)
);

module.exports = [
  { id: 'colorir-08', svg: carro }, { id: 'colorir-17', svg: sapo }, { id: 'colorir-20', svg: arco },
  { id: 'colorir-24', svg: bolo }, { id: 'colorir-25', svg: estrelaMar }
];
