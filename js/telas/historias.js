// Telas "Ler" e "História": leitura e as 3 perguntas de cada história.
LB.usarHistorias = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const historiaAtual = ref(null);
  const mostrandoPerguntas = ref(false);
  const indicePergunta = ref(0);

  const perguntaAtual = computed(() =>
    historiaAtual.value ? historiaAtual.value.perguntas[indicePergunta.value] : null);

  function abrirHistoria(h) {
    historiaAtual.value = h;
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
    ctx.respostaSelecionada.value = null;
    ctx.tela.value = 'historia';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function iniciarPerguntasHistoria() {
    mostrandoPerguntas.value = true;
    indicePergunta.value = 0;
    ctx.respostaSelecionada.value = null;
  }

  function responder(i) {
    ctx.respostaSelecionada.value = i;
    if (LB.respostas.ehCorreta(perguntaAtual.value, i)) ctx.estrelas.value++;
  }

  function proximaPergunta() {
    if (indicePergunta.value + 1 < historiaAtual.value.perguntas.length) {
      indicePergunta.value++;
      ctx.respostaSelecionada.value = null;
    } else {
      ctx.marcarConcluido(historiaAtual.value.id);
      ctx.irPara('ler');
    }
  }

  function classeOpcao(i) {
    if (ctx.respostaSelecionada.value === null) return '';
    if (LB.respostas.ehCorreta(perguntaAtual.value, i)) return 'correta';
    if (i === ctx.respostaSelecionada.value) return 'errada';
    return '';
  }

  function zerar() {
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
  }

  return {
    historiaAtual, mostrandoPerguntas, indicePergunta, perguntaAtual,
    abrirHistoria, iniciarPerguntasHistoria, responder, proximaPergunta, classeOpcao, zerar
  };
};
