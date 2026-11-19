// Lote 3 de desenhos (19/11): bola, nuvem com sol, estrelas, balão, casa. Rodar: node build/colorir.js build/pedidos/colorir-lote3.js [--gravar]
const { f, solto, olho, svg, nuvem, colina, copa, polar } = require('../desenho.js');
const p = require('../pecas/index.js');

const bola = svg(
  f('circle', 'cx="254" cy="44" r="22"'), p.raiosSol({ x: 254, y: 44, e: 0.24 }),
  nuvem(20, 44, 0.9), colina(262, 24),
  f('ellipse', 'cx="150" cy="268" rx="70" ry="11"', 'white', 2.5),
  f('circle', 'cx="150" cy="166" r="94"'),
  ...[0, 1, 2, 3, 4].map(i => { const [x, y] = polar(150, 166, 70, -90 + i * 72); return p.pentagono({ x, y, R: 21, giro: -90 + i * 72 + 36 }); }),
  p.pentagono({ x: 150, y: 166, R: 30 }),
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
  p.luaCrescente(),
  p.estrela({ x: 150, y: 134, R: 92, r: 44 }), p.estrela({ x: 150, y: 134, R: 56, r: 27, sw: 2.5 }),
  f('circle', 'cx="150" cy="140" r="18"', 'white', 2.5),
  olho(143, 136, 3.2), olho(157, 136, 3.2), solto('M142 146 Q150 154 158 146', 2.5),
  p.estrela({ x: 48, y: 48, R: 26, r: 12 }), p.estrela({ x: 250, y: 50, R: 30, r: 14 }), p.estrela({ x: 262, y: 168, R: 20, r: 9 }), p.estrela({ x: 236, y: 246, R: 26, r: 12 }), p.estrela({ x: 184, y: 270, R: 14, r: 6 }),
  p.estrela({ x: 196, y: 26, R: 12, r: 5 }), nuvem(70, 284, 0.9)
);

const balao = svg(
  f('circle', 'cx="40" cy="48" r="22"'), p.raiosSol({ x: 40, y: 48, e: 0.22 }),
  nuvem(206, 66, 0.9), nuvem(30, 222, 0.8), nuvem(204, 250, 0.9),
  p.balaoGomos(), p.cestaBalao(),
  colina(294, 8)
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
