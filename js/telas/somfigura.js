// Brincadeira "Som e Figura": ouvir a palavra e tocar na figura certa (palavras de conteudo/silabas.js).
LB.usarSomFigura = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const RODADAS = 5, OPCOES = 3;
  const rodadasSom = ref([]);
  const indiceSom = ref(0);
  const escolhaSom = ref('');
  const mensagemSom = ref('');
  const estadoSom = ref(''); // '', 'correto', 'tentar-novamente'
  const alvoSom = computed(() => rodadasSom.value[indiceSom.value]);
  const somLigado = () => ctx.ajustes.value.som !== false;

  function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // Cada rodada: a palavra certa + 2 outras com figura diferente.
  function sortearRodadas() {
    const todas = LB.silabas || [];
    return embaralhar(todas).slice(0, RODADAS).map(alvo => {
      const outras = embaralhar(todas.filter(p => p.emoji !== alvo.emoji)).slice(0, OPCOES - 1);
      return { palavra: alvo.palavra, opcoes: embaralhar([alvo, ...outras]).map(p => ({ palavra: p.palavra, emoji: p.emoji })) };
    });
  }

  function carregarRodada() {
    escolhaSom.value = '';
    mensagemSom.value = '';
    estadoSom.value = '';
    setTimeout(() => LB.voz.falar(alvoSom.value.palavra), 300);
  }

  function abrirSomFigura() {
    rodadasSom.value = sortearRodadas();
    if (!rodadasSom.value.length) return;
    indiceSom.value = 0;
    ctx.tela.value = 'som-figura';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    carregarRodada();
  }

  function escolherFigura(opcao) {
    if (estadoSom.value === 'correto') return;
    escolhaSom.value = opcao.palavra;
    if (opcao.palavra === alvoSom.value.palavra) {
      estadoSom.value = 'correto';
      mensagemSom.value = 'Acertou! Essa é a figura de ' + opcao.palavra + '! ⭐';
      ctx.estrelas.value += 1;
      LB.festa.acerto(somLigado());
      LB.voz.falar('Muito bem! ' + opcao.palavra);
    } else {
      estadoSom.value = 'tentar-novamente';
      mensagemSom.value = 'Essa é ' + opcao.palavra + '. Ouça de novo e tente outra figura!';
      LB.festa.erro(somLigado());
      LB.voz.falar(opcao.palavra);
    }
  }

  function proximaSom() {
    if (indiceSom.value < rodadasSom.value.length - 1) { indiceSom.value += 1; carregarRodada(); }
  }

  function concluirSomFigura() {
    ctx.marcarConcluido('som-figura');
    ctx.terminarItem('atividades');
  }

  return { rodadasSom, indiceSom, escolhaSom, mensagemSom, estadoSom, alvoSom, abrirSomFigura, escolherFigura, proximaSom, concluirSomFigura };
};
