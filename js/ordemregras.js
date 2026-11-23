// Regras da brincadeira "Ordem dos Fatos": sorteia as sequências e monta as perguntas. Sem tela (testado em testes/t_ordem.js).
// Cada sequência (conteudo/ordem.js) tem 3 fatos na ordem certa. Pergunta 1: qual veio primeiro? (3 opções).
// Pergunta 2: e depois? (as 2 que sobraram). O 3º fato entra sozinho.
LB.ordemRegras = (function () {
  'use strict';
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  const PERGUNTAS = ['O que aconteceu primeiro?', 'E o que aconteceu depois?'];

  function desafio(item) {
    const [a, b, c] = item.frases;
    return {
      id: item.id, titulo: item.titulo, enunciado: item.enunciado, frases: item.frases,
      fala: item.titulo + '. ' + item.enunciado,
      etapas: [
        { certa: a, opcoes: embaralhar([a, b, c]), pedido: PERGUNTAS[0] },
        { certa: b, opcoes: embaralhar([b, c]), pedido: PERGUNTAS[1] }
      ]
    };
  }

  // Rodada de 5 sequências diferentes, sorteadas do conteúdo.
  const sortearRodada = (itens = LB.ordem) => embaralhar(itens).slice(0, 5).map(desafio);

  return { sortearRodada, desafio, embaralhar };
})();
