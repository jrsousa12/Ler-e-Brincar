// Brincadeira "Memória": achar os pares figura + palavra escrita (palavras de conteudo/silabas.js).
// Abrir, embaralhar de novo e Concluir vêm do kit js/rodada.js; aqui a rodada é um tabuleiro só,
// e cada par achado vale 1 estrela.
LB.usarMemoria = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const PARES = 4;
  const embaralhar = LB.rodada.embaralhar;
  const paresMemoria = ref(0);
  let viradas = [];
  let travado = false;
  const somLigado = () => ctx.ajustes.value.som !== false;

  // Cada par: uma carta com a figura e outra com a palavra escrita (treina a leitura).
  function montarTabuleiro() {
    const palavras = embaralhar(LB.silabas || []).filter(p => p.nivel <= 2).slice(0, PARES);
    if (!palavras.length) return [];
    const cartas = palavras.flatMap(p => [
      { uid: p.id + '-f', par: p.id, tipo: 'figura', emoji: p.emoji, palavra: p.palavra, virada: false, achada: false },
      { uid: p.id + '-p', par: p.id, tipo: 'palavra', emoji: p.emoji, palavra: p.palavra, virada: false, achada: false }
    ]);
    return [embaralhar(cartas)];
  }

  const r = LB.rodada(ctx, {
    id: 'memoria',
    sortear: montarTabuleiro,
    frase: () => 'Ache os pares: a figura e a palavra.',
    aoCarregar: () => { paresMemoria.value = 0; viradas = []; travado = false; }
  });

  const cartasMemoria = computed(() => r.atual.value || []);
  const memoriaCompleta = computed(() => paresMemoria.value === PARES);

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

  return {
    cartasMemoria, paresMemoria, memoriaCompleta, totalParesMemoria: PARES,
    abrirMemoria: r.abrir, virarCarta, embaralharMemoria: r.abrir, concluirMemoria: r.concluir
  };
};
