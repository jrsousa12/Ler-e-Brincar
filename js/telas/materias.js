// Mapa do app por matéria (Etapa B, 27/11): telas "Português", "Matemática" e "Prêmios".
// LB.materiaDe é a fonte única de onde fica cada brincadeira (Voltar e Concluir voltam para lá).
// Teste: testes/t_materias.js
LB.materiaDe = {
  silabas: 'portugues', memoria: 'portugues', 'som-figura': 'portugues', ordem: 'portugues',
  mercado: 'matematica', trem: 'matematica', pacote: 'matematica',
  relogio: 'matematica',
  regua: 'matematica',
  formas: 'matematica'
};

// Telas de cada aba do menu de baixo (para acender a aba certa)
LB.areaDaTela = function (tela, filtroMateria) {
  'use strict';
  if (LB.materiaDe[tela]) return LB.materiaDe[tela];
  if (['portugues', 'ler', 'historia'].includes(tela)) return 'portugues';
  if (tela === 'matematica') return 'matematica';
  if (['atividades', 'atividade'].includes(tela)) return filtroMateria === 'matematica' ? 'matematica' : 'portugues';
  if (['premios', 'recompensas', 'colorir', 'colorir-item'].includes(tela)) return 'premios';
  return 'home';
};

LB.usarMaterias = function (ctx, atividades) {
  'use strict';
  const area = Vue.computed(() => LB.areaDaTela(ctx.tela.value, atividades.filtroMateria.value));
  // Questões (Português) ou Contas (Matemática): lista de atividades só daquela matéria
  function abrirQuestoes(materia) {
    atividades.filtroMateria.value = materia;
    ctx.irPara('atividades');
  }
  return { area, abrirQuestoes };
};
