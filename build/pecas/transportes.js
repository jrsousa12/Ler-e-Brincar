// Peças de transporte, tiradas do balão aprovado (colorir-23). O balão é a copa (gomos) + a cesta, ambos com encaixe na boca.
'use strict';
const { f, solto } = require('../desenho.js');
const tema = 'transportes';

module.exports = [
  { nome: 'balaoGomos', descricao: 'copa de balão de ar quente em três faixas largas (borda, meio, centro) com anel na boca; encaixe no meio da boca, 150,204', ancora: [150, 204],
    desenho: () =>
      f('path', 'd="M150 20 C58 20 32 120 90 176 C108 192 124 198 132 204 L168 204 C176 198 192 192 210 176 C268 120 242 20 150 20 Z"') +
      f('path', 'd="M150 20 C94 30 76 130 132 204 L168 204 C224 130 206 30 150 20 Z"') +
      f('path', 'd="M150 20 C122 58 114 150 138 204 L162 204 C186 150 178 58 150 20 Z"') +
      f('path', 'd="M132 204 Q150 212 168 204 L172 214 Q150 222 128 214 Z"', 'white', 2.5) },
  { nome: 'cestaBalao', descricao: 'cesta de balão com chama, quatro cordas e duas listras; encaixe no meio da boca do balão, 150,204', ancora: [150, 204],
    desenho: () =>
      f('path', 'd="M150 220 Q132 238 150 252 Q168 238 150 220 Z"', 'white', 2.5) +
      solto('M130 214 L120 244') + solto('M170 214 L180 244') + solto('M140 218 L134 244') + solto('M160 218 L166 244') +
      f('path', 'd="M112 244 L188 244 Q192 284 176 292 Q150 298 124 292 Q108 284 112 244 Z"') +
      solto('M114 260 Q150 270 186 260') + solto('M118 276 Q150 285 182 276') }
].map(p => Object.assign(p, { tema }));
