// Tela "Selos": progresso geral e conquistas.
LB.usarSelos = function (ctx) {
  'use strict';
  const { computed } = Vue;
  const C = LB.CONTEUDO;
  const feitos = lista => lista.filter(x => ctx.concluidos.value[x.id]).length;

  const totalItens = computed(() => C.stories.length + C.activities.length + C.colorir.length);
  const totalConcluidos = computed(() => Object.keys(ctx.concluidos.value).length);
  const progressoGeral = computed(() =>
    totalItens.value ? Math.round(totalConcluidos.value / totalItens.value * 100) : 0);

  const historiasLidas = computed(() => feitos(C.stories));
  const atividadesConcluidas = computed(() => feitos(C.activities));
  const coloridos = computed(() => feitos(C.colorir));

  const selos = computed(() => [
    { id: 'iniciante', nome: 'Leitor Iniciante', emoji: '🌱', desbloqueado: historiasLidas.value >= 1 },
    { id: 'devorador', nome: 'Devorador de Histórias', emoji: '📚', desbloqueado: historiasLidas.value >= 5 },
    { id: 'matematico', nome: 'Pequeno Matemático', emoji: '🧮', desbloqueado: atividadesConcluidas.value >= 5 },
    { id: 'artista', nome: 'Artista', emoji: '🎨', desbloqueado: coloridos.value >= 3 },
    { id: 'cinquenta', nome: '50 Estrelas', emoji: '⭐', desbloqueado: ctx.estrelas.value >= 50 },
    { id: 'cem', nome: 'Colecionador', emoji: '🌟', desbloqueado: ctx.estrelas.value >= 100 },
    { id: 'explorador', nome: 'Explorador', emoji: '🧭', desbloqueado: totalConcluidos.value >= 10 },
    { id: 'campeao', nome: 'Campeão', emoji: '🏆', desbloqueado: progressoGeral.value >= 50 }
  ]);
  const selosDesbloqueados = computed(() => selos.value.filter(s => s.desbloqueado).length);

  return { totalItens, totalConcluidos, progressoGeral, selos, selosDesbloqueados };
};
