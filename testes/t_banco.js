// Teste guardado: pedido de guarda permanente dos dados (js/banco.js, pedirGuarda).
// Uso: node testes/t_banco.js
'use strict';
const path = require('path');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

globalThis.LB = {};
require(path.join(__dirname, '..', 'js/banco.js'));
const pedir = LB.banco.pedirGuarda;

(async () => {
  let chamou = 0;
  ok(await pedir({}) === null, 'sem suporte devolve null');
  ok(await pedir({ storage: { persist: async () => { chamou++; return true; } } }) === true && chamou === 1, 'pede e recebe sim');
  ok(await pedir({ storage: { persist: async () => false } }) === false, 'pedido negado devolve false');
  chamou = 0;
  ok(await pedir({ storage: { persisted: async () => true, persist: async () => { chamou++; return true; } } }) === true && chamou === 0,
    'já garantido: não pede de novo');
  ok(await pedir({ storage: { persist: async () => { throw new Error('x'); } } }) === null, 'erro não quebra o app');
  console.log(falhas ? falhas + ' falha(s)' : 'OK t_banco');
  process.exit(falhas ? 1 : 0);
})();
