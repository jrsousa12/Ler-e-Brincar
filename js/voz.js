// Leitura em voz alta com a voz do próprio aparelho (funciona sem internet).
(function () {
  'use strict';
  const sintese = window.speechSynthesis || null;
  let vozBR = null;
  let velocidade = 0.9;

  function escolherVoz() {
    if (!sintese) return;
    const vozes = sintese.getVoices();
    vozBR = vozes.find(v => /pt[-_]BR/i.test(v.lang)) || vozes.find(v => /^pt/i.test(v.lang)) || null;
  }
  if (sintese) {
    escolherVoz();
    if (sintese.addEventListener) sintese.addEventListener('voiceschanged', escolherVoz);
  }

  // Tira emojis e troca sinais por palavras, para a voz ler direito.
  function limpar(t) {
    return String(t)
      .replace(/\p{Extended_Pictographic}|️/gu, '')
      .replace(/_{2,}/g, ' ... ')
      .replace(/\s*−\s*|\s+-\s+/g, ' menos ')
      .replace(/\s*\+\s*/g, ' mais ')
      .replace(/\s*×\s*/g, ' vezes ')
      .replace(/\s*÷\s*/g, ' dividido por ')
      .replace(/\s*=\s*/g, ' é igual a ')
      .replace(/\s+/g, ' ').trim();
  }

  function falar(texto) {
    if (!sintese || !texto) return;
    sintese.cancel();
    const u = new SpeechSynthesisUtterance(limpar(texto));
    u.lang = 'pt-BR';
    if (vozBR) u.voice = vozBR;
    u.rate = velocidade;
    sintese.speak(u);
  }

  // Pergunta + opções: "Qual é a cor? Azul. Vermelho. Verde."
  function textoPergunta(enunciado, opcoes) {
    return enunciado + ' ' + (opcoes || []).map(o => String(o) + '.').join(' ');
  }

  LB.voz = {
    falar, textoPergunta, limpar,
    parar: () => { if (sintese) sintese.cancel(); },
    disponivel: !!sintese,
    mudarVelocidade: v => { velocidade = v; }
  };
})();
