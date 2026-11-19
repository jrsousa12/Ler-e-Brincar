// Teste guardado: contas da Evolução no tempo (js/evolucao.js).
// Uso: node testes/t_evolucao.js
'use strict';
const path = require('path');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
globalThis.LB = {};
require(path.join(__dirname, '..', 'js/evolucao.js'));
const E = LB.evolucao;

const hoje = new Date(2026, 10, 19, 12); // quinta, 19/11/2026 (semana começa 16/11)
const reg = (dia, materia, hab, acertou, tentativa = 1) =>
  ({ data: new Date(2026, 10, dia, 10).toISOString(), materia, habilidade: hab, acertou, tentativa });

const r = [];
for (let i = 0; i < 4; i++) r.push(reg(2, 'matematica', 'M1', i < 2));   // semana 2/11: 50% (2 de 4)
for (let i = 0; i < 5; i++) r.push(reg(17, 'matematica', 'M1', i < 4));  // semana atual: 80%
r.push(reg(18, 'matematica', 'M1', false, 2));                            // 2ª tentativa: não conta no acerto
r.push(reg(17, 'lingua-portuguesa', 'L1', true));

const s = E.semanas(r, hoje, 6);
ok(s.length === 6 && s[5].ultima && s[5].rotulo === '16/11', 'seis semanas; a última começa 16/11');
ok(s[3].rotulo === '2/11' && s[3].mat.matematica.taxa === 50 && s[3].mat.matematica.perguntas === 4, 'semana de 2/11: 50% de 4');
ok(s[5].mat.matematica.taxa === 80 && s[5].mat.matematica.perguntas === 5, '2ª tentativa não conta no acerto');
ok(s[5].dias === 2, 'dias de uso na semana atual: 17 e 18 = 2');
ok(s[4].mat.matematica.taxa === null && s[4].dias === 0, 'semana sem uso: taxa nula, não 0%');
ok(s[5].mat['lingua-portuguesa'].taxa === 100, 'Português separado de Matemática');
const res = E.resumo(s, 'matematica');
ok(res && res.de === 50 && res.para === 80, 'resumo de 50% para 80%');
ok(E.resumo(s, 'lingua-portuguesa') === null, 'só uma semana com respostas: sem resumo');

// Habilidades: antes (semanas 2/11 e 9/11) x agora (16/11 e 9/11...): usa 2 semanas recentes x 2 anteriores
const h = [];
for (let i = 0; i < 6; i++) h.push(reg(10, 'matematica', 'MELHOR', i < 5));   // recente (9/11): 83%
for (let i = 0; i < 6; i++) h.push(reg(3, 'matematica', 'MELHOR', i < 2));    // anterior (2/11): 33%
for (let i = 0; i < 6; i++) h.push(reg(17, 'matematica', 'PIOR', i < 2));     // recente: 33%
for (let i = 0; i < 6; i++) h.push(reg(4, 'matematica', 'PIOR', i < 5));      // anterior: 83%
for (let i = 0; i < 3; i++) h.push(reg(17, 'matematica', 'POUCA', true));     // poucas perguntas
for (let i = 0; i < 3; i++) h.push(reg(4, 'matematica', 'POUCA', false));
const m = E.habilidades(h, hoje);
ok(m.melhoraram.length === 1 && m.melhoraram[0].habilidade === 'MELHOR' && m.melhoraram[0].dif === 50, 'achou a que melhorou');
ok(m.pioraram.length === 1 && m.pioraram[0].habilidade === 'PIOR', 'achou a que piorou');
ok(![...m.melhoraram, ...m.pioraram].some(x => x.habilidade === 'POUCA'), 'poucas perguntas: ignorada');
ok(E.semanas([{ data: 'lixo', materia: 'matematica', tentativa: 1 }], hoje, 6).every(x => x.dias === 0), 'data inválida é ignorada');

console.log(falhas ? `t_evolucao: ${falhas} falha(s)` : 't_evolucao: OK');
process.exit(falhas ? 1 : 0);
