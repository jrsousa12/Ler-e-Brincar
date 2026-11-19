// Regra única de "resposta certa", usada pelo app e pelo validador (build/validar.js).
// Formato do campo `correta` (ver original-deepseek/script-gerador-conteudo.md):
//  - tipo 'operacao' (Matemática): é o VALOR certo (ex.: opcoes [9,10,11], correta 10)
//  - tipo 'completar' ou correta em texto: é o TEXTO da opção certa
//  - 'multipla' / 'inferencia' com número: é a POSIÇÃO da opção (0, 1 ou 2)
(function (raiz) {
  'use strict';

  function indiceCorreto(q) {
    if (q.tipo === 'operacao' || typeof q.correta === 'string') {
      return q.opcoes.findIndex(op => String(op) === String(q.correta));
    }
    return q.correta;
  }

  function ehCorreta(q, i) {
    return i === indiceCorreto(q);
  }

  raiz.LB = raiz.LB || {};
  raiz.LB.respostas = { indiceCorreto, ehCorreta };
})(typeof window !== 'undefined' ? window : globalThis);
