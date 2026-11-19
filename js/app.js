// Monta o app: estado comum, navegação, salvar/carregar progresso e junta as telas (js/telas/).
(function () {
  'use strict';
  if (typeof Vue === 'undefined') {
    document.getElementById('app').innerHTML =
      '<div style="padding:24px;font-family:sans-serif;color:#d9534f"><h2>❌ O app não carregou</h2>' +
      '<p>Falta o arquivo vendor/vue.global.prod.js. Avise o responsável.</p></div>';
    return;
  }
  const { createApp, ref, watch, onMounted } = Vue;

  LB.CONTEUDO = { stories: LB.historias, activities: [...LB.lp, ...LB.mat], colorir: LB.colorir };

  const App = {
    setup() {
      // Estado comum a todas as telas
      const ctx = {
        tela: ref('home'),
        estrelas: ref(0),
        concluidos: ref({}),
        ajustes: ref({ dislexia: false, tamanho: 'medio' }),
        respostaSelecionada: ref(null)
      };
      ctx.marcarConcluido = (id) => {
        if (!ctx.concluidos.value[id]) ctx.concluidos.value = { ...ctx.concluidos.value, [id]: true };
      };

      const historias = LB.usarHistorias(ctx);
      ctx.irPara = (t) => {
        ctx.tela.value = t;
        ctx.respostaSelecionada.value = null;
        historias.zerar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      watch([ctx.estrelas, ctx.concluidos, ctx.ajustes], () => {
        LB.banco.salvarEstado({
          estrelas: ctx.estrelas.value, concluidos: ctx.concluidos.value, ajustes: ctx.ajustes.value
        });
      }, { deep: true });

      onMounted(async () => {
        const est = await LB.banco.carregarEstado();
        if (!est) return;
        ctx.estrelas.value = est.estrelas || 0;
        ctx.concluidos.value = est.concluidos || {};
        ctx.ajustes.value = est.ajustes || { dislexia: false, tamanho: 'medio' };
      });

      return {
        conteudo: LB.CONTEUDO,
        ...ctx,
        ...historias,
        ...LB.usarAtividades(ctx),
        ...LB.usarColorir(ctx),
        ...LB.usarSelos(ctx),
        ...LB.usarAjustes(ctx)
      };
    }
  };

  createApp(App).mount('#app');
})();
