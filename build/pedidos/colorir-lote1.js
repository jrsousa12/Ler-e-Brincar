// Lote 1 de desenhos (20/11), suavizado: gato, sol, árvore, borboleta e castelo com curvas livres (suave/mancha) no estilo do lote 7.
// As peças compartilhadas da biblioteca não mudam (outros lotes usam); só o que era anguloso é redesenhado aqui.
// Rodar: node build/colorir.js build/pedidos/colorir-lote1.js [--gravar]
const { f, solto, svg, nuvem, colina, suave, mancha, espelhar } = require('../desenho.js');
const p = require('../pecas/index.js');
const par = p.par, W = 'white';
const S = (pts, fundo, sw) => f('path', `d="${suave(pts)}"`, fundo, sw);          // curva livre por pontos
const D = (d, fundo, sw) => f('path', `d="${d}"`, fundo, sw);                      // caminho à mão

// ---- Gato Tobias ----
const orelha = [S([[102, 98], [88, 28, 1], [124, 36], [146, 66]]), S([[110, 82], [99, 46, 1], [120, 52], [133, 66]], W, 2.5)];
const gato = svg(
  S([[214, 264], [248, 262], [268, 246], [271, 224], [262, 209], [253, 222], [250, 238], [232, 248], [214, 250]]),
  S([[112, 156], [93, 186], [80, 222], [80, 256], [96, 276], [150, 281], [204, 276], [220, 256], [220, 222], [207, 186], [188, 156]]),
  ...par(p.coxaSentada),
  p.pata(), p.pata({ x: 200 }),
  ...par(p.pernaFrente),
  D('M118 168 C118 196 124 210 130 214 Q136 223 143 214 Q150 225 157 214 Q164 223 170 214 C176 210 182 196 182 168 Z', W, 2.5),
  p.pata({ x: 136, rx: 16 }), p.pata({ x: 164, rx: 16 }),
  espelhar(...orelha),
  S([[150, 58], [184, 65], [205, 90], [214, 113], [221, 124], [212, 133], [198, 142], [176, 158], [150, 162], [124, 158], [102, 142], [88, 133], [79, 124], [86, 113], [95, 90], [116, 65]]),
  p.listrasTesta(), p.olhoGato(), p.olhoGato({ x: 169 }), p.focinhoGato(), ...par(p.bigodes),
  p.coleira(), p.guizo(),
  solto('M256 226 L269 228 M248 244 L258 254 M232 248 L236 262', 2)
);

// ---- Sol (já era todo em curvas: só o aprovado de antes) ----
const sol = svg(p.raiosSol(), p.discoSol(), p.rostoFeliz());

// ---- Árvore: copa feita de tufos redondos suaves ----
// tufo redondo e macio: elipse com leve variação, 10 pontos
const tufo = (x, y, rx, ry, g) => S(Array.from({ length: 10 }, (_, i) => { const t = (g + i * 36) * Math.PI / 180, m = 1 + 0.06 * Math.sin(i * 2.7 + g); return [x + rx * m * Math.cos(t), y + ry * m * Math.sin(t)]; }));
const tufosCopa = [[150, 92, 74, 52, 10], [90, 126, 52, 36, 40], [212, 122, 52, 38, 70], [104, 66, 46, 34, 20], [198, 62, 46, 34, 50], [150, 46, 44, 30, 15]];
const arvore = svg(
  p.chaoArvore(), p.tronco(),
  ...tufosCopa.map(a => tufo(...a)),
  ...[[78, 120], [108, 142], [222, 132], [196, 110], [150, 110], [176, 52], [118, 60]].map(([x, y]) => p.maca({ x, y })),
  ...[28, 76, 218, 262].map(x => p.tufo({ x })), p.flor({ x: 46, y: 270 }), p.flor({ x: 250, y: 268 })
);

// ---- Borboleta: asas de curva livre ----
const asaSup = [S([[156, 142, 1], [176, 90], [212, 46], [254, 32], [284, 54], [278, 96], [240, 128], [194, 146]]),
  ...[[230, 84, 24], [230, 84, 11], [262, 56, 6], [196, 58, 6], [262, 112, 6]].map(([x, y, r]) => f('circle', `cx="${x}" cy="${y}" r="${r}"`, W, 2.5))];
const asaInf = [S([[156, 152, 1], [206, 148], [248, 166], [264, 202], [246, 238], [208, 250], [178, 224]]),
  ...[[214, 204, 17], [214, 204, 7], [244, 232, 5], [178, 234, 5]].map(([x, y, r]) => f('circle', `cx="${x}" cy="${y}" r="${r}"`, W, 2.5))];
const borboleta = svg(
  espelhar(...asaSup), espelhar(...asaInf),
  ...par(p.antena), p.corpoInseto(), p.cabecaInseto()
);

// ---- Castelo: telhados de cone com beiral suave ----
const telhado = (x, y, m, h) => D(`M${x - m - 4} ${y} Q${x - m * 0.3} ${y - h * 0.28} ${x} ${y - h} Q${x + m * 0.3} ${y - h * 0.28} ${x + m + 4} ${y} Q${x} ${y + 10} ${x - m - 4} ${y} Z`);
const castelo = svg(
  nuvem(18, 48), nuvem(206, 40, 0.9), colina(270),
  p.torre({ x: 150, y: 274, l: 176, a: 94, rx: 12 }),
  p.torre({ rx: 14 }), telhado(63, 128, 37, 68), p.torre({ x: 237, rx: 14 }), telhado(237, 128, 37, 68),
  p.torre({ x: 150, y: 274, l: 92, a: 162, rx: 14 }), telhado(150, 116, 56, 82),
  p.bandeira(), p.portaArco(),
  p.janelaArco({ x: 150, y: 168, meia: 14, altura: 26, ombro: 12 }), p.janelaArco(), p.janelaArco({ x: 237 }),
  solto('M110 196 L190 196', 2), solto('M104 130 Q150 138 196 130', 2),
  p.moita({ x: 34, y: 288 }), p.moita({ x: 266, y: 288 })
);

module.exports = [
  { id: 'colorir-01', svg: gato }, { id: 'colorir-05', svg: sol }, { id: 'colorir-07', svg: arvore },
  { id: 'colorir-10', svg: borboleta }, { id: 'colorir-19', svg: castelo }
];
