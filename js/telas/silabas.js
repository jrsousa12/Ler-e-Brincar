// Brincadeira "Monte a Palavra": tocar nas sílabas na ordem certa para formar a palavra da dica.
LB.usarSilabas = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;

  // Palavras: conteudo/silabas.js (gerado por build/gerar-silabas.js). Rodada de 5, mais fáceis primeiro.
  const POR_RODADA = 5;
  const palavrasSilabas = ref([]);

  const indiceSilabas = ref(0);
  const slotsSilabas = ref([]);
  const bancoSilabas = ref([]);
  const mensagemSilabas = ref('');
  const estadoSilabas = ref(''); // '', 'correto', 'tentar-novamente'
  const palavraSilabas = computed(() => palavrasSilabas.value[indiceSilabas.value]);
  const somLigado = () => ctx.ajustes.value.som !== false;

  function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function carregarPalavra() {
    const atual = palavraSilabas.value;
    slotsSilabas.value = Array(atual.silabas.length).fill(null);
    mensagemSilabas.value = '';
    estadoSilabas.value = '';
    bancoSilabas.value = embaralhar([
      ...atual.silabas.map((texto, i) => ({ id: 'certa-' + i + '-' + texto, texto })),
      ...atual.extras.map((texto, i) => ({ id: 'extra-' + i + '-' + texto, texto }))
    ]);
    ctx.falarSozinho(atual.dica);
  }

  // Sorteia a rodada: primeiro as palavras que ela ainda não acertou; depois ordena por nível.
  function sortearRodada() {
    const lista = embaralhar(LB.silabas || []);
    const feitas = ctx.concluidos.value;
    const novas = lista.filter(p => !feitas[p.id]), velhas = lista.filter(p => feitas[p.id]);
    return [...novas, ...velhas].slice(0, POR_RODADA).sort((a, b) => a.nivel - b.nivel);
  }

  function abrirSilabas() {
    palavrasSilabas.value = sortearRodada();
    if (!palavrasSilabas.value.length) return;
    indiceSilabas.value = 0;
    carregarPalavra();
    ctx.tela.value = 'silabas';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function encaixarSilaba(bloco) {
    if (estadoSilabas.value === 'correto') return;
    const vazio = slotsSilabas.value.findIndex(item => item === null);
    if (vazio === -1) return;
    slotsSilabas.value[vazio] = bloco;
    bancoSilabas.value = bancoSilabas.value.filter(b => b.id !== bloco.id);
    LB.voz.falar(bloco.texto);
    conferirPalavra();
  }

  function devolverSilaba(idx) {
    if (estadoSilabas.value === 'correto') return;
    const bloco = slotsSilabas.value[idx];
    if (!bloco) return;
    slotsSilabas.value[idx] = null;
    bancoSilabas.value.push(bloco);
    mensagemSilabas.value = '';
    estadoSilabas.value = '';
  }

  function conferirPalavra() {
    if (slotsSilabas.value.some(item => item === null)) return;
    const montada = slotsSilabas.value.map(b => b.texto).join('');
    const certa = palavraSilabas.value.palavra;
    if (montada === certa) {
      estadoSilabas.value = 'correto';
      mensagemSilabas.value = 'Muito bem! Você formou ' + certa + '! ⭐';
      ctx.estrelas.value += 1;
      ctx.marcarConcluido(palavraSilabas.value.id);
      LB.festa.acerto(somLigado());
      LB.voz.falar('Muito bem! ' + certa);
    } else {
      estadoSilabas.value = 'tentar-novamente';
      mensagemSilabas.value = 'Quase lá! Toque em uma sílaba para trocar e tentar de novo.';
      LB.festa.erro(somLigado());
    }
  }

  function proximaSilabas() {
    if (indiceSilabas.value < palavrasSilabas.value.length - 1) {
      indiceSilabas.value += 1;
      carregarPalavra();
    }
  }

  function concluirSilabas() {
    ctx.marcarConcluido('silabas');
    ctx.terminarItem('atividades');
  }

  return {
    palavrasSilabas, indiceSilabas, slotsSilabas, bancoSilabas, mensagemSilabas, estadoSilabas, palavraSilabas,
    abrirSilabas, encaixarSilaba, devolverSilaba, proximaSilabas, concluirSilabas
  };
};
