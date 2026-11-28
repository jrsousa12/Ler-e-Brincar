// Brincadeira "Régua" (regras em js/reguaregras.js, desenho em js/reguadesenho.js; vai e vem da rodada no kit js/rodada.js).
LB.usarRegua = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'regua', habilidade: 'EF02MA16', titulo: 'Régua',
    sortear: () => LB.reguaRegras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: (valor, d) => 'Não foi ' + valor + '. ' + d.dica + ' Tente outro!',
      acerto: d => [d.explicacao + ' ⭐', 'Isso! ' + d.explicacao]
    }
  });
  return { ...r.exportar('Regua'), desenharRegua: LB.reguaDesenho };
};
