// Teste guardado: motor de figuras da Matemática (build/figuras-mat.js). Uso: node testes/t_figuras_mat.js
// Trabalha numa CÓPIA do conteúdo (CONTEUDO_RAIZ); o conteudo/ real não é tocado.
'use strict';
const path = require('path');
const copia = require('./_gerador');
const { automatico } = require(path.join(__dirname, '../build/figuras-mat.js'));
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Automático pelo enunciado
ok(JSON.stringify(automatico('Quanto é 3 + 2?', '🍎')) === JSON.stringify({ esquerda: '🍎🍎🍎', operador: '+', direita: '🍎🍎' }), 'soma: figuras dos dois lados');
ok(automatico('Quanto é 7 − 3?', '🍪').direita === '3', 'subtração: tira o número');
ok(automatico('Qual é o dobro de 4?', '🍩').esquerda === '🍩🍩🍩🍩 🍩🍩🍩🍩', 'dobro: 2 grupos');
ok(automatico('Qual número é maior?', '⭐') === null, 'sem conta: nada automático');

// 2. Na cópia: prévia não grava; --gravar grava; recusa item que já tem figuras
const c = copia('build/figuras-mat.js');
const LB = () => { const o = {}; new Function('LB', c.ler('mat.js'))(o); return o; };
const semFig = (LB().mat || []).find(a => !a.apoioVisual && /\d+ [+−] \d+/.test(a.enunciado));
const comFig = (LB().mat || []).find(a => a.apoioVisual);
ok(semFig, "há conta sem figuras para testar");
if (semFig) {
  const p = c.pedido(semFig.id + ' | 🍬');
  const antes = c.ler('mat.js');
  ok(c.rodar([p]).cod === 0 && c.ler('mat.js') === antes, 'prévia não muda o conteúdo');
  ok(c.rodar([p, '--gravar']).cod === 0, 'grava sem erro');
  ok(LB().mat.find(a => a.id === semFig.id).apoioVisual, 'item ganhou figuras');
  ok(c.validar().cod === 0, 'validador aprova depois de gravar');
  ok(c.rodar([p]).cod === 1, 'recusa item que já tem figuras');
}
if (comFig) ok(c.rodar([c.pedido(comFig.id + ' | 🍬')]).cod === 1, 'recusa item com figuras');
ok(c.rodar([c.pedido('mat-999 | 🍬')]).cod === 1, 'recusa id que não existe');
c.apagar();

console.log(falhas ? `t_figuras_mat: ${falhas} falha(s)` : 't_figuras_mat: tudo certo');
process.exit(falhas ? 1 : 0);
