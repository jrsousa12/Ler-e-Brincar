// Desenho do relógio de ponteiros (SVG feito pelo código, sem imagem): LB.relogioDesenho(h, m, tamanho).
// Ponteiro pequeno (grosso, laranja) = hora; ponteiro grande (fino, azul) = minutos. Cores no css/telas/relogio.css.
LB.relogioDesenho = function (h, m, tamanho) {
  'use strict';
  const ponto = (graus, raio) => {
    const a = (graus - 90) * Math.PI / 180;
    return [(60 + raio * Math.cos(a)).toFixed(1), (60 + raio * Math.sin(a)).toFixed(1)];
  };
  const haste = (graus, raio, classe) => {
    const [x, y] = ponto(graus, raio);
    return '<line class="' + classe + '" x1="60" y1="60" x2="' + x + '" y2="' + y + '"/>';
  };
  let numeros = '';
  for (let n = 1; n <= 12; n++) {
    const [x, y] = ponto(n * 30, 44);
    numeros += '<text x="' + x + '" y="' + y + '" class="rel-num" text-anchor="middle" dominant-baseline="central">' + n + '</text>';
  }
  const graus = ((h % 12) * 30) + m * 0.5;
  return '<svg class="relogio-svg" viewBox="0 0 120 120" width="' + tamanho + '" height="' + tamanho + '" role="img" aria-label="Relógio de ponteiros">'
    + '<circle class="rel-face" cx="60" cy="60" r="56"/>' + numeros
    + haste(graus, 28, 'rel-hora') + haste(m * 6, 40, 'rel-minuto')
    + '<circle class="rel-centro" cx="60" cy="60" r="4"/></svg>';
};
