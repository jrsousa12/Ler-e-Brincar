// Brincadeira "Formas" (regras em js/formasregras.js, desenho em js/formasdesenho.js; vai e vem da rodada no kit js/rodada.js).
LB.usarFormas = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'formas', habilidade: 'EF02MA15', titulo: 'Formas',
    sortear: () => LB.formasRegras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: (valor, d) => 'Quase! ' + d.dica + ' Tente outro!',
      acerto: d => [d.explicacao + ' ⭐', 'Isso! ' + d.explicacao]
    }
  });
  return { ...r.exportar('Formas'), desenharForma: LB.formasDesenho };
};
