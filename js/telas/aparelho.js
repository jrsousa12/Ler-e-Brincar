// Coisas do aparelho: botão "Instalar", aviso de versão nova e tela cheia.
LB.usarAparelho = function (ctx) {
  'use strict';
  const { ref, onMounted, onUnmounted } = Vue;
  const podeInstalar = ref(false);
  const versaoNova = ref(!!(LB.sw && LB.sw.esperando));
  const emTelaCheia = ref(!!document.fullscreenElement);
  const el = document.documentElement;
  const telaCheiaDisponivel = !!(el.requestFullscreen || el.webkitRequestFullscreen);
  let pedidoInstalar = null;

  const aoPedirInstalar = (e) => { e.preventDefault(); pedidoInstalar = e; podeInstalar.value = true; };
  const aoInstalar = () => { pedidoInstalar = null; podeInstalar.value = false; };
  const aoVersaoNova = () => { versaoNova.value = true; };
  const aoTelaCheia = () => { emTelaCheia.value = !!(document.fullscreenElement || document.webkitFullscreenElement); };

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', aoPedirInstalar);
    window.addEventListener('appinstalled', aoInstalar);
    window.addEventListener('lb-versao-nova', aoVersaoNova);
    document.addEventListener('fullscreenchange', aoTelaCheia);
    document.addEventListener('webkitfullscreenchange', aoTelaCheia);
  });
  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', aoPedirInstalar);
    window.removeEventListener('appinstalled', aoInstalar);
    window.removeEventListener('lb-versao-nova', aoVersaoNova);
    document.removeEventListener('fullscreenchange', aoTelaCheia);
    document.removeEventListener('webkitfullscreenchange', aoTelaCheia);
  });

  async function instalar() {
    if (!pedidoInstalar) return;
    pedidoInstalar.prompt();
    try { await pedidoInstalar.userChoice; } catch (e) { /* segue */ }
    aoInstalar();
  }
  function alternarTelaCheia() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) { /* aparelho não deixa: segue */ }
  }
  const atualizarApp = () => LB.sw.atualizar();

  return { podeInstalar, instalar, versaoNova, atualizarApp, emTelaCheia, telaCheiaDisponivel, alternarTelaCheia };
};
