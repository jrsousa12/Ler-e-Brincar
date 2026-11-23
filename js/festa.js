// Festa do acerto (confete + som) e incentivo no erro. Som feito pelo próprio app, sem arquivos.
(function () {
  'use strict';
  let audio = null;
  const sorteia = lista => lista[Math.floor(Math.random() * lista.length)];

  function tocar(notas) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime;
      notas.forEach(([freq, inicio, dur, tipo]) => {
        const osc = audio.createOscillator();
        const vol = audio.createGain();
        osc.type = tipo || 'sine';
        osc.frequency.value = freq;
        vol.gain.setValueAtTime(0.0001, t0 + inicio);
        vol.gain.exponentialRampToValueAtTime(0.18, t0 + inicio + 0.02);
        vol.gain.exponentialRampToValueAtTime(0.0001, t0 + inicio + dur);
        osc.connect(vol).connect(audio.destination);
        osc.start(t0 + inicio);
        osc.stop(t0 + inicio + dur + 0.05);
      });
    } catch (e) { /* aparelho sem som: segue sem */ }
  }

  // Vibração curta (se o aparelho tiver e o ajuste estiver ligado).
  function vibrar(padrao) {
    try { if (LB.festa.config.vibrar && navigator.vibrate) navigator.vibrate(padrao); } catch (e) { /* segue */ }
  }

  function confete(qtd) {
    if (LB.festa.config.reduzirMovimento) return;
    const cores = ['#FF6B6B', '#FFD43B', '#51CF66', '#4DABF7', '#9775FA', '#F783AC'];
    const caixa = document.createElement('div');
    caixa.className = 'confete';
    caixa.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < qtd; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = sorteia(cores);
      p.style.animationDelay = Math.random() * 0.4 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      caixa.appendChild(p);
    }
    document.body.appendChild(caixa);
    setTimeout(() => caixa.remove(), 2600);
  }

  // Estrelinha sai do botão tocado (ou do meio da tela) e voa até o contador do topo.
  function estrelaVoando() {
    const alvo = document.querySelector('.contador-estrelas');
    if (LB.festa.config.reduzirMovimento || !alvo || !document.body.animate) return;
    const foco = document.activeElement && document.activeElement.closest && document.activeElement.closest('.opcao');
    const a = foco ? foco.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const b = alvo.getBoundingClientRect();
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
    const x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const e = document.createElement('div');
    e.textContent = '⭐';
    e.setAttribute('aria-hidden', 'true');
    e.style.cssText = 'position:fixed;left:0;top:0;z-index:60;font-size:2rem;pointer-events:none';
    document.body.appendChild(e);
    const anim = e.animate([
      { transform: `translate(${x0 - 16}px,${y0 - 16}px) scale(.6)`, opacity: 1 },
      { transform: `translate(${x0 - 16}px,${y0 - 70}px) scale(1.5)`, opacity: 1, offset: .3 },
      { transform: `translate(${x1 - 16}px,${y1 - 16}px) scale(.7)`, opacity: .9 }
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' });
    anim.onfinish = () => {
      e.remove();
      if (alvo.animate) alvo.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 300 });
    };
  }

  LB.festa = {
    estrelaVoando,
    config: { vibrar: true, reduzirMovimento: false }, // ligado aos Ajustes (js/telas/ajustes.js)
    acerto(comSom) {
      confete(40);
      vibrar(40);
      if (comSom) tocar([[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.3]]);
    },
    erro(comSom) {
      vibrar([60, 60, 60]);
      if (comSom) tocar([[330, 0, 0.18, 'triangle'], [262, 0.16, 0.25, 'triangle']]);
    },
    grande(comSom) {
      confete(120);
      vibrar([80, 60, 80, 60, 160]);
      if (comSom) tocar([[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.15], [1047, 0.45, 0.5]]);
    },
    elogio: () => sorteia(['Muito bem!', 'Isso aí!', 'Você acertou!', 'Mandou bem!', 'Parabéns!']),
    incentivo: () => sorteia(['Quase! Tente de novo.', 'Não foi dessa vez. Você consegue!',
      'Pense mais um pouquinho e tente outra vez.'])
  };
})();
