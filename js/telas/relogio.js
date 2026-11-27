// Brincadeira "Que horas são?" (regras em js/relogioregras.js, desenho em js/relogiodesenho.js; vai e vem da rodada no kit js/rodada.js).
LB.usarRelogio = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'relogio',
    sortear: () => LB.relogioRegras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: (valor, d) => (d.modo === 'relogio' ? 'Esse relógio não é o certo.' : 'Não foi ' + valor + '.') + ' ' + d.dica + ' Tente outro!',
      acerto: d => [d.explicacao + ' ⭐', 'Isso! ' + d.explicacao]
    }
  });
  return { ...r.exportar('Relogio'), desenharRelogio: LB.relogioDesenho, horaDoBotao: v => { const [h, m] = v.split(':'); return { h: +h, m: +m }; } };
};
