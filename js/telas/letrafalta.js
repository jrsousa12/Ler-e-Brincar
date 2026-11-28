// Brincadeira "Letra que falta" (regras em js/letrafaltaregras.js; vai e vem da rodada no kit js/rodada.js).
LB.usarLetraFalta = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'letrafalta',
    sortear: () => LB.letraFaltaRegras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: valor => 'Com ' + valor + ' não fica certo. Olhe a figura e tente outra!',
      acerto: d => ['Isso! ' + d.palavra + ' é com ' + d.certa + '! ⭐', 'Muito bem! ' + d.palavra]
    }
  });
  return { ...r.exportar('LetraFalta') };
};
