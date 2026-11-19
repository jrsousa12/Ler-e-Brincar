// Lote 5 de desenhos (19/11): carro, sapo, arco-íris, bolo, estrela-do-mar. Rodar: node build/colorir.js build/pedidos/colorir-lote5.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');

const carro = svg(
  f('circle', 'cx="254" cy="46" r="22"'), p.raiosSol({ x: 254, y: 46, e: 0.24 }), nuvem(18, 50, 0.9),
  colina(280, 10),
  f('path', 'd="M80 152 Q92 98 140 96 L190 96 Q232 98 244 152 Z"'),
  f('path', 'd="M28 192 Q28 150 70 148 L246 148 Q286 150 288 192 L288 226 Q288 240 272 240 L44 240 Q28 240 28 226 Z"'),
  f('path', 'd="M98 146 Q106 114 138 110 L138 146 Z"', 'white', 2.5), f('path', 'd="M152 110 L186 110 Q216 114 226 146 L152 146 Z"', 'white', 2.5),
  solto('M145 150 L145 232', 2.5), solto('M154 178 L172 178', 3),
  f('ellipse', 'cx="272" cy="184" rx="11" ry="13"', 'white', 2.5), f('circle', 'cx="44" cy="184" r="10"', 'white', 2.5),
  f('rect', 'x="236" y="214" width="46" height="14" rx="7"', 'white', 2.5), f('rect', 'x="34" y="214" width="34" height="14" rx="7"', 'white', 2.5),
  f('circle', 'cx="92" cy="244" r="32"'), f('circle', 'cx="92" cy="244" r="15"', 'white', 2.5),
  f('circle', 'cx="218" cy="244" r="32"'), f('circle', 'cx="218" cy="244" r="15"', 'white', 2.5),
  p.flor({ x: 44, y: 284 }), p.flor({ x: 258, y: 284, e: 1.1 })
);

const sapo = svg(
  f('circle', 'cx="254" cy="44" r="22"'), p.raiosSol({ x: 254, y: 44, e: 0.24 }), nuvem(18, 50, 0.9),
  colina(270, 12),
  f('ellipse', 'cx="150" cy="270" rx="122" ry="20"'),
  espelhar(f('path', 'd="M190 196 Q250 170 262 224 Q266 262 232 262 L176 262 Q160 232 190 196 Z"'), f('circle', 'cx="254" cy="256" r="9"', 'white', 2.5), f('circle', 'cx="232" cy="262" r="9"', 'white', 2.5)),
  f('ellipse', 'cx="150" cy="196" rx="84" ry="74"'), f('ellipse', 'cx="150" cy="212" rx="52" ry="48"', 'white', 2.5),
  f('ellipse', 'cx="150" cy="122" rx="82" ry="50"'),
  espelhar(f('path', 'd="M198 186 Q238 206 232 244 Q226 262 206 256 Q190 252 194 232 Q196 214 186 206 Z"')),
  espelhar(f('circle', 'cx="192" cy="82" r="26"'), f('circle', 'cx="192" cy="84" r="16"', 'white', 2.5), olho(192, 86, 7), f('ellipse', 'cx="220" cy="130" rx="11" ry="7"', 'white', 2.5)),
  solto('M90 128 Q150 166 210 128', 3), olho(142, 102, 2.5), olho(158, 102, 2.5),
  f('circle', 'cx="150" cy="70" r="7"', 'white', 2.5),
  solto('M236 112 Q246 92 262 120', 2), f('ellipse', 'cx="268" cy="128" rx="9" ry="6"', 'white', 2.5), f('ellipse', 'cx="262" cy="116" rx="7" ry="4"', 'white', 2),
  p.flor({ x: 44, y: 284 }), p.flor({ x: 258, y: 284 })
);

const faixa = (ro, ri) => f('path', `d="M${150 - ro} 252 A${ro} ${ro} 0 0 1 ${150 + ro} 252 L${150 + ri} 252 A${ri} ${ri} 0 0 0 ${150 - ri} 252 Z"`);
const arco = svg(
  f('circle', 'cx="48" cy="48" r="22"'), p.raiosSol({ x: 48, y: 48, e: 0.24 }), nuvem(210, 52, 0.9),
  ...[[144, 124], [124, 104], [104, 84], [84, 64], [64, 44], [44, 24]].map(([a, b]) => faixa(a, b)),
  copa(68, 254, 56, 30, 8, 0, 3, 0.1), copa(234, 254, 56, 30, 8, 10, 3, 0.1),
  olho(56, 250, 3.5), olho(80, 250, 3.5), solto('M60 262 Q68 270 76 262', 2.5),
  colina(284, 8), p.flor({ x: 150, y: 284 }), p.flor({ x: 50, y: 284 }), p.flor({ x: 250, y: 284 })
);

