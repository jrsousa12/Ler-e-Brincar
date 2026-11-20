// Lote 4 de desenhos (19/11; suavizado 20/11): flor, peixe, foguete, joaninha, sorvete. Rodar: node build/colorir.js build/pedidos/colorir-lote4.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar, suave } = require('../desenho.js');
const p = require('../pecas/index.js');
const { caixa, estrela, solMini } = require('./_curvas.js');

// Oval de curva livre (8 pontos, leve irregularidade): no lugar de ellipse/circle.
const ov = (cx, cy, rx, ry, g = 0, sw = 3, fundo = 'white') => {
  const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const pts = Array.from({ length: 8 }, (_, i) => { const t = i * Math.PI / 4, k = 1 + 0.035 * Math.sin(i * 2.1), x = rx * k * Math.cos(t), y = ry * k * Math.sin(t); return [+(cx + x * c - y * s).toFixed(1), +(cy + x * s + y * c).toFixed(1)]; });
  return f('path', `d="${suave(pts)}"`, fundo, sw);
};
// Pétala em gota, de dentro (r0) para fora (r1), largura w, apontando para o ângulo g.
const petala = (cx, cy, g, r0, r1, w) => {
  const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), L = r1 - r0, q = (x, y) => `${+(cx + x * c - y * s).toFixed(1)} ${+(cy + x * s + y * c).toFixed(1)}`;
  return f('path', `d="M${q(r0, 0)} C${q(r0 + L * 0.2, -w * 1.05)} ${q(r0 + L * 0.7, -w * 1.1)} ${q(r1, -w * 0.12)} Q${q(r1 + 3, 0)} ${q(r1, w * 0.12)} C${q(r0 + L * 0.7, w * 1.1)} ${q(r0 + L * 0.2, w * 1.05)} ${q(r0, 0)} Z"`);
};

const flor = svg(
  solMini(48, 46, 28), nuvem(206, 46, 0.9),
  colina(268, 16),
  f('path', 'd="M142 150 Q140 220 144 276 L158 276 Q160 220 158 150 Z"'),
  f('path', 'd="M150 232 Q96 220 74 176 Q124 172 150 214 Z"'), f('path', 'd="M150 214 Q206 202 232 156 Q180 152 150 196 Z"'),
  ...Array.from({ length: 8 }, (_, i) => petala(150, 104, i * 45 - 90, 22, 86, 27)),
  ov(150, 104, 37, 36), ov(150, 104, 27, 26, 0, 2.5),
  olho(140, 98, 3.5), olho(160, 98, 3.5), solto('M140 112 Q150 122 160 112', 2.5),
  p.flor({ x: 50, y: 284 }), p.flor({ x: 256, y: 282, e: 1.1 }), p.tufo({ x: 100 }), p.tufo({ x: 210 })
);

const peixe = svg(
  solto('M10 26 Q40 14 70 26 Q100 38 130 26 Q160 14 190 26 Q220 38 250 26 Q270 20 290 26', 2.5),
  f('path', 'd="M226 150 Q258 124 282 104 Q296 150 282 196 Q258 176 226 150 Z"'),
  f('path', 'd="M112 102 Q146 44 196 104 Z"'), f('path', 'd="M120 198 Q148 246 186 196 Z"'),
  f('path', 'd="M46 150 Q96 78 178 98 Q232 112 250 150 Q232 188 178 202 Q96 222 46 150 Z"'),
  f('path', 'd="M144 106 Q130 150 146 194 L170 192 Q156 150 170 108 Z"'), f('path', 'd="M190 112 Q176 150 192 188 L212 182 Q200 150 212 118 Z"'),
  solto('M104 120 Q94 150 104 182', 2.5),
  ov(84, 134, 15, 14, 0, 2.5), olho(82, 134, 5), solto('M52 156 Q64 162 74 158', 2.5),
  ov(40, 96, 12, 13, 20, 2.5), ov(64, 68, 8, 9, 40, 2.5), ov(30, 62, 6, 6.5, 0, 2.5),
  colina(278, 10),
  f('path', 'd="M236 288 Q220 250 240 222 Q246 252 258 262 Q262 240 280 220 Q282 258 266 288 Z"'),
  f('path', 'd="M20 288 Q8 258 24 238 Q32 262 38 288 Z"'), estrela(120, 272, 18, 8)
);

