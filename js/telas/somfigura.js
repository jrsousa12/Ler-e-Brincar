// Brincadeira "Som e Figura": ouvir a palavra e tocar na figura certa (palavras de conteudo/silabas.js).
// O vai e vem da rodada (estrela, Próximo, Concluir) fica no kit js/rodada.js.
LB.usarSomFigura = function (ctx) {
  'use strict';
  const RODADAS = 5, OPCOES = 3;
  const embaralhar = LB.rodada.embaralhar;

  // Cada rodada: a palavra certa + 2 outras com figura diferente.
  function sortearRodadas() {
    const todas = LB.silabas || [];
    return embaralhar(todas).slice(0, RODADAS).map(alvo => {
      const outras = embaralhar(todas.filter(p => p.emoji !== alvo.emoji)).slice(0, OPCOES - 1);
      const opcoes = embaralhar([alvo, ...outras]).map(p => ({ palavra: p.palavra, emoji: p.emoji }));
      return { palavra: alvo.palavra, certa: alvo.palavra, opcoes };
    });
  }

  const r = LB.rodada(ctx, {
    id: 'som-figura', habilidade: 'EF02LP03', titulo: 'Som e Figura',
    sortear: sortearRodadas,
    // Aqui a voz é a própria pergunta: fala sempre (não depende do "ler sozinho").
    aoCarregar: alvo => setTimeout(() => LB.voz.falar(alvo.palavra), 300),
    textos: {
      erro: valor => 'Essa é ' + valor + '. Ouça de novo e tente outra figura!',
      acerto: q => ['Acertou! Essa é a figura de ' + q.certa + '! ⭐', 'Muito bem! ' + q.certa]
    }
  });

  // Errou: além da mensagem, diz o nome da figura tocada.
  function escolherFigura(opcao) {
    if (r.estado.value === 'correto') return;
    r.escolher(opcao.palavra);
    if (r.estado.value === 'tentar-novamente') LB.voz.falar(opcao.palavra);
  }

  return {
    rodadasSom: r.lista, indiceSom: r.indice, alvoSom: r.atual, escolhaSom: r.escolha, mensagemSom: r.mensagem, estadoSom: r.estado,
    abrirSomFigura: r.abrir, escolherFigura, proximaSom: r.seguir, concluirSomFigura: r.concluir
  };
};