const vela = x => [f('rect', `x="${x}" y="64" width="12" height="44" rx="4"`), solto(`M${x} 80 L${x + 12} 74 M${x} 96 L${x + 12} 90`, 2), f('path', `d="M${x + 6} 60 Q${x - 8} 44 ${x + 6} 24 Q${x + 20} 44 ${x + 6} 60 Z"`, 'white', 2.5)];
const bolo = svg(
  p.estrela({ x: 40, y: 56, R: 18, r: 8 }), p.estrela({ x: 262, y: 70, R: 22, r: 10 }), p.estrela({ x: 36, y: 150, R: 12, r: 5 }), p.estrela({ x: 268, y: 160, R: 13, r: 6 }),
  colina(286, 6),
  f('ellipse', 'cx="150" cy="262" rx="124" ry="20"'),
  f('rect', 'x="50" y="184" width="200" height="76" rx="16"'),
  f('path', 'd="M50 204 Q50 176 80 176 L220 176 Q250 176 250 204 Q250 224 234 224 Q218 224 218 208 Q218 238 196 238 Q174 238 174 212 Q174 228 154 228 Q134 228 134 210 Q134 238 112 238 Q90 238 90 212 Q90 224 72 224 Q50 224 50 204 Z"'),
  f('rect', 'x="92" y="110" width="116" height="66" rx="14"'),
  f('path', 'd="M92 128 Q92 106 116 106 L184 106 Q208 106 208 128 Q208 146 194 146 Q180 146 180 132 Q180 154 162 154 Q144 154 144 134 Q144 148 130 148 Q116 148 116 132 Q116 146 104 146 Q92 146 92 128 Z"'),
  ...vela(116), ...vela(144), ...vela(172),
  f('circle', 'cx="72" cy="200" r="7"', 'white', 2.5), f('circle', 'cx="228" cy="200" r="7"', 'white', 2.5), f('circle', 'cx="112" cy="222" r="6"', 'white', 2.5), f('circle', 'cx="190" cy="224" r="6"', 'white', 2.5)
);

const estrelaMar = svg(
  solto('M10 26 Q40 14 70 26 Q100 38 130 26 Q160 14 190 26 Q220 38 250 26 Q270 20 290 26', 2.5),
  f('circle', 'cx="40" cy="72" r="11"', 'white', 2.5), f('circle', 'cx="66" cy="46" r="7"', 'white', 2.5), f('circle', 'cx="262" cy="84" r="10"', 'white', 2.5), f('circle', 'cx="276" cy="116" r="6"', 'white', 2.5),
  colina(278, 14),
  f('path', 'd="M240 292 Q224 256 244 228 Q250 258 262 268 Q266 246 284 226 Q286 262 270 292 Z"'),
  f('path', 'd="M16 292 Q4 262 20 242 Q28 266 36 292 Z"'),
  p.estrela({ x: 150, y: 152, R: 108, r: 40, sw: 3 }),
  ...[0, 1, 2, 3, 4].flatMap(i => [58, 80].map(r => { const [x, y] = polar(150, 152, r, -90 + i * 72); return f('circle', `cx="${x}" cy="${y}" r="${r > 70 ? 5 : 6.5}"`, 'white', 2.5); })),
  f('circle', 'cx="150" cy="152" r="28"', 'white', 2.5), olho(140, 146, 3.5), olho(160, 146, 3.5), solto('M140 160 Q150 168 160 160', 2.5),
  f('path', 'd="M70 292 Q56 262 84 252 Q112 262 98 292 Z"', 'white', 2.5), solto('M84 256 L84 290 M76 258 L70 288 M92 258 L98 288', 2)
);

module.exports = [
  { id: 'colorir-08', svg: carro }, { id: 'colorir-17', svg: sapo }, { id: 'colorir-20', svg: arco },
  { id: 'colorir-24', svg: bolo }, { id: 'colorir-25', svg: estrelaMar }
];
