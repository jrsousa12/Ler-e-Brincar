// Biblioteca de peças dos desenhos de colorir. Usar nos pedidos:
//   const p = require('../pecas');  p.orelhaGato({ x: 184, espelho: true })  (lista: build/pecas/PECAS.md)
// Peça nova: escrever na ficha do tema (ou criar uma e pôr em TEMAS), com nome, descricao, ancora e desenho; depois node build/biblioteca.js
'use strict';
const peca = require('./peca.js');
const TEMAS = ['animais', 'natureza', 'ceu', 'construcoes', 'formas', 'transportes'];
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
