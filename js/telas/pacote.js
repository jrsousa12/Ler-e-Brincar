// Brincadeira "Pacotes de contas" (regras em js/pacoteregras.js; vai e vem da rodada no kit js/rodada.js).
// Criado por build/nova-brincadeira.js.
LB.usarPacote = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'pacote',
    sortear: () => LB.pacoteRegras.sortearRodada(),
    // Cada pacote tem 4 perguntas (etapas); a estrela vem ao acertar a última do pacote.
    etapas: d => d.perguntas,
    frase: d => d.fala,
    textos: {
      erro: valor => 'Não foi ' + valor + '. Pense de novo e tente outro!',
      acerto: (q, d, final) => final
        ? ['Pacote completo! É ' + q.certa + '! ⭐', 'Muito bem! Você terminou o pacote!']
        : ['Isso! É ' + q.certa + '! ⭐', 'Muito bem! É ' + q.certa + '!']
    }
  });
  return { ...r.exportar('Pacote') };
};
