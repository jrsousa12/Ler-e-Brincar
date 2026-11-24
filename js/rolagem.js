// Rolagem automática: quando aparece a resposta ("Muito bem!", "Tente de novo") e o botão de seguir,
// a página desce sozinha até eles se estiverem escondidos embaixo da tela (celular e tablet).
// Nunca esconde o começo da mensagem. Respeita "reduzir movimento". Teste: testes/t_rolagem.js
(function () {
  'use strict';
  const MENSAGEM = '.feedback, .feedback-jogo';
  let ultima = '';      // mensagem que já foi mostrada (não rola de novo pela mesma)
  let espera = null;

  const visivel = el => !!el && el.getClientRects().length > 0;   // vale também para caixas fixas na tela
  const altura = sel => { const el = document.querySelector(sel); return visivel(el) ? el.getBoundingClientRect().height : 0; };
  const suave = () => !document.documentElement.classList.contains('reduzir-movimento') &&
    !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Precisa caber na tela: a mensagem e o botão logo depois dela (as brincadeiras já põem o botão dentro).
  function rolarAte(msg) {
    const prox = msg.nextElementSibling;
    const fim = prox && prox.tagName === 'BUTTON' && visivel(prox) ? prox : msg;
    const topo = altura('.cabecalho-app') + 8;
    const fundo = window.innerHeight - altura('.nav-inferior') - 12;
    const cima = msg.getBoundingClientRect().top;
    const baixo = fim.getBoundingClientRect().bottom;
    const desce = Math.min(baixo - fundo, cima - topo);
    if (desce > 0) window.scrollBy({ top: desce, behavior: suave() ? 'smooth' : 'auto' });
  }

  function conferir() {
    const msg = [...document.querySelectorAll(MENSAGEM)].find(visivel);
    const chave = msg ? msg.className + '|' + msg.textContent.trim() : '';
    if (chave === ultima) return;
    ultima = chave;
    if (msg) rolarAte(msg);
  }

  // Espera a tela se arrumar (festa, botão aparecendo) antes de medir.
  new MutationObserver(() => { clearTimeout(espera); espera = setTimeout(conferir, 250); })
    .observe(document.body, { childList: true, subtree: true, characterData: true });

  LB.rolagem = { conferir };
})();
