// Título que aparece no cabeçalho de cada tela (Etapa C, 27/11). O "← Voltar" de cada tela é
// levado para o cabeçalho com <teleport to="#slot-voltar"> (ver js/moldes/), junto do título.
LB.TITULOS_TELA = {
  home: 'Ler & Brincar', portugues: '📝 Português', matematica: '🧮 Matemática', premios: '🏆 Prêmios',
  missao: '🚀 Missão do dia', ler: '📖 Histórias', historia: '📖 Histórias', colorir: '🎨 Desenhos para colorir',
  'colorir-item': '🎨 Colorir', recompensas: '🏅 Minhas conquistas', responsavel: '🔒 Área do responsável',
  silabas: '🧩 Monte a Palavra', memoria: '🃏 Memória', 'som-figura': '🔊 Som e Figura', ordem: '🔢 Ordem dos Fatos',
  mercado: '🛒 Mercadinho', trem: '🚂 Trem dos números', pacote: '📦 Pacotes de contas'
};

LB.usarTopo = function (ctx, atividades) {
  'use strict';
  const tituloTela = Vue.computed(() => {
    const t = ctx.tela.value;
    if (t === 'atividades' || t === 'atividade') return atividades.filtroMateria.value === 'matematica' ? '➕ Contas' : '📝 Questões';
    return LB.TITULOS_TELA[t] || 'Ler & Brincar';
  });
  return { tituloTela };
};
