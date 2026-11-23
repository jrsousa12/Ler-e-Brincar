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
  const AJUSTES_PADRAO = { dislexia: false, tamanho: 'medio', vozAuto: true, velocidade: 0.9, nomeVoz: '', som: true, vibrar: true, reduzirMovimento: false, tema: 'azul' };

  // Junta os moldes das telas (js/moldes/) num só HTML.
  const m = LB.moldes;
  const molde = m.cabecalho +
    '<div class="container" v-if="!portaoAberto">' + m.versao +
    m.inicio + m.missao + m.historias + m.atividades + m.silabas + m.memoria + m.somfigura + m.mercado + m.trem + m.colorir + m.selos + m.responsavel + m.ajustes + m.backup +
    '</div>' + m.portao + m.navegacao + m.confirmar + m.selonovo;

  const App = {
    template: molde,
    setup() {
      // Estado comum a todas as telas
      const ctx = {
        tela: ref('home'),
        estrelas: ref(0),
        concluidos: ref({}),
        ajustes: ref({ ...AJUSTES_PADRAO }),
        missao: ref(null),        // missão de hoje (js/missao.js)
        diasMissao: ref([]),      // datas com missão completa
        passoAtivo: ref(null),    // passo da missão em andamento (null = fora da missão)
        caderno: ref(LB.caderno.vazio()), // caderno de erros e pontos fracos (js/caderno.js)
        selosVistos: ref(null)    // selos já mostrados na festa (js/telas/selonovo.js)
      };
      ctx.marcarConcluido = (id) => {
        if (!ctx.concluidos.value[id]) ctx.concluidos.value = { ...ctx.concluidos.value, [id]: true };
      };
      ctx.anotarCaderno = (item, deprimeira) => {
        ctx.caderno.value = LB.caderno.anotar(ctx.caderno.value, item, deprimeira, new Date().toISOString().slice(0, 10));
      };
      ctx.ouvir = (texto) => LB.voz.falar(texto);
      ctx.falarSozinho = (texto) => { if (ctx.ajustes.value.vozAuto) LB.voz.falar(texto); };

      const confirmar = LB.usarConfirmar(ctx); // cria ctx.perguntar
      const historias = LB.usarHistorias(ctx);
      ctx.irPara = (t) => {
        LB.voz.parar();
        ctx.tela.value = t;
        ctx.passoAtivo.value = null;
        historias.zerar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      // Voltar: dentro da missão volta para a trilha; fora, para a lista indicada.
      ctx.voltar = (padrao) => ctx.irPara(ctx.passoAtivo.value !== null ? 'missao' : padrao);

      const atividades = LB.usarAtividades(ctx);
      const colorir = LB.usarColorir(ctx);
      ctx.abrir = { historia: historias.abrirHistoria, atividade: atividades.abrirAtividade, colorir: colorir.abrirColorir };
      const missao = LB.usarMissao(ctx);
      ctx.diasSeguidos = missao.diasSeguidos;
      ctx.terminarItem = (padrao) => {
        if (ctx.passoAtivo.value !== null) missao.marcarPasso(ctx.passoAtivo.value);
        ctx.voltar(padrao);
      };

      // Progresso guardado: um lugar só para ler e trocar (usado ao salvar, abrir e na cópia de segurança).
      ctx.estadoAtual = () => ({
        estrelas: ctx.estrelas.value, concluidos: ctx.concluidos.value, ajustes: ctx.ajustes.value,
        missao: ctx.missao.value, diasMissao: ctx.diasMissao.value, caderno: ctx.caderno.value,
        selosVistos: ctx.selosVistos.value
      });
      ctx.aplicarEstado = (est) => {
        ctx.estrelas.value = est.estrelas || 0;
        ctx.concluidos.value = est.concluidos || {};
        ctx.ajustes.value = { ...AJUSTES_PADRAO, ...(est.ajustes || {}) };
        ctx.missao.value = est.missao || null;
        ctx.diasMissao.value = est.diasMissao || [];
        ctx.caderno.value = est.caderno || LB.caderno.vazio();
        ctx.selosVistos.value = est.selosVistos || null;
        missao.garantir();
        ctx.prepararSelos();
      };
      watch([ctx.estrelas, ctx.concluidos, ctx.ajustes, ctx.missao, ctx.diasMissao, ctx.caderno, ctx.selosVistos],
        () => LB.banco.salvarEstado(ctx.estadoAtual()), { deep: true });
      watch(() => ctx.ajustes.value.velocidade, v => LB.voz.mudarVelocidade(v), { immediate: true });
      watch(() => ctx.ajustes.value.nomeVoz, n => LB.voz.usar(n), { immediate: true });

      onMounted(async () => {
        const est = await LB.banco.carregarEstado();
        if (est) ctx.aplicarEstado(est);
        else { missao.garantir(); ctx.prepararSelos(); }
      });

      const selos = LB.usarSelos(ctx);
      const seloNovo = LB.usarSeloNovo(ctx, selos.selos);

      return {
        conteudo: LB.CONTEUDO,
        mascote: LB.mascote.desenho,
        textoPergunta: (p) => LB.voz.textoPergunta(p.enunciado, p.opcoes),
        ...ctx,
        ...historias,
        ...atividades,
        ...colorir,
        ...LB.usarSilabas(ctx),
        ...LB.usarMercado(ctx),
        ...LB.usarTrem(ctx),
        ...LB.usarMemoria(ctx),
        ...LB.usarSomFigura(ctx),
        ...missao.publico,
        diasSeguidos: missao.diasSeguidos,
        ...selos,
        ...seloNovo,
        ...LB.usarAjustes(ctx),
        ...LB.usarResponsavel(ctx),
        ...confirmar,
        ...LB.usarBackup(ctx),
        ...LB.usarAparelho(ctx)
      };
    }
  };

  // LB.app: acesso ao app montado (usado pelos testes em testes/t_app.js)
  LB.app = createApp(App).mount('#app');
})();
