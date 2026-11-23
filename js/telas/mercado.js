// Brincadeira "Mercadinho": pagar o preço com moedas e notas, ou calcular o troco (regras em js/mercadoregras.js).
// O vai e vem da rodada (estrela, Próximo, Concluir) fica no kit js/rodada.js.
LB.usarMercado = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const bandejaMercado = ref([]);   // dinheiro já posto para pagar (nível 1)
  const reais = v => LB.mercadoRegras.texto(v);          // "R$ 3,50"
  const falado = v => LB.mercadoRegras.fala(v);          // "3 reais e 50 centavos"

  function frase(compra) {
    const lista = compra.produtos.map(p => p.nome + ' por ' + falado(p.preco)).join(' e ');
    if (compra.tipo === 'montar') return 'Compre ' + lista + '. Pague certinho!';
    return 'Compre ' + lista + '. Você paga com uma nota de ' + falado(compra.pago) + '.';
  }

  const r = LB.rodada(ctx, {
    id: 'mercado',
    sortear: () => LB.mercadoRegras.sortearRodada(),
    etapas: c => c.etapas,           // nível 1 (montar) não tem etapas: uma pergunta só
    frase,
    aoCarregar: () => { bandejaMercado.value = []; },
    textos: {
      erro: valor => 'Não foi ' + reais(valor) + '. Pense de novo e tente outra!',
      acerto: (q, c, final) => final
        ? ['Acertou! O troco é ' + reais(q.certa) + '! ⭐', 'Muito bem! O troco é ' + falado(q.certa) + '!']
        : ['Isso! Tudo junto dá ' + reais(q.certa) + '.', 'Isso! Dá ' + falado(q.certa) + '.']
    }
  });

  const compraMercado = r.atual;
  const somaBandeja = computed(() => bandejaMercado.value.reduce((s, d) => s + d.valor, 0));
  const perguntaMercado = computed(() => compraMercado.value && compraMercado.value.etapas ? r.pergunta.value : null);
  // Classe da moeda/nota: tipo + cor do valor (0,5 vira "v0_5", pois o ponto não serve em classe).
  const classeDinheiro = valor => LB.mercado.dinheiro.find(d => d.valor === valor).tipo + ' v' + String(valor).replace('.', '_');
  const ouvirMercado = computed(() => {
    const c = compraMercado.value;
    if (!c) return '';
    return c.tipo === 'montar' ? 'Pague ' + falado(c.total) : 'Troco de uma nota de ' + falado(c.pago);
  });

  // Nível 1: cada toque põe uma moeda ou nota na bandeja; ao chegar no preço, confere (também ao tirar).
  function conferirBandeja() {
    r.limpar();
    const soma = somaBandeja.value, total = compraMercado.value.total;
    if (soma === total) r.acertou('Pagou certinho: ' + reais(total) + '! ⭐', 'Muito bem! Pagou certinho!');
    else if (soma > total) r.errou('Passou! Você pôs ' + reais(soma) + '. Toque numa nota ou moeda da bandeja para tirar.');
  }

  function porDinheiro(valor) {
    if (r.estado.value === 'correto') return;
    bandejaMercado.value.push({ valor, id: Date.now() + '-' + Math.random() });
    conferirBandeja();
  }

  function tirarDinheiro(id) {
    if (r.estado.value === 'correto') return;
    bandejaMercado.value = bandejaMercado.value.filter(d => d.id !== id);
    conferirBandeja();
  }

  return {
    ...r.exportar('Mercado'), perguntaMercado, comprasMercado: r.lista, compraMercado, ultimaDoMercado: r.ultimo,
    bandejaMercado, somaBandeja, classeDinheiro, ouvirMercado, reaisMercado: reais, porDinheiro, tirarDinheiro
  };
};
