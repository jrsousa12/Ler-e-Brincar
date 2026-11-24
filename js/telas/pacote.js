// Brincadeira "Pacotes de contas" (regras em js/pacoteregras.js; vai e vem da rodada no kit js/rodada.js).
// Questões do banco de Matemática em pacotes por habilidade; cada resposta vai para o caderno de erros.
LB.usarPacote = function (ctx) {
  'use strict';
  let errouNessa = false;   // a pergunta atual já teve erro? (então não foi "de primeira")
  const r = LB.rodada(ctx, {
    id: 'pacote',
    sortear: () => LB.pacoteRegras.sortearRodada(LB.mat, ctx.caderno.value),
    // Cada pacote tem 4 perguntas (etapas); a estrela vem ao acertar a última do pacote.
    etapas: d => d.perguntas,
    frase: d => d.fala,
    aoCarregar: () => { errouNessa = false; },
    textos: {
      erro: valor => { errouNessa = true; return 'Não foi ' + valor + '. Pense de novo e tente outro!'; },
      acerto: (q, d, final) => {
        ctx.anotarCaderno(q.item, !errouNessa);
        errouNessa = false;
        const porque = q.explicacao ? ' ' + q.explicacao : '';
        return final
          ? ['Pacote completo! ⭐' + porque, 'Muito bem! Você terminou o pacote!']
          : ['Isso! É ' + q.certa + '!' + porque, 'Muito bem! É ' + q.certa + '!'];
      }
    }
  });
  return { ...r.exportar('Pacote') };
};
