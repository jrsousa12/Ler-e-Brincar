// Telas "Atividades" (lista com filtro) e "Atividade" (uma questão de LP ou Matemática).
LB.usarAtividades = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const atividadeAtual = ref(null);
  const filtroMateria = ref('todas');

  const atividadesFiltradas = computed(() => {
    const todas = LB.CONTEUDO.activities;
    if (filtroMateria.value === 'todas') return todas;
    return todas.filter(a => a.materia === filtroMateria.value);
  });

  const ra = LB.criarResposta(ctx, () => {
    const a = atividadeAtual.value;
    return {
      item: a, id: a.id, materia: a.materia, habilidade: a.habilidadeBNCC, titulo: a.titulo,
      aoAcertar: () => ctx.marcarConcluido(a.id)
    };
  });

  function abrirAtividade(a) {
    atividadeAtual.value = LB.sortearOpcoes(a); // ordem dos botões muda a cada vez
    a = atividadeAtual.value;
    ra.zerar();
    ctx.tela.value = 'atividade';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    ctx.falarSozinho(LB.voz.textoPergunta(a.enunciado, a.opcoes));
  }

  const concluirAtividade = () => ctx.terminarItem('atividades');

  return { atividadeAtual, filtroMateria, atividadesFiltradas, ra, abrirAtividade, concluirAtividade };
};
