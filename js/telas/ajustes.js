// Trava dos adultos (uma conta de multiplicar) e tela "Ajustes" (voz, som, fonte, tamanho, zerar).
LB.usarAjustes = function (ctx) {
  'use strict';
  const { ref, watch } = Vue;
  const portaoAberto = ref(false);
  const portao = ref({ a: 7, b: 8, resposta: '', erro: false });
  const numero = () => 6 + Math.floor(Math.random() * 4); // 6 a 9

  function abrirPortao() {
    LB.voz.parar();
    portao.value = { a: numero(), b: numero(), resposta: '', erro: false };
    portaoAberto.value = true;
  }
  function fecharPortao() { portaoAberto.value = false; }
  function conferirPortao() {
    const p = portao.value;
    if (Number(String(p.resposta).trim()) === p.a * p.b) {
      portaoAberto.value = false;
      ctx.irPara('responsavel');
    } else {
      portao.value = { a: numero(), b: numero(), resposta: '', erro: true };
    }
  }

  const alternar = (campo) => { ctx.ajustes.value[campo] = !ctx.ajustes.value[campo]; };
  function mudarTamanho(t) { ctx.ajustes.value.tamanho = t; }
  function mudarVelocidade(v) {
    ctx.ajustes.value.velocidade = v;
    LB.voz.mudarVelocidade(v);
    LB.voz.falar('Olá! Esta é a minha voz.');
  }
  // Lista de vozes do aparelho (o navegador pode entregá-las com atraso).
  const vozes = ref(LB.voz.listar());
  LB.voz.aoMudarLista = () => { vozes.value = LB.voz.listar(); };
  function escolherVoz(nome) {
    ctx.ajustes.value.nomeVoz = nome;
    LB.voz.usar(nome);
    LB.voz.falar('Olá! Esta é a minha voz.');
  }
  async function resetarProgresso() {
    const sim = await ctx.perguntar({
      titulo: 'Zerar o progresso?',
      texto: 'Isso apaga estrelas, selos, missões e respostas. Se quiser guardar, baixe uma cópia de segurança antes.',
      sim: 'Zerar tudo', perigo: true
    });
    if (!sim) return;
    ctx.estrelas.value = 0;
    ctx.concluidos.value = {};
    ctx.diasMissao.value = [];
    ctx.missao.value = null;
    ctx.caderno.value = LB.caderno.vazio();
    ctx.selosVistos.value = [];
    await LB.tentativas.apagar();
    ctx.irPara('home');
  }

  // Aplica os ajustes na página inteira
  watch(ctx.ajustes, (v) => {
    const html = document.documentElement;
    html.classList.toggle('fonte-dislexia', v.dislexia);
    html.classList.remove('tamanho-pequeno', 'tamanho-medio', 'tamanho-grande');
    html.classList.add('tamanho-' + v.tamanho);
    html.classList.toggle('reduzir-movimento', !!v.reduzirMovimento);
    html.classList.toggle('tema-creme', v.tema === 'creme');
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = v.tema === 'creme' ? '#7C3AED' : '#2B8BE6';
    LB.festa.config = { vibrar: v.vibrar !== false, reduzirMovimento: !!v.reduzirMovimento };
  }, { deep: true, immediate: true });

  return {
    portaoAberto, portao, abrirPortao, fecharPortao, conferirPortao,
    alternar, mudarTamanho, mudarVelocidade, resetarProgresso, vozes, escolherVoz, vozDisponivel: LB.voz.disponivel,
    podeVibrar: typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
  };
};
