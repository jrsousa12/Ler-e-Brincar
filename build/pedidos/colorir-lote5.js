// Lote 5 de desenhos (19/11): carro, sapo, arco-íris, bolo, estrela-do-mar. Rodar: node build/colorir.js build/pedidos/colorir-lote5.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');

const sol = (x, y) => [f('circle', `cx="${x}" cy="${y}" r="22"`), p.raiosSol({ x, y, e: 0.24 })];

// ---- Carro: cavas de roda no corpo, motorista sorrindo, retrovisor e grade ----
const carro = svg(
  ...sol(254, 46), nuvem(18, 50, 0.9), colina(282, 10),
  f('path', 'd="M78 154 Q90 96 138 94 L194 94 Q238 96 250 154 Z"'),
  f('path', 'd="M26 196 Q26 150 70 148 L248 148 Q290 150 292 196 L292 228 Q292 242 278 242 L258 242 A38 38 0 0 0 182 242 L132 242 A38 38 0 0 0 56 242 L40 242 Q26 242 26 228 Z"'),
  f('path', 'd="M96 148 Q104 112 136 108 L136 148 Z"', 'white', 2.5), f('path', 'd="M152 108 L188 108 Q220 112 230 148 L152 148 Z"', 'white', 2.5),
  f('circle', 'cx="192" cy="130" r="13"', 'white', 2.5), olho(187, 128, 2.5), olho(197, 128, 2.5), solto('M186 135 Q192 140 198 135', 2),
  solto('M144 152 L144 236', 2.5), solto('M154 176 L172 176', 3), solto('M244 150 Q248 140 254 142', 3),
  f('ellipse', 'cx="278" cy="184" rx="10" ry="13"', 'white', 2.5), f('circle', 'cx="42" cy="186" r="9"', 'white', 2.5),
  f('rect', 'x="250" y="202" width="38" height="10" rx="5"', 'white', 2.5), f('rect', 'x="30" y="206" width="26" height="10" rx="5"', 'white', 2.5),
  f('circle', 'cx="94" cy="244" r="31"'), f('circle', 'cx="94" cy="244" r="17"', 'white', 2.5), f('circle', 'cx="94" cy="244" r="6"', 'white', 2.5),
  f('circle', 'cx="220" cy="244" r="31"'), f('circle', 'cx="220" cy="244" r="17"', 'white', 2.5), f('circle', 'cx="220" cy="244" r="6"', 'white', 2.5),
  p.flor({ x: 44, y: 286 }), p.flor({ x: 262, y: 286, e: 1.1 })
);

