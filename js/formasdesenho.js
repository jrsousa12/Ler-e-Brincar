// Desenho de uma forma (SVG feito pelo código, sem imagem): LB.formasDesenho({ forma, cor, tam, giro }).
// forma: 'círculo' | 'quadrado' | 'retângulo' | 'triângulo'; tam = escala (0.6 a 1); giro = graus.
LB.formasDesenho = function (f) {
  'use strict';
  const FORMAS = {
    'círculo': '<circle r="38"/>',
    'quadrado': '<rect x="-34" y="-34" width="68" height="68" rx="3"/>',
    'retângulo': '<rect x="-46" y="-26" width="92" height="52" rx="3"/>',
    'triângulo': '<polygon points="0,-40 44,34 -44,34" stroke-linejoin="round"/>'
  };
  return '<svg class="forma-svg" viewBox="0 0 100 100" role="img" aria-label="' + f.forma + '">'
    + '<g class="forma-corpo" fill="' + f.cor + '" transform="translate(50 50) rotate(' + (f.giro || 0) + ') scale(' + (f.tam || 1) + ')">'
    + FORMAS[f.forma] + '</g></svg>';
};
