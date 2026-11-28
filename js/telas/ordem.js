// Brincadeira "Ordem dos Fatos" (regras em js/ordemregras.js; vai e vem da rodada no kit js/rodada.js).
// A criança toca o 1º fato, depois o 2º; o 3º entra sozinho. A linha do tempo mostra o que já foi posto.
LB.usarOrdem = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: 'ordem', habilidade: 'EF02LP17', titulo: 'Ordem dos Fatos',
    sortear: () => LB.ordemRegras.sortearRodada(),
    etapas: d => d.etapas,
    frase: d => d.fala,
    textos: {
      erro: () => 'Ainda não. Pense no que acontece antes e tente outro!',
      acerto: (q, d, final) => final
        ? ['Isso! A história ficou na ordem certa! ⭐', 'Muito bem! A ordem certa é: ' + d.frases.join(' ')]
        : ['Isso! Esse veio primeiro.', 'Isso! Esse veio primeiro.']
    }
  });

  // Casa da linha do tempo (0, 1, 2): mostra a frase se já foi respondida.
  function casaOrdem(i) {
    const d = r.atual.value, etapa = r.etapa.value, certo = r.estado.value === 'correto';
    const feitas = etapa + (certo ? 1 : 0);          // fatos já postos
    const tudo = feitas >= 2;                         // o 3º entra junto com o 2º
    return { frase: (i < feitas || tudo) ? d.frases[i] : '', ativa: !tudo && i === feitas };
  }

  return { ...r.exportar('Ordem'), casaOrdem };
};
