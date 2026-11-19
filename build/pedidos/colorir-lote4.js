// Lote 4 de desenhos (19/11): flor, peixe, foguete, joaninha, sorvete. Rodar: node build/colorir.js build/pedidos/colorir-lote4.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');

const elipse = (cx, cy, rx, ry, g = 0, sw = 3) => f('ellipse', `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${g} ${cx} ${cy})"`, 'white', sw);

const flor = svg(
  f('circle', 'cx="48" cy="46" r="22"'), p.raiosSol({ x: 48, y: 46, e: 0.24 }), nuvem(206, 46, 0.9),
  colina(268, 16),
  f('path', 'd="M142 150 Q140 220 144 276 L158 276 Q160 220 158 150 Z"'),
  f('path', 'd="M150 232 Q96 220 74 176 Q124 172 150 214 Z"'), f('path', 'd="M150 214 Q206 202 232 156 Q180 152 150 196 Z"'),
  ...Array.from({ length: 8 }, (_, i) => { const [x, y] = polar(150, 104, 48, i * 45 - 90); return elipse(x, y, 24, 34, i * 45); }),
  f('circle', 'cx="150" cy="104" r="36"'), f('circle', 'cx="150" cy="104" r="26"', 'white', 2.5),
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
  f('circle', 'cx="84" cy="134" r="14"', 'white', 2.5), olho(82, 134, 5), solto('M52 156 Q64 162 74 158', 2.5),
  f('circle', 'cx="40" cy="96" r="12"', 'white', 2.5), f('circle', 'cx="64" cy="68" r="8"', 'white', 2.5), f('circle', 'cx="30" cy="62" r="6"', 'white', 2.5),
  colina(278, 10),
  f('path', 'd="M236 288 Q220 250 240 222 Q246 252 258 262 Q262 240 280 220 Q282 258 266 288 Z"'),
  f('path', 'd="M20 288 Q8 258 24 238 Q32 262 38 288 Z"'), p.estrela({ x: 120, y: 272, R: 18, r: 8 })
);

const foguete = svg(
  p.estrela({ x: 42, y: 48, R: 20, r: 9 }), p.estrela({ x: 262, y: 70, R: 24, r: 11 }), p.estrela({ x: 252, y: 188, R: 14, r: 6 }), p.estrela({ x: 40, y: 190, R: 16, r: 7 }),
  f('path', 'd="M94 168 Q50 190 44 248 Q80 240 96 226 Z"'), f('path', 'd="M206 168 Q250 190 256 248 Q220 240 204 226 Z"'),
  f('path', 'd="M128 214 L172 214 L182 238 L118 238 Z"'),
  f('path', 'd="M122 244 Q150 306 178 244 Z"'), f('path', 'd="M136 244 Q150 280 164 244 Z"', 'white', 2.5),
  f('path', 'd="M150 22 Q210 70 210 164 L210 216 L90 216 L90 164 Q90 70 150 22 Z"'),
  f('path', 'd="M150 22 Q188 48 200 96 L100 96 Q112 48 150 22 Z"'),
  f('circle', 'cx="150" cy="140" r="34"'), f('circle', 'cx="150" cy="140" r="24"', 'white', 2.5),
  solto('M136 130 Q142 122 150 122', 2.5),
  f('rect', 'x="90" y="192" width="120" height="16" rx="8"', 'white', 2.5),
  nuvem(24, 282, 0.9), nuvem(214, 284, 0.9)
);

const joaninha = svg(
  f('path', 'd="M10 236 Q60 160 150 176 Q240 160 290 236 Q250 300 150 296 Q50 300 10 236 Z"'),
  solto('M50 262 Q92 256 120 276', 2.5), solto('M250 262 Q208 256 180 276', 2.5),
  espelhar(solto('M214 126 Q248 100 262 114', 5), solto('M222 170 Q266 168 276 182', 5), solto('M214 214 Q248 232 258 252', 5)),
  espelhar(f('path', 'd="M152 92 Q232 96 238 172 Q242 248 152 262 Z"'), f('circle', 'cx="198" cy="130" r="15"', 'white', 2.5), f('circle', 'cx="204" cy="190" r="17"', 'white', 2.5), f('circle', 'cx="176" cy="232" r="10"', 'white', 2.5)),
  f('path', 'd="M96 84 Q150 24 204 84 Q150 106 96 84 Z"'),
  espelhar(solto('M170 40 Q180 14 200 12', 3), f('circle', 'cx="202" cy="12" r="6"', 'white', 2.5)),
  olho(128, 74, 3.5), olho(172, 74, 3.5), solto('M138 86 Q150 94 162 86', 2.5)
);

const sorvete = svg(
  f('circle', 'cx="250" cy="48" r="22"'), p.raiosSol({ x: 250, y: 48, e: 0.24 }), nuvem(18, 50, 0.9),
  colina(274, 14),
  f('path', 'd="M84 170 L144 282 Q150 292 156 282 L216 170 Z"'),
  solto('M124 170 L165 246', 2), solto('M176 170 L135 246', 2), solto('M150 170 L180 224', 2), solto('M150 170 L120 224', 2), solto('M176 170 L194 202', 2), solto('M124 170 L106 202', 2),
  copa(150, 148, 66, 32, 9, 10, 3, 0.1), copa(150, 98, 54, 30, 8, 0, 3, 0.1),
  f('circle', 'cx="150" cy="58" r="14"'), solto('M152 46 Q158 28 172 22', 3),
  f('rect', 'x="108" y="88" width="14" height="7" rx="3" transform="rotate(-30 115 91)"', 'white', 2.5), f('rect', 'x="176" y="92" width="14" height="7" rx="3" transform="rotate(25 183 95)"', 'white', 2.5),
  f('rect', 'x="124" y="140" width="14" height="7" rx="3" transform="rotate(20 131 143)"', 'white', 2.5), f('rect', 'x="168" y="146" width="14" height="7" rx="3" transform="rotate(-25 175 149)"', 'white', 2.5),
  p.flor({ x: 46, y: 288 }), p.flor({ x: 258, y: 286 }), p.tufo({ x: 110 }), p.tufo({ x: 200 })
);

module.exports = [
  { id: 'colorir-06', svg: flor }, { id: 'colorir-11', svg: peixe }, { id: 'colorir-15', svg: foguete },
  { id: 'colorir-16', svg: joaninha }, { id: 'colorir-22', svg: sorvete }
];
