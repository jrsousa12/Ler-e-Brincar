// Telas "Atividades" (lista com filtro) e "Atividade" (uma questão de LP ou Matemática).
LB.usarAtividades = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const atividadeAtual = ref(null);
  const filtroMateria = ref('todas');
  const acertouAtividade = ref(false);

  const atividadesFiltradas = computed(() => {
    const todas = LB.CONTEUDO.activities;
    if (filtroMateria.value === 'todas') return todas;
    return todas.filter(a => a.materia === filtroMateria.value);
  });

  function abrirAtividade(a) {
    atividadeAtual.value = a;
    ctx.respostaSelecionada.value = null;
    acertouAtividade.value = false;
    ctx.tela.value = 'atividade';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // `op` (texto da opção) fica na assinatura porque o HTML o envia; a regra usa só a posição.
  function responderAtividade(i, op) {
    ctx.respostaSelecionada.value = i;
    const acertou = LB.respostas.ehCorreta(atividadeAtual.value, i);
    acertouAtividade.value = acertou;
    if (acertou) {
      ctx.estrelas.value++;
      ctx.marcarConcluido(atividadeAtual.value.id);
    }
  }

  function classeOpcaoAtividade(i, op) {
    if (ctx.respostaSelecionada.value === null) return '';
    if (LB.respostas.ehCorreta(atividadeAtual.value, i)) return 'correta';
    if (i === ctx.respostaSelecionada.value) return 'errada';
    return '';
  }

  return {
    atividadeAtual, filtroMateria, atividadesFiltradas, acertouAtividade,
    abrirAtividade, responderAtividade, classeOpcaoAtividade
  };
};
