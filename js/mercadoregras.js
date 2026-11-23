// Regras do "Mercadinho": sorteia a compra e calcula o certo. Sem tela: só contas (testadas em testes/t_mercado.js).
// Nível 1: montar o preço com moedas e notas. Nível 2: calcular o troco. Nível 3: somar dois produtos e calcular o troco.
LB.mercadoRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  const notaPara = total => [10, 20, 50].find(n => n >= total + 1);

  function produto(max, ignorar) {
    const todos = LB.mercado.produtos.filter(p => p.min <= max && p.nome !== ignorar);
    const p = unico(todos);
    return { emoji: p.emoji, nome: p.nome, preco: sortearEntre(p.min, Math.min(p.max, max)) };
  }

  // Três opções com o certo e dois erros comuns (quase certo; errou por 1; errou a "reserva").
  function opcoes(certa, extraErro) {
    const erros = new Set();
    [certa + 1, certa - 1, extraErro, certa + 2, certa - 2, certa + 3].forEach(v => {
      if (erros.size < 2 && v !== undefined && v > 0 && v !== certa) erros.add(v);
    });
    return embaralhar([certa, ...erros]);
  }

  function nivel1() {
    const p = produto(10);
    return { nivel: 1, tipo: 'montar', produtos: [p], total: p.preco, carteira: [1, 2, 5] };
  }

  function nivel2() {
    const p = produto(19);
    const pago = notaPara(p.preco);
    const troco = pago - p.preco;
    return { nivel: 2, tipo: 'perguntas', produtos: [p], total: p.preco, pago, troco,
      etapas: [{ pergunta: 'Quanto de troco?', certa: troco, opcoes: opcoes(troco, p.preco) }] };
  }

  function nivel3() {
    const a = produto(20), b = produto(20, a.nome);
    const total = a.preco + b.preco;
    const pago = notaPara(total);
    const troco = pago - total;
    return { nivel: 3, tipo: 'perguntas', produtos: [a, b], total, pago, troco, etapas: [
      { pergunta: 'Quanto custa tudo junto?', certa: total, opcoes: opcoes(total, total + 10) },
      { pergunta: 'Quanto de troco?', certa: troco, opcoes: opcoes(troco, a.preco) }
    ] };
  }

  // Rodada de 5 compras, do fácil ao difícil: 2 do nível 1, 2 do nível 2, 1 do nível 3.
  function sortearRodada() {
    return [nivel1(), nivel1(), nivel2(), nivel2(), nivel3()];
  }

  return { sortearRodada, nivel1, nivel2, nivel3, notaPara };
})();
