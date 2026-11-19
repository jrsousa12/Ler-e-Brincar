// Área do responsável: progresso, onde errou mais (por habilidade da BNCC) e impressão.
LB.usarResponsavel = function (ctx) {
  'use strict';
  const { ref, computed, watch } = Vue;
  const C = LB.CONTEUDO;
  const registros = ref([]);
  const desenhoParaImprimir = ref(C.colorir[0] ? C.colorir[0].id : '');
  const NOMES = { leitura: '📖 Leitura', 'lingua-portuguesa': '📝 Português', matematica: '🧮 Matemática' };

  watch(ctx.tela, async (t) => { if (t === 'responsavel') registros.value = await LB.tentativas.todas(); });

  // Só a 1ª tentativa de cada pergunta conta para a taxa de acerto.
  const porMateria = computed(() => Object.keys(NOMES).map(mat => {
    const primeiras = registros.value.filter(r => r.materia === mat && r.tentativa === 1);
    const certas = primeiras.filter(r => r.acertou).length;
    return {
      materia: mat, nome: NOMES[mat], respondidas: primeiras.length,
      taxa: primeiras.length ? Math.round(certas / primeiras.length * 100) : null
    };
  }));

  const ondeErrou = computed(() => {
    const grupos = {};
    for (const r of registros.value) {
      const g = grupos[r.habilidade] || (grupos[r.habilidade] = {
        habilidade: r.habilidade, materia: NOMES[r.materia] || r.materia, erros: 0, total: 0, titulos: new Set()
      });
      if (r.tentativa === 1) g.total++;
      if (!r.acertou) { g.erros++; g.titulos.add(r.titulo); }
    }
    return Object.values(grupos).filter(g => g.erros > 0)
      .sort((a, b) => b.erros - a.erros).slice(0, 6)
      .map(g => ({ ...g, exemplos: [...g.titulos].slice(0, 3).join(' · ') }));
  });

  const feitosPorArea = computed(() => {
    const n = lista => lista.filter(x => ctx.concluidos.value[x.id]).length;
    const lp = C.activities.filter(a => a.materia === 'lingua-portuguesa');
    const mat = C.activities.filter(a => a.materia === 'matematica');
    return [
      { nome: '📖 Histórias', feitos: n(C.stories), total: C.stories.length },
      { nome: '📝 Português', feitos: n(lp), total: lp.length },
      { nome: '🧮 Matemática', feitos: n(mat), total: mat.length },
      { nome: '🎨 Desenhos', feitos: n(C.colorir), total: C.colorir.length }
    ];
  });

  // Atividades com erro primeiro; completa com as ainda não feitas.
  function imprimirAtividades(materia) {
    const daMateria = C.activities.filter(a => a.materia === materia);
    const comErro = new Set(registros.value.filter(r => !r.acertou).map(r => r.id));
    const lista = [...daMateria.filter(a => comErro.has(a.id)),
      ...daMateria.filter(a => !comErro.has(a.id) && !ctx.concluidos.value[a.id]),
      ...daMateria].filter((a, i, arr) => arr.indexOf(a) === i).slice(0, 8);
    LB.impressao.imprimir(LB.impressao.atividades(lista, materia === 'matematica' ? 'Matemática' : 'Português'));
  }
  function imprimirDesenho() {
    const c = C.colorir.find(x => x.id === desenhoParaImprimir.value);
    if (c) LB.impressao.imprimir(LB.impressao.desenho(c));
  }

  return {
    registros, porMateria, ondeErrou, feitosPorArea, desenhoParaImprimir,
    imprimirAtividades, imprimirDesenho
  };
};
