// Brincadeira "Gráfico de barras" (regras em js/graficoregras.js, desenho em js/graficodesenho.js; vai e vem da rodada no kit js/rodada.js).
LB.usarGrafico = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'grafico',
    sortear: () => LB.graficoRegras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: (valor, d) => 'Quase! ' + d.dica + ' Tente outro!',
      acerto: d => [d.explicacao + ' ⭐', 'Isso! ' + d.explicacao]
    }
  });
  return { ...r.exportar('Grafico'), desenharGrafico: LB.graficoDesenho };
};
