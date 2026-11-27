// Desenho do gráfico de barras (HTML feito pelo código, sem imagem): LB.graficoDesenho({ titulo, barras: [{ e, nome, valor, cor }] }).
// Cada figura da barra vale 1; as barras ficam alinhadas por baixo, com uma régua de números ao lado.
LB.graficoDesenho = function (g) {
  'use strict';
  const topo = Math.max(8, ...g.barras.map(b => b.valor));
  const regua = Array.from({ length: topo }, (_, i) => topo - i).map(n => '<span class="gr-num">' + n + '</span>').join('');
  const barra = b => '<div class="gr-coluna" role="img" aria-label="' + b.nome + ': ' + b.valor + '">'
    + '<div class="gr-barra" style="--cor-barra:' + b.cor + '">'
    + Array.from({ length: b.valor }, () => '<span class="gr-figura">' + b.e + '</span>').join('')
    + '</div></div>';
  return '<div class="gr-grafico" style="--gr-linhas:' + topo + '"><p class="gr-titulo">' + g.titulo + '</p>'
    + '<div class="gr-corpo"><div class="gr-regua" aria-hidden="true">' + regua + '</div>'
    + '<div class="gr-lado"><div class="gr-barras">' + g.barras.map(barra).join('') + '</div>'
    + '<div class="gr-rotulos">' + g.barras.map(b => '<span class="gr-rotulo">' + b.e + '</span>').join('') + '</div></div></div></div>';
};
