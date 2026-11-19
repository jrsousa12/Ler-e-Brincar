// Teste guardado: sorteio das opções (js/sorteio.js). Uso: node testes/t_sorteio.js
// Confere, em TODO o conteúdo real, que depois de sortear a resposta certa continua a mesma
// e que ela aparece nas três posições (não fica presa no meio).
'use strict';
const path = require('path');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; if (falhas <= 10) console.log('FALHA: ' + msg); } };

globalThis.LB = {};
for (const f of ['js/respostas.js', 'js/sorteio.js', 'conteudo/historias.js', 'conteudo/lp.js', 'conteudo/mat.js']) {
  require(path.join(raiz, f));
}
const { indiceCorreto } = LB.respostas;
const perguntas = [...LB.lp, ...LB.mat, ...LB.historias.flatMap(h => h.perguntas.map((p, i) => ({ ...p, id: h.id + '-p' + (i + 1) })))];

const posicoes = [0, 0, 0];
for (const q of perguntas) {
  const textoCerto = String(q.opcoes[indiceCorreto(q)]);
  const vistas = new Set();
  for (let n = 0; n < 30; n++) {
    const s = LB.sortearOpcoes(q);
    const i = indiceCorreto(s);
    ok(String(s.opcoes[i]) === textoCerto, q.id + ': resposta certa mudou depois do sorteio');
    ok(s.opcoes.length === q.opcoes.length && q.opcoes.every(o => s.opcoes.includes(o)), q.id + ': opções perdidas');
    vistas.add(i); posicoes[i]++;
  }
  ok(vistas.size > 1, q.id + ': a certa nunca mudou de lugar');
}
ok(perguntas[0].opcoes === LB.lp[0].opcoes, 'o conteúdo original não pode ser alterado');

// Sorteio "travado" (aleatório fixo) dá sempre a mesma ordem: útil para conferir
const fixo = () => 0;
const q = { tipo: 'multipla', opcoes: ['a', 'b', 'c'], correta: 1 };
const s = LB.sortearOpcoes(q, fixo);
ok(s.opcoes.join() === 'b,c,a' && s.correta === 0, 'sorteio fixo: esperado b,c,a com certa na posição 0');
ok(q.opcoes.join() === 'a,b,c' && q.correta === 1, 'a pergunta original não muda');

const total = posicoes.reduce((a, b) => a + b, 0);
const pct = posicoes.map(p => Math.round(100 * p / total) + '%').join(' / ');
console.log(falhas ? `t_sorteio: ${falhas} falha(s)` : `t_sorteio: OK (${perguntas.length} perguntas; certa em 1º/2º/3º: ${pct})`);
process.exit(falhas ? 1 : 0);