// ---- Sapo: coxas, patinhas, barriga, mãos redondas e olhos grandes ----
const sapo = svg(
  ...sol(254, 44), nuvem(18, 50, 0.9), colina(272, 12),
  f('ellipse', 'cx="150" cy="268" rx="122" ry="20"'),
  espelhar(f('path', 'd="M196 196 Q262 176 270 236 Q272 266 238 266 L192 266 Q168 244 196 196 Z"'), f('circle', 'cx="254" cy="262" r="9"', 'white', 2.5), f('circle', 'cx="234" cy="270" r="9"', 'white', 2.5), f('circle', 'cx="236" cy="226" r="8"', 'white', 2.5)),
  f('ellipse', 'cx="150" cy="198" rx="82" ry="72"'), f('ellipse', 'cx="150" cy="214" rx="52" ry="48"', 'white', 2.5),
  f('ellipse', 'cx="150" cy="120" rx="84" ry="52"'),
  espelhar(f('path', 'd="M188 198 Q206 200 208 228 L208 248 Q208 258 196 258 Q182 258 182 248 L180 228 Q178 204 188 198 Z"'), f('ellipse', 'cx="196" cy="262" rx="17" ry="9"', 'white', 2.5)),
  espelhar(f('circle', 'cx="192" cy="80" r="26"'), f('circle', 'cx="192" cy="82" r="16"', 'white', 2.5), olho(192, 84, 7), f('ellipse', 'cx="218" cy="128" rx="11" ry="7"', 'white', 2.5)),
  solto('M92 126 Q150 168 208 126', 3), olho(142, 100, 2.5), olho(158, 100, 2.5),
  f('circle', 'cx="150" cy="66" r="7"', 'white', 2.5), f('circle', 'cx="134" cy="74" r="5"', 'white', 2.5), f('circle', 'cx="166" cy="74" r="5"', 'white', 2.5),
  solto('M240 120 Q250 98 266 126', 2), f('ellipse', 'cx="272" cy="134" rx="9" ry="6"', 'white', 2.5), f('ellipse', 'cx="266" cy="122" rx="7" ry="4"', 'white', 2),
  p.flor({ x: 44, y: 286 }), p.flor({ x: 258, y: 286 })
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
const vela = x => [f('rect', `x="${x}" y="62" width="12" height="44" rx="4"`), solto(`M${x} 78 L${x + 12} 72 M${x} 94 L${x + 12} 88`, 2), f('path', `d="M${x + 6} 58 Q${x - 8} 42 ${x + 6} 22 Q${x + 20} 42 ${x + 6} 58 Z"`, 'white', 2.5)];
const bandeira = t => {
  const x = 300 * t, y = +(14 * (1 - t) ** 2 + 2 * 50 * (1 - t) * t + 14 * t * t).toFixed(1);
  return f('path', `d="M${x - 15} ${y} L${x + 15} ${y} Q${x + 15} ${y + 20} ${x} ${y + 36} Q${x - 15} ${y + 20} ${x - 15} ${y} Z"`, 'white', 2.5);
};
const bolo = svg(
  solto('M0 14 Q150 86 300 14', 2.5), ...[0.06, 0.16, 0.26, 0.74, 0.84, 0.94].map(bandeira),
  p.estrela({ x: 40, y: 132, R: 16, r: 7 }), p.estrela({ x: 262, y: 120, R: 20, r: 9 }), p.estrela({ x: 30, y: 196, R: 11, r: 5 }), p.estrela({ x: 272, y: 186, R: 12, r: 5 }),
  colina(288, 6), f('ellipse', 'cx="150" cy="264" rx="126" ry="20"'),
  f('rect', 'x="50" y="180" width="200" height="82" rx="16"'),
  f('rect', 'x="50" y="236" width="200" height="14"', 'white', 2.5),
  cobertura(50, 250, 172, 206, 5, 36, 20),
  f('rect', 'x="92" y="108" width="116" height="64" rx="14"'),
  cobertura(92, 208, 102, 134, 3, 34, 34),
  ...vela(118), ...vela(144), ...vela(170),
  f('circle', 'cx="96" cy="98" r="9"', 'white', 2.5), solto('M96 89 Q100 80 106 78', 2), f('circle', 'cx="204" cy="98" r="9"', 'white', 2.5), solto('M204 89 Q200 80 194 78', 2),
  ...[70, 110, 150, 190, 230].map(x => f('circle', `cx="${x}" cy="${x % 80 ? 196 : 202}" r="6"`, 'white', 2.5))
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
  f('circle', 'cx="40" cy="72" r="11"', 'white', 2.5), f('circle', 'cx="66" cy="46" r="7"', 'white', 2.5), f('circle', 'cx="262" cy="84" r="10"', 'white', 2.5), f('circle', 'cx="276" cy="116" r="6"', 'white', 2.5),
  colina(278, 14),
  f('path', 'd="M246 292 Q228 256 250 226 Q256 256 268 266 Q272 244 290 224 Q292 262 276 292 Z"'),
  f('path', 'd="M14 292 Q2 262 18 242 Q28 266 36 292 Z"'),
  estrelaCurva(150, 146, 118),
  ...[0, 1, 2, 3, 4].flatMap(i => [[52, 7], [74, 5.5], [96, 4]].map(([r, t]) => { const [x, y] = polar(150, 146, r, -90 + i * 72); return f('circle', `cx="${x}" cy="${y}" r="${t}"`, 'white', 2.5); })),
  f('circle', 'cx="150" cy="146" r="30"', 'white', 2.5), olho(139, 140, 3.5), olho(161, 140, 3.5), solto('M138 154 Q150 164 162 154', 2.5),
  f('path', 'd="M64 292 Q48 258 80 246 Q112 258 96 292 Z"', 'white', 2.5), solto('M80 250 L80 290 M70 252 L63 288 M90 252 L97 288', 2),
  estrelaCurva(210, 276, 22, 0.3), olho(204, 274, 2), olho(216, 274, 2)
);

module.exports = [
  { id: 'colorir-08', svg: carro }, { id: 'colorir-17', svg: sapo }, { id: 'colorir-20', svg: arco },
  { id: 'colorir-24', svg: bolo }, { id: 'colorir-25', svg: estrelaMar }
];
