// Telas "Ler" e "História": leitura e as perguntas de cada história.
LB.usarHistorias = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const historiaAtual = ref(null);
  const mostrandoPerguntas = ref(false);
  const indicePergunta = ref(0);

  const perguntaAtual = computed(() =>
    historiaAtual.value ? historiaAtual.value.perguntas[indicePergunta.value] : null);

  const rh = LB.criarResposta(ctx, () => ({
    item: perguntaAtual.value,
    id: historiaAtual.value.id + '-p' + (indicePergunta.value + 1),
    materia: 'leitura',
    habilidade: (historiaAtual.value.habilidadesBNCC || [])[0] || 'leitura',
    titulo: historiaAtual.value.titulo
  }));

  const lerPergunta = () => {
    const p = perguntaAtual.value;
    if (p) ctx.falarSozinho(LB.voz.textoPergunta(p.enunciado, p.opcoes));
  };

  function abrirHistoria(h) {
    historiaAtual.value = h;
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
    rh.zerar();
    ctx.tela.value = 'historia';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function iniciarPerguntasHistoria() {
    mostrandoPerguntas.value = true;
    indicePergunta.value = 0;
    rh.zerar();
    lerPergunta();
  }

  function proximaPergunta() {
    if (indicePergunta.value + 1 < historiaAtual.value.perguntas.length) {
      indicePergunta.value++;
      rh.zerar();
      lerPergunta();
    } else {
      ctx.marcarConcluido(historiaAtual.value.id);
      ctx.terminarItem('ler');
    }
  }

  function zerar() {
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
    rh.zerar();
  }

  return {
    historiaAtual, mostrandoPerguntas, indicePergunta, perguntaAtual, rh,
    abrirHistoria, iniciarPerguntasHistoria, proximaPergunta, zerar
  };
};
