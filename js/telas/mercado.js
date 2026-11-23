// Brincadeira "Mercadinho": pagar o preço com moedas e notas, ou calcular o troco (regras em js/mercadoregras.js).
LB.usarMercado = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const comprasMercado = ref([]);
  const indiceMercado = ref(0);
  const bandejaMercado = ref([]);   // dinheiro já posto para pagar (nível 1)
  const etapaMercado = ref(0);      // pergunta atual (níveis 2 e 3)
  const escolhaMercado = ref(null);
  const mensagemMercado = ref('');
  const estadoMercado = ref('');    // '', 'correto', 'tentar-novamente'
  const compraMercado = computed(() => comprasMercado.value[indiceMercado.value]);
  const somaBandeja = computed(() => bandejaMercado.value.reduce((s, d) => s + d.valor, 0));
  const perguntaMercado = computed(() => compraMercado.value && compraMercado.value.etapas ? compraMercado.value.etapas[etapaMercado.value] : null);
  const somLigado = () => ctx.ajustes.value.som !== false;
  const reais = v => 'R$ ' + v;
  const dinheiroDe = valor => LB.mercado.dinheiro.find(d => d.valor === valor);

  function frase(compra) {
    const lista = compra.produtos.map(p => p.nome + ' por ' + p.preco + ' reais').join(' e ');
    if (compra.tipo === 'montar') return 'Compre ' + lista + '. Pague certinho!';
    return 'Compre ' + lista + '. Você paga com uma nota de ' + compra.pago + ' reais.';
  }

  function carregarCompra() {
    bandejaMercado.value = [];
    etapaMercado.value = 0;
    escolhaMercado.value = null;
    mensagemMercado.value = '';
    estadoMercado.value = '';
    ctx.falarSozinho(frase(compraMercado.value));
  }

  function abrirMercado() {
    comprasMercado.value = LB.mercadoRegras.sortearRodada();
    indiceMercado.value = 0;
    carregarCompra();
    ctx.tela.value = 'mercado';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function acertoMercado(texto, fala) {
    estadoMercado.value = 'correto';
    mensagemMercado.value = texto;
    LB.festa.acerto(somLigado());
    LB.voz.falar(fala);
  }

  // Nível 1: cada toque põe uma moeda ou nota na bandeja; ao chegar no preço, confere (também ao tirar).
  function conferirBandeja() {
    estadoMercado.value = '';
    mensagemMercado.value = '';
    const soma = somaBandeja.value, total = compraMercado.value.total;
    if (soma === total) {
      ctx.estrelas.value += 1;
      acertoMercado('Pagou certinho: ' + reais(total) + '! ⭐', 'Muito bem! Pagou certinho!');
    } else if (soma > total) {
      estadoMercado.value = 'tentar-novamente';
      mensagemMercado.value = 'Passou! Você pôs ' + reais(soma) + '. Toque numa nota ou moeda da bandeja para tirar.';
      LB.festa.erro(somLigado());
    }
  }

  function porDinheiro(valor) {
    if (estadoMercado.value === 'correto') return;
    bandejaMercado.value.push({ valor, id: Date.now() + '-' + Math.random() });
    conferirBandeja();
  }

  function tirarDinheiro(id) {
    if (estadoMercado.value === 'correto') return;
    bandejaMercado.value = bandejaMercado.value.filter(d => d.id !== id);
    conferirBandeja();
  }

  // Níveis 2 e 3: escolher a resposta de cada pergunta (total, troco).
  function escolherMercado(valor) {
    if (estadoMercado.value === 'correto') return;
    escolhaMercado.value = valor;
    const q = perguntaMercado.value, ultima = etapaMercado.value === compraMercado.value.etapas.length - 1;
    if (valor !== q.certa) {
      estadoMercado.value = 'tentar-novamente';
      mensagemMercado.value = 'Não foi ' + reais(valor) + '. Pense de novo e tente outra!';
      LB.festa.erro(somLigado());
      return;
    }
    if (ultima) {
      ctx.estrelas.value += 1;
      acertoMercado('Acertou! O troco é ' + reais(q.certa) + '! ⭐', 'Muito bem! O troco é ' + q.certa + ' reais!');
    } else {
      acertoMercado('Isso! Tudo junto dá ' + reais(q.certa) + '.', 'Isso! Dá ' + q.certa + ' reais.');
    }
  }

  function seguirMercado() {
    const compra = compraMercado.value;
    if (compra.etapas && etapaMercado.value < compra.etapas.length - 1) {
      etapaMercado.value += 1;
      escolhaMercado.value = null; mensagemMercado.value = ''; estadoMercado.value = '';
    } else if (indiceMercado.value < comprasMercado.value.length - 1) {
      indiceMercado.value += 1;
      carregarCompra();
    }
  }

  const ultimaDoMercado = computed(() => {
    const c = compraMercado.value;
    return !!c && indiceMercado.value === comprasMercado.value.length - 1 && (!c.etapas || etapaMercado.value === c.etapas.length - 1);
  });

  function concluirMercado() {
    ctx.marcarConcluido('mercado');
    ctx.terminarItem('atividades');
  }

  return {
    comprasMercado, indiceMercado, bandejaMercado, somaBandeja, etapaMercado, escolhaMercado, mensagemMercado, estadoMercado,
    compraMercado, perguntaMercado, ultimaDoMercado, dinheiroDe,
    abrirMercado, porDinheiro, tirarDinheiro, escolherMercado, seguirMercado, concluirMercado
  };
};
