// Os 5 desenhos aprovados (19/11) montados só com peças da biblioteca (build/pecas/). Serve de exemplo para os próximos lotes.
// Rodar: node build/colorir.js build/pedidos/colorir-modelos.js [--gravar]
const { solto, svg, nuvem, colina } = require('../desenho.js');
const p = require('../pecas/index.js');
const par = p.par;

const gato = svg(
  p.raboDeitado(), p.corpoSentado(),
  par(p.coxaSentada),
  p.pata(), p.pata({ x: 200 }),
  par(p.pernaFrente), p.peitoPelo(),
  p.pata({ x: 136, rx: 16 }), p.pata({ x: 164, rx: 16 }),
  par(p.orelhaGato), p.cabecaGato(), p.listrasTesta(),
  p.olhoGato(), p.olhoGato({ x: 169 }), p.focinhoGato(), par(p.bigodes),
  p.coleira(), p.guizo()
);

const arvore = svg(
  p.chaoArvore(), p.arvoreMacas(),
  ...[28, 76, 218, 262].map(x => p.tufo({ x })), p.flor({ x: 46, y: 270 }), p.flor({ x: 250, y: 268 })
);

const sol = svg(p.raiosSol(), p.discoSol(), p.rostoFeliz());

const borboleta = svg(
  par(p.asaSuperior), par(p.asaInferior),
  par(p.antena), p.corpoInseto(), p.cabecaInseto()
);

const castelo = svg(
  nuvem(18, 48), nuvem(206, 40, 0.9), colina(270),
  p.torre({ x: 150, y: 274, l: 176, a: 94, rx: 8 }),
  p.torre(), p.telhadoCone(), p.torre({ x: 237 }), p.telhadoCone({ x: 237 }),
  p.torre({ x: 150, y: 274, l: 92, a: 162 }), p.telhadoCone({ x: 150, y: 116, meia: 56, altura: 82, dobra: 10, base: 12 }),
  p.bandeira(), p.portaArco(),
  p.janelaArco({ x: 150, y: 168, meia: 14, altura: 26, ombro: 12 }), p.janelaArco(), p.janelaArco({ x: 237 }),
  solto('M110 196 L190 196', 2), solto('M104 130 Q150 138 196 130', 2),
  p.moita({ x: 34, y: 288 }), p.moita({ x: 266, y: 288 })
);

module.exports = [
  { id: 'colorir-01', svg: gato }, { id: 'colorir-05', svg: sol }, { id: 'colorir-07', svg: arvore },
  { id: 'colorir-10', svg: borboleta }, { id: 'colorir-19', svg: castelo }
];
