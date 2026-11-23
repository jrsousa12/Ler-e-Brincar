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

  // Cartões da lista: atividades com o mesmo título viram um grupo só ("Inferência 3 de 14").
  const gruposAtividades = computed(() => {
    const grupos = new Map();
    for (const a of atividadesFiltradas.value) {
      const chave = a.materia + '|' + a.titulo;
      if (!grupos.has(chave)) grupos.set(chave, { chave, titulo: a.titulo, materia: a.materia, itens: [] });
      grupos.get(chave).itens.push(a);
    }
    return [...grupos.values()].map(g => ({ ...g, feitos: g.itens.filter(a => ctx.concluidos.value[a.id]).length }));
  });

  // Abre a primeira atividade do grupo ainda não feita (ou uma qualquer, se todas já foram feitas).
  function abrirGrupo(g) {
    const falta = g.itens.find(a => !ctx.concluidos.value[a.id]);
    abrirAtividade(falta || g.itens[Math.floor(Math.random() * g.itens.length)]);
  }

  const ra = LB.criarResposta(ctx, () => {
    const a = atividadeAtual.value;
    return {
      item: a, id: a.id, materia: a.materia, habilidade: a.habilidadeBNCC, titulo: a.titulo,
      aoAcertar: () => ctx.marcarConcluido(a.id),
      aoPrimeira: (deprimeira) => ctx.anotarCaderno(a, deprimeira)
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

  return { atividadeAtual, filtroMateria, atividadesFiltradas, gruposAtividades, ra, abrirAtividade, abrirGrupo, concluirAtividade };
};
