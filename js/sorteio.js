// Sorteio das opções: a cada vez que uma pergunta aparece, a ordem dos botões muda,
// para a criança não decorar "a certa é a do meio". O conteúdo em conteudo/ não muda.
// Devolve uma CÓPIA da pergunta com `opcoes` embaralhadas e `correta` ajustada
// (só quando `correta` é a posição; quando é o valor/texto, continua igual).
(function (raiz) {
  'use strict';

  function embaralhar(lista, aleatorio) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sortearOpcoes(q, aleatorio) {
    if (!q || !Array.isArray(q.opcoes)) return q;
    const certa = raiz.LB.respostas.indiceCorreto(q);
    const ordem = embaralhar(q.opcoes.map((_, i) => i), aleatorio || Math.random);
    const nova = Object.assign({}, q, { opcoes: ordem.map(i => q.opcoes[i]) });
    if (typeof q.correta === 'number' && q.tipo !== 'operacao') nova.correta = ordem.indexOf(certa);
    return nova;
  }

  raiz.LB = raiz.LB || {};
  raiz.LB.sortearOpcoes = sortearOpcoes;
})(typeof window !== 'undefined' ? window : globalThis);
