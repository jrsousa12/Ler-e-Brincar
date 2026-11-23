// Brincadeira "Memória": achar os pares figura + palavra escrita (palavras de conteudo/silabas.js).
LB.usarMemoria = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const PARES = 4;
  const cartasMemoria = ref([]);
  const paresMemoria = ref(0);
  let viradas = [];
  let travado = false;
  const somLigado = () => ctx.ajustes.value.som !== false;
  const memoriaCompleta = computed(() => paresMemoria.value === PARES);

  function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // Cada par: uma carta com a figura e outra com a palavra escrita (treina a leitura).
  function montarCartas() {
    const palavras = embaralhar(LB.silabas || []).filter(p => p.nivel <= 2).slice(0, PARES);
    const cartas = palavras.flatMap(p => [
      { uid: p.id + '-f', par: p.id, tipo: 'figura', emoji: p.emoji, palavra: p.palavra, virada: false, achada: false },
      { uid: p.id + '-p', par: p.id, tipo: 'palavra', emoji: p.emoji, palavra: p.palavra, virada: false, achada: false }
    ]);
    cartasMemoria.value = embaralhar(cartas);
    paresMemoria.value = 0;
    viradas = [];
    travado = false;
  }

  function abrirMemoria() {
    montarCartas();
    ctx.tela.value = 'memoria';
    ctx.falarSozinho('Ache os pares: a figura e a palavra.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function virarCarta(carta) {
    if (travado || carta.virada || carta.achada) return;
    carta.virada = true;
    LB.voz.falar(carta.palavra);
    viradas.push(carta);
    if (viradas.length < 2) return;
    const [a, b] = viradas;
    viradas = [];
    if (a.par === b.par) {
      a.achada = b.achada = true;
      paresMemoria.value += 1;
      ctx.estrelas.value += 1;
      LB.festa.acerto(somLigado());
    } else {
      travado = true;
      setTimeout(() => { a.virada = b.virada = false; travado = false; }, 900);
    }
  }

  function concluirMemoria() {
    ctx.marcarConcluido('memoria');
    ctx.terminarItem('atividades');
  }

  return { cartasMemoria, paresMemoria, memoriaCompleta, totalParesMemoria: PARES, abrirMemoria, virarCarta, embaralharMemoria: montarCartas, concluirMemoria };
};
