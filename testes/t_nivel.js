// Teste guardado: nível que se ajusta sozinho por habilidade (js/nivel.js), ligado ao caderno e à missão.
// Uso: node testes/t_nivel.js
'use strict';
const path = require('path');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

globalThis.LB = {};
LB.CONTEUDO = { activities: [
  { id: 'a1', habilidadeBNCC: 'H', nivel: 1 }, { id: 'a2', habilidadeBNCC: 'H', nivel: 2 },
  { id: 'a3', habilidadeBNCC: 'H', nivel: 3 }, { id: 'b1', habilidadeBNCC: 'S', nivel: 3 },
  { id: 'c1', habilidadeBNCC: 'P', nivel: 1 }, { id: 'c3', habilidadeBNCC: 'P', nivel: 3 }
] };
for (const f of ['js/nomeshab.js', 'js/nivel.js', 'js/caderno.js']) require(path.join(raiz, f));
const N = LB.nivel;
const seq = (niv, h, lista) => lista.reduce((n, c) => N.registrar(n, h, c), niv);

// 1. Começo, limites e faixa
ok(N.de({}, 'H') === 1 && N.de({}, 'S') === 3, 'começa no menor nível que existe');
ok(N.de({}, 'X') === null && Object.keys(N.registrar({}, 'X', true)).length === 0, 'habilidade sem atividades não tem nível');
// 2. Subir com 4 de 5
let n = seq({}, 'H', [true, true, true]);
ok(N.de(n, 'H') === 1, '3 acertos: ainda não sobe');
n = seq(n, 'H', [true]);
ok(N.de(n, 'H') === 2 && n.H.u === '', '4 acertos: sobe e zera as últimas');
n = seq(n, 'H', [true, false, true, true, true]);
ok(N.de(n, 'H') === 3, '4 de 5 (com 1 erro no meio): sobe');
ok(N.subiu({ H: { n: 2, u: '' } }, n, 'H') && !N.subiu(n, n, 'H'), 'subiu() percebe a subida');
n = seq(n, 'H', [true, true, true, true, true]);
ok(N.de(n, 'H') === 3, 'no maior nível não passa dele');
// 3. Descer com 2 erros seguidos
n = seq(n, 'H', [false]);
ok(N.de(n, 'H') === 3, '1 erro: fica');
n = seq(n, 'H', [false]);
ok(N.de(n, 'H') === 2, '2 erros seguidos: desce');
ok(N.de(seq({}, 'H', [false, false, false]), 'H') === 1, 'no menor nível não desce mais');
ok(N.de(seq({}, 'H', [false, true, false, true]), 'H') === 1, 'erros alternados: fica');
// 4. Níveis que pulam (1 e 3): sobe direto para o próximo que existe
ok(N.de(seq({}, 'P', [true, true, true, true]), 'P') === 3, 'pula o nível que não existe');
ok(N.de({ H: { n: 7, u: '' } }, 'H') === 1, 'nível guardado que não existe mais volta ao menor');
// 5. Caderno guarda o nível (itens e brincadeiras)
let c = LB.caderno.vazio();
for (let i = 0; i < 4; i++) c = LB.caderno.anotar(c, { id: 'a1', materia: 'm', habilidadeBNCC: 'H' }, true, '2026-11-28');
ok(N.de(c.niv, 'H') === 2, 'caderno.anotar ajusta o nível');
c = LB.caderno.anotarHabilidade(LB.caderno.anotarHabilidade(c, 'H', false), 'H', false);
ok(N.de(c.niv, 'H') === 1, 'caderno.anotarHabilidade ajusta o nível');
ok(LB.caderno.anotar({ itens: {}, hab: {} }, { id: 'a1', materia: 'm', habilidadeBNCC: 'H' }, true, 'x').niv.H, 'caderno antigo (sem niv) passa a ter nível');
// 6. Painel do adulto
const p = N.painel({ H: { n: 2, u: 'CE' } })[0];
ok(p.nivel === 2 && p.menor === 1 && p.maior === 3 && p.ultimas === '✔ ✘', 'painel mostra nível, faixa e últimas');
ok(LB.nomeHabilidade('EF03LP03') !== 'EF03LP03' && LB.nomeHabilidade('ZZ') === 'ZZ', 'nome curto da habilidade');

console.log(falhas ? 't_nivel: ' + falhas + ' FALHA(S)' : 't_nivel: OK');
process.exit(falhas ? 1 : 0);
