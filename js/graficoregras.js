// Regras da brincadeira "Gráfico de barras" (EF02MA22): monta gráficos de figuras e calcula o certo. Sem tela: só contas (testadas em testes/t_grafico.js).
// Níveis: 1 qual tem mais? · 2 quantos? (contar a barra) · 3 quantos a mais? (diferença entre duas barras).
// Rodada de 5: um gráfico com 3 perguntas (níveis 1, 2, 3) e outro com 2 (níveis 2 e 3).
// Desafio: { nivel, enunciado, fala, certa, opcoes (3, com a certa), grafico { titulo, barras [{ e, nome, g, valor, cor }] }, dica, explicacao }.
LB.graficoRegras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  // Três opções: a certa e as duas primeiras erradas da lista (erros comuns primeiro).
  function opcoes(certa, erradas) {
    const erros = [];
    erradas.forEach(v => { if (erros.length < 2 && v !== certa && !erros.includes(v)) erros.push(v); });
    return embaralhar([certa, ...erros]);
  }

  // g: 'f' (as maçãs) ou 'm' (os gatos), para dizer "quantas" ou "quantos".
  const TEMAS = [
    { titulo: 'Frutas da feira', itens: [{ e: '🍎', nome: 'maçãs', g: 'f' }, { e: '🍌', nome: 'bananas', g: 'f' }, { e: '🍇', nome: 'uvas', g: 'f' }, { e: '🍓', nome: 'morangos', g: 'm' }] },
    { titulo: 'Bichos da casa', itens: [{ e: '🐶', nome: 'cachorros', g: 'm' }, { e: '🐱', nome: 'gatos', g: 'm' }, { e: '🐰', nome: 'coelhos', g: 'm' }, { e: '🐟', nome: 'peixes', g: 'm' }] },
    { titulo: 'Brinquedos da sala', itens: [{ e: '⚽', nome: 'bolas', g: 'f' }, { e: '🧸', nome: 'ursos', g: 'm' }, { e: '🚗', nome: 'carrinhos', g: 'm' }, { e: '🪁', nome: 'pipas', g: 'f' }] },
    { titulo: 'Flores do jardim', itens: [{ e: '🌹', nome: 'rosas', g: 'f' }, { e: '🌻', nome: 'girassóis', g: 'm' }, { e: '🌷', nome: 'tulipas', g: 'f' }, { e: '🌼', nome: 'margaridas', g: 'f' }] }
  ];
  const CORES = ['#ef5350', '#42a5f5', '#66bb6a', '#ffca28'];

  // Gráfico novo: 3 barras de alturas diferentes (de 1 a 8), para a mais alta ser só uma.
  function novoGrafico() {
    const tema = unico(TEMAS), itens = embaralhar(tema.itens).slice(0, 3);
    const valores = embaralhar([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
    return { titulo: tema.titulo, barras: itens.map((it, i) => ({ ...it, valor: valores[i], cor: CORES[i] })) };
  }

  const quantos = b => (b.g === 'f' ? 'Quantas ' : 'Quantos ') + b.nome;
  const rotulo = b => b.e + ' ' + b.nome;
  const ordenadas = g => [...g.barras].sort((x, y) => y.valor - x.valor);

  // Nível 1: qual barra é a mais alta.
  function qualTemMais(g) {
    const [maior] = ordenadas(g);
    return { nivel: 1, grafico: g, certa: rotulo(maior), opcoes: embaralhar(g.barras.map(rotulo)),
      enunciado: 'Qual tem mais?', fala: 'Olhe o gráfico. Qual tem mais?',
      dica: 'A barra mais alta é a que tem mais.', explicacao: 'A barra de ' + maior.nome + ' é a mais alta: tem mais!' };
  }

  // Nível 2: contar as figuras de uma barra.
  function quantosTem(g) {
    const b = unico(g.barras);
    return { nivel: 2, grafico: g, certa: b.valor,
      opcoes: opcoes(b.valor, [b.valor + 1, b.valor - 1, b.valor + 2, b.valor - 2].filter(v => v > 0)),
      enunciado: quantos(b) + '?', fala: quantos(b) + '? Conte as figuras da barra.',
      dica: 'Conte as figuras da barra, uma por uma.', explicacao: 'A barra tem ' + b.valor + ' ' + b.nome + '.' };
  }

  // Nível 3: quanto a mais (maior menos menor; as erradas são os erros típicos: o número de uma barra, soma, um a mais ou a menos).
  function quantoAMais(g) {
    const [maior, , menor] = ordenadas(g), d = maior.valor - menor.valor;
    const q = (maior.g === 'f' ? 'Quantas ' : 'Quantos ') + maior.nome + ' a mais que ' + menor.nome + '?';
    return { nivel: 3, grafico: g, certa: d,
      opcoes: opcoes(d, [maior.valor, d + 1, d - 1, menor.valor, maior.valor + menor.valor].filter(v => v > 0)),
      enunciado: q, fala: q + ' Veja quanto uma barra passa da outra.',
      dica: 'Veja quantas figuras a barra maior tem além da menor.',
      explicacao: maior.valor + ' − ' + menor.valor + ' = ' + d + '. Tem ' + d + ' ' + maior.nome + ' a mais.' };
  }

  const PERGUNTAS = [null, qualTemMais, quantosTem, quantoAMais];
  const desafio = (nivel, g) => PERGUNTAS[nivel](g || novoGrafico());

  // Rodada de 5 desafios, do fácil ao difícil: o primeiro gráfico com 3 perguntas, o segundo com 2.
  function sortearRodada() {
    const a = novoGrafico(), b = novoGrafico();
    return [desafio(1, a), desafio(2, a), desafio(3, a), desafio(2, b), desafio(3, b)];
  }

  return { sortearRodada, desafio, opcoes };
})();
