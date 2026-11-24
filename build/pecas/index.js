// Biblioteca de peças dos desenhos de colorir. Usar nos pedidos:
//   const p = require('../pecas');  p.orelhaGato({ x: 184, espelho: true })  (lista: build/pecas/PECAS.md)
// As peças são aprendidas dos lotes aprovados do Gemini: node build/aprender.js (gera aprendidas.js; nunca escrever à mão)
'use strict';
const peca = require('./peca.js');
const TEMAS = ['aprendidas']; // gerada por node build/aprender.js (lotes do Gemini)
const pecas = {};
for (const t of TEMAS) {
  for (const def of require('./' + t + '.js')) {
    if (pecas[def.nome]) throw new Error('peça repetida: ' + def.nome);
    pecas[def.nome] = peca(def);
  }
}
// Par simétrico: a peça onde foi aprovada + a cópia espelhada do outro lado do eixo x=150.
pecas.par = (colocar, o = {}) => colocar(o) + colocar(Object.assign({}, o, { x: 300 - (o.x ?? colocar.def.ancora[0]), espelho: true }));
module.exports = pecas;
module.exports.TEMAS = TEMAS;
