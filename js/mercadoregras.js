// Regras do "Mercadinho": sorteia a compra e calcula o certo. Sem tela: só contas (testadas em testes/t_mercado.js).
// Nível 1: montar o preço com moedas e notas. Nível 2: calcular o troco. Nível 3: somar dois produtos e calcular o troco.
// Nível 4: centavos (só de 50): pagar certinho e calcular o troco.
LB.mercadoRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  const notaPara = (total, notas = [10, 20, 50]) => notas.find(n => n >= total + 1);
  // Valores em reais; centavos só de 50 (0,5), que somam sem erro de arredondamento.
  const texto = v => 'R$ ' + (Number.isInteger(v) ? v : v.toFixed(2).replace('.', ','));
  function fala(v) {
    const inteiro = Math.floor(v), centavos = Math.round((v - inteiro) * 100);
    if (!centavos) return inteiro + (inteiro === 1 ? ' real' : ' reais');
    if (!inteiro) return centavos + ' centavos';
    return inteiro + (inteiro === 1 ? ' real' : ' reais') + ' e ' + centavos + ' centavos';
  }

  function produto(max, ignorar) {
    const todos = LB.mercado.produtos.filter(p => p.min <= max && p.nome !== ignorar);
    const p = unico(todos);
    return { emoji: p.emoji, nome: p.nome, preco: sortearEntre(p.min, Math.min(p.max, max)) };
  }

  // Produto com preço "e 50 centavos" (ex.: R$ 3,50), entre R$ 1,50 e max.
  function produtoCentavos(max) {
    const p = produto(max);
    p.preco -= 0.5;
    return p;
  }

  // Três opções com o certo e dois erros comuns (quase certo; errou por 1; errou a "reserva").
  // Com centavos: um erro esquece os 50 centavos (número inteiro), o outro erra o real (também com ,50).
  function opcoes(certa, extraErro, passos = [1, -1, 2, -2, 3]) {
    const erros = new Set();
    [certa + passos[0], certa + passos[1], extraErro, ...passos.slice(2).map(d => certa + d)].forEach(v => {
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

  // Nível 4 (centavos): pagar certinho com moeda de 50 centavos, ou calcular o troco com nota de 5 ou 10.
  function nivel4Montar() {
    const p = produtoCentavos(10);
    return { nivel: 4, tipo: 'montar', produtos: [p], total: p.preco, carteira: [0.5, 1, 2, 5] };
  }

  function nivel4Troco() {
    const p = produtoCentavos(9);
    const pago = notaPara(p.preco, [5, 10]);
    const troco = pago - p.preco;
    return { nivel: 4, tipo: 'perguntas', produtos: [p], total: p.preco, pago, troco,
      etapas: [{ pergunta: 'Quanto de troco?', certa: troco, opcoes: opcoes(troco, undefined, [0.5, 1, -1, -0.5, 1.5]) }] };
  }

  // Rodada de 5 compras, do fácil ao difícil: níveis 1, 2 e 3, depois as duas de centavos (nível 4).
  function sortearRodada() {
    return [nivel1(), nivel2(), nivel3(), nivel4Montar(), nivel4Troco()];
  }

  return { sortearRodada, nivel1, nivel2, nivel3, nivel4Montar, nivel4Troco, notaPara, texto, fala };
})();
