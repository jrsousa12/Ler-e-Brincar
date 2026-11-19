// Portão dos pais (setas + deslizar) e tela "Ajustes" (fonte para dislexia, tamanho, zerar).
LB.usarAjustes = function (ctx) {
  'use strict';
  const { ref, watch } = Vue;
  const portaoAberto = ref(false);
  const portao = ref({ setas: ['←', '←', '→'], indice: 0, gestoOk: false });
  const gestoInicio = ref(0);
  const setasFeitas = () => portao.value.indice >= portao.value.setas.length;

  function abrirPortao() {
    portaoAberto.value = true;
    portao.value = { setas: ['←', '←', '→'], indice: 0, gestoOk: false };
  }
  function fecharPortao() { portaoAberto.value = false; }
  function clicarSeta(i) {
    if (i === portao.value.indice && !setasFeitas()) portao.value.indice++;
  }
  function iniciarGesto(e) {
    if (!setasFeitas()) return;
    gestoInicio.value = e.touches ? e.touches[0].clientX : e.clientX;
  }
  function terminarGesto(e) {
    if (!setasFeitas()) return;
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    if (x - gestoInicio.value > 80) {
      portao.value.gestoOk = true;
      setTimeout(() => { portaoAberto.value = false; ctx.irPara('ajustes'); }, 400);
    }
  }

  function toggleDislexia() { ctx.ajustes.value.dislexia = !ctx.ajustes.value.dislexia; }
  function mudarTamanho(t) { ctx.ajustes.value.tamanho = t; }
  function resetarProgresso() {
    if (confirm('Tem certeza que deseja zerar todo o progresso?')) {
      ctx.estrelas.value = 0;
      ctx.concluidos.value = {};
    }
  }

  // Aplica os ajustes na página inteira
  watch(ctx.ajustes, (v) => {
    const html = document.documentElement;
    html.classList.toggle('fonte-dislexia', v.dislexia);
    html.classList.remove('tamanho-pequeno', 'tamanho-medio', 'tamanho-grande');
    html.classList.add('tamanho-' + v.tamanho);
  }, { deep: true, immediate: true });

  return {
    portaoAberto, portao, abrirPortao, fecharPortao, clicarSeta,
    iniciarGesto, terminarGesto, iniciarGestoTouch: iniciarGesto, terminarGestoTouch: terminarGesto,
    toggleDislexia, mudarTamanho, resetarProgresso
  };
};