const foguete = svg(
  estrela(42, 48, 20, 9), estrela(262, 70, 24, 11), estrela(252, 188, 14, 6), estrela(40, 190, 16, 7),
  f('path', 'd="M94 168 Q50 190 44 248 Q80 240 96 226 Z"'), f('path', 'd="M206 168 Q250 190 256 248 Q220 240 204 226 Z"'),
  f('path', 'd="M128 214 L172 214 L182 238 L118 238 Z"'),
  f('path', 'd="M122 244 Q150 306 178 244 Z"'), f('path', 'd="M136 244 Q150 280 164 244 Z"', 'white', 2.5),
  f('path', 'd="M150 22 Q210 70 210 164 L210 216 L90 216 L90 164 Q90 70 150 22 Z"'),
  f('path', 'd="M150 22 Q188 48 200 96 L100 96 Q112 48 150 22 Z"'),
  ov(150, 140, 35, 34), ov(150, 140, 24, 24, 0, 2.5),
  solto('M136 130 Q142 122 150 122', 2.5),
  caixa(90, 192, 120, 16, 8, 'white', 2.5),
  nuvem(24, 282, 0.9), nuvem(214, 284, 0.9)
);

const joaninha = svg(
  f('path', 'd="M10 236 Q60 160 150 176 Q240 160 290 236 Q250 300 150 296 Q50 300 10 236 Z"'),
  solto('M50 262 Q92 256 120 276', 2.5), solto('M250 262 Q208 256 180 276', 2.5),
  espelhar(solto('M214 126 Q248 100 262 114', 5), solto('M222 170 Q266 168 276 182', 5), solto('M214 214 Q248 232 258 252', 5)),
  espelhar(f('path', 'd="M152 92 Q232 96 238 172 Q242 248 152 262 Z"'), ov(198, 130, 17, 14, 25, 2.5), ov(204, 190, 18, 16, -20, 2.5), ov(176, 232, 11, 9, 30, 2.5)),
  f('path', 'd="M96 84 Q150 24 204 84 Q150 106 96 84 Z"'),
  espelhar(solto('M170 40 Q180 14 200 12', 3), ov(202, 12, 6.5, 6, 0, 2.5)),
  olho(128, 74, 3.5), olho(172, 74, 3.5), solto('M138 86 Q150 94 162 86', 2.5)
);

const sorvete = svg(
  solMini(250, 48, 28), nuvem(18, 50, 0.9),
  colina(274, 14),
  f('path', 'd="M84 170 L144 282 Q150 292 156 282 L216 170 Z"'),
  solto('M124 170 L165 246', 2), solto('M176 170 L135 246', 2), solto('M150 170 L180 224', 2), solto('M150 170 L120 224', 2), solto('M176 170 L194 202', 2), solto('M124 170 L106 202', 2),
  copa(150, 148, 66, 32, 9, 10, 3, 0.1), copa(150, 98, 54, 30, 8, 0, 3, 0.1),
  ov(150, 58, 15, 14), solto('M152 46 Q158 28 172 22', 3),
  ov(115, 91, 7.5, 4, -30, 2.5), ov(183, 95, 7.5, 4, 25, 2.5),
  ov(131, 143, 7.5, 4, 20, 2.5), ov(175, 149, 7.5, 4, -25, 2.5),
  p.flor({ x: 46, y: 288 }), p.flor({ x: 258, y: 286 }), p.tufo({ x: 110 }), p.tufo({ x: 200 })
);

module.exports = [
  { id: 'colorir-06', svg: flor }, { id: 'colorir-11', svg: peixe }, { id: 'colorir-15', svg: foguete },
  { id: 'colorir-16', svg: joaninha }, { id: 'colorir-22', svg: sorvete }
];
