// Telas "Ler" e "História": leitura e as perguntas de cada história.
LB.usarHistorias = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const historiaAtual = ref(null);
  const mostrandoPerguntas = ref(false);
  const indicePergunta = ref(0);
  const fraseAtiva = ref(-1); // frase que a voz está lendo (número contado desde o título)

  // Texto dividido em frases; g = número da frase na leitura da história inteira (o título é a 1ª).
  const partes = computed(() => {
    const h = historiaAtual.value;
    if (!h) return [];
    let g = LB.voz.frases(LB.voz.limpar(h.titulo + '.')).length;
    return h.texto.map(linha => LB.voz.frases(linha).map(t => ({ t, g: g++ })));
  });
  const progressoPerguntas = computed(() => {
    const h = historiaAtual.value;
    return h ? Math.round(100 * (indicePergunta.value + (rh.terminou ? 1 : 0)) / h.perguntas.length) : 0;
  });
  const marcar = base => i => { fraseAtiva.value = i < 0 ? -1 : base + i; };
  const ouvirHistoria = () => {
    const h = historiaAtual.value;
    LB.voz.falar(h.titulo + '. ' + h.texto.join(' '), marcar(0));
  };
  const ouvirLinha = i => {
    const p = partes.value[i];
    LB.voz.falar(historiaAtual.value.texto[i], marcar(p.length ? p[0].g : 0));
  };

  // Cada pergunta aparece com os botões sorteados (ver js/sorteio.js).
  const perguntaAtual = computed(() =>
    historiaAtual.value ? LB.sortearOpcoes(historiaAtual.value.perguntas[indicePergunta.value]) : null);

  const rh = LB.criarResposta(ctx, () => ({
    item: perguntaAtual.value,
    id: historiaAtual.value.id + '-p' + (indicePergunta.value + 1),
    materia: 'leitura',
    habilidade: (historiaAtual.value.habilidadesBNCC || [])[0] || 'leitura',
    titulo: historiaAtual.value.titulo
  }));

  const lerPergunta = () => {
    const p = perguntaAtual.value;
    if (p) ctx.falarSozinho(LB.voz.textoPergunta(p.enunciado, p.opcoes));
  };

  function abrirHistoria(h) {
    historiaAtual.value = h;
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
    fraseAtiva.value = -1;
    rh.zerar();
    ctx.tela.value = 'historia';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function iniciarPerguntasHistoria() {
    fraseAtiva.value = -1;
    mostrandoPerguntas.value = true;
    indicePergunta.value = 0;
    rh.zerar();
    lerPergunta();
  }

  function proximaPergunta() {
    if (indicePergunta.value + 1 < historiaAtual.value.perguntas.length) {
      indicePergunta.value++;
      rh.zerar();
      lerPergunta();
    } else {
      ctx.marcarConcluido(historiaAtual.value.id);
      ctx.terminarItem('ler');
    }
  }

  function zerar() {
    fraseAtiva.value = -1;
    mostrandoPerguntas.value = false;
    indicePergunta.value = 0;
    rh.zerar();
  }

  return {
    historiaAtual, mostrandoPerguntas, indicePergunta, perguntaAtual, rh,
    fraseAtiva, partes, progressoPerguntas, ouvirHistoria, ouvirLinha,
    abrirHistoria, iniciarPerguntasHistoria, proximaPergunta, zerar
  };
};
