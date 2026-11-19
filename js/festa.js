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

  function confete(qtd) {
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

  LB.festa = {
    acerto(comSom) {
      confete(40);
      if (comSom) tocar([[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.3]]);
    },
    erro(comSom) {
      if (comSom) tocar([[330, 0, 0.18, 'triangle'], [262, 0.16, 0.25, 'triangle']]);
    },
    grande(comSom) {
      confete(120);
      if (comSom) tocar([[523, 0, 0.15], [659, 0.15, 0.15], [784, 0.3, 0.15], [1047, 0.45, 0.5]]);
    },
    elogio: () => sorteia(['Muito bem!', 'Isso aí!', 'Você acertou!', 'Mandou bem!', 'Parabéns!']),
    incentivo: () => sorteia(['Quase! Tente de novo.', 'Não foi dessa vez. Você consegue!',
      'Pense mais um pouquinho e tente outra vez.'])
  };
})();
