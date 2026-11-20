// Leitura em voz alta com a voz do próprio aparelho (funciona sem internet).
(function () {
  'use strict';
  const sintese = window.speechSynthesis || null;
  let vozBR = null;
  let velocidade = 0.9;
  let preferida = ''; // nome da voz escolhida pelo adulto ('' = automática)

  // Nota de cada voz: português do Brasil primeiro; entre elas, as mais naturais
  // (Google no Android/Chrome, "Natural"/"Online" na Microsoft, "aprimorada" no iPhone).
  function nota(v) {
    let n = 0;
    if (/pt[-_]BR/i.test(v.lang)) n += 100; else if (/^pt/i.test(v.lang)) n += 50; else return -1;
    if (/natural|neural|online|enhanced|premium|aprimorad|melhorad/i.test(v.name)) n += 20;
    if (/google/i.test(v.name)) n += 15;
    if (/compact|espeak/i.test(v.name)) n -= 30;
    if (v.default) n += 1;
    return n;
  }

  function escolherVoz() {
    if (!sintese) return;
    const vozes = sintese.getVoices().filter(v => nota(v) >= 0);
    vozes.sort((a, b) => nota(b) - nota(a));
    vozBR = (preferida && vozes.find(v => v.name === preferida)) || vozes[0] || null;
    if (LB.voz && LB.voz.aoMudarLista) LB.voz.aoMudarLista();
  }

  // Vozes em português do aparelho, da mais natural para a menos.
  function listar() {
    if (!sintese) return [];
    return sintese.getVoices().filter(v => nota(v) >= 0).sort((a, b) => nota(b) - nota(a))
      .map(v => ({ nome: v.name, lingua: v.lang }));
  }

  function usar(nome) { preferida = nome || ''; escolherVoz(); }

  // Corta em frases: cada uma vira uma fala, com pausa natural entre elas.
  // (No Android, falas longas demais também podem parar no meio.)
  function frases(t) {
    return t.split(/(?<=[.!?…])\s+/).map(s => s.trim()).filter(Boolean);
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
    for (const f of frases(limpar(texto))) {
      const u = new SpeechSynthesisUtterance(f);
      u.lang = 'pt-BR';
      if (vozBR) u.voice = vozBR;
      u.rate = velocidade;
      sintese.speak(u);
    }
  }

  // Pergunta + opções: "Qual é a cor? Azul. Vermelho. Verde."
  function textoPergunta(enunciado, opcoes) {
    return enunciado + ' ' + (opcoes || []).map(o => String(o) + '.').join(' ');
  }

  LB.voz = {
    falar, textoPergunta, limpar, frases, nota, listar, usar, aoMudarLista: null,
    vozEscolhida: () => (vozBR ? vozBR.name : null),
    parar: () => { if (sintese) sintese.cancel(); },
    disponivel: !!sintese,
    mudarVelocidade: v => { velocidade = v; }
  };
})();
