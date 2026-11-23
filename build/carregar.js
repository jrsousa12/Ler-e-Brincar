// Carrega o conteúdo (conteudo/*.js) e a regra de resposta certa, para os motores de build/.
// Uso: const LB = require('./carregar')();  (CONTEUDO_RAIZ=pasta troca a pasta do conteúdo, nos testes)
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

module.exports = function carregar() {
  const pasta = process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');
  globalThis.LB = {};
  delete require.cache[require.resolve(path.join(raiz, 'js/respostas.js'))];
  require(path.join(raiz, 'js/respostas.js'));
  for (const f of ['historias', 'lp', 'mat', 'colorir', 'silabas']) {
    new Function('LB', fs.readFileSync(path.join(pasta, f + '.js'), 'utf8'))(LB);
  }
  return LB;
};
