// Teste guardado: caderno de erros e pontos fracos (js/caderno.js) + escolha da missão (js/missao.js).
// Uso: node testes/t_caderno.js
'use strict';
const path = require('path');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

globalThis.LB = {};
for (const f of ['js/caderno.js', 'conteudo/historias.js', 'conteudo/lp.js', 'conteudo/mat.js', 'conteudo/colorir.js', 'js/missao.js']) {
  require(path.join(raiz, f));
}
const K = LB.caderno;
const a = { id: 'lp-001', materia: 'lingua-portuguesa', habilidadeBNCC: 'H1' };

// 1. Regra de entrar e sair
let c = K.anotar(K.vazio(), a, false, '2026-11-19');
ok(K.total(c) === 1 && c.itens['lp-001'].seguidos === 0, 'errou: entra no caderno');
c = K.anotar(c, a, true, '2026-11-20');
ok(K.total(c) === 1 && c.itens['lp-001'].seguidos === 1, '1 acerto: continua');
// Brincadeiras: só pesam a habilidade, sem criar item no caderno
const cb = K.anotarHabilidade(K.anotarHabilidade(K.vazio(), 'H9', false), 'H9', true);
ok(cb.hab.H9.certas === 1 && cb.hab.H9.erradas === 1 && Object.keys(cb.itens).length === 0, 'anotarHabilidade: soma na habilidade e não cria item');
ok(Object.keys(K.anotarHabilidade(K.vazio(), '', false).hab).length === 0, 'anotarHabilidade sem habilidade não anota');
const c2 = K.anotar(c, a, false, '2026-11-21');
ok(c2.itens['lp-001'].seguidos === 0 && c2.itens['lp-001'].desde === '2026-11-19', 'errou de novo: zera seguidos, mantém a data');
c = K.anotar(c, a, true, '2026-11-21');
ok(K.total(c) === 0, '2 acertos seguidos: sai do caderno');
ok(K.anotar(K.vazio(), a, true, 'x').itens['lp-001'] === undefined, 'acerto de primeira fora do caderno: não entra');

// 2. Peso das habilidades
let h = K.vazio();
for (let i = 0; i < 6; i++) h = K.anotar(h, { ...a, id: 'x' + i }, false, 'd');
ok(K.peso(h, 'H1') > 3.5 && K.peso(h, 'H9') === 1, 'habilidade que erra sempre pesa mais');
ok(c.hab.H1.certas === 2 && c.hab.H1.erradas === 1, 'conta certas/erradas de primeira');

// 3. Missão: revisão entra e habilidade fraca é puxada
const vue = { computed: f => ({ get value() { return f(); } }) };
globalThis.Vue = vue;
LB.CONTEUDO = { stories: LB.historias, activities: [...LB.lp, ...LB.mat], colorir: LB.colorir };
const ref = v => ({ value: v });
function criar(caderno) {
  const ctx = { concluidos: ref({}), caderno: ref(caderno), missao: ref(null), diasMissao: ref([]) };
  const m = LB.usarMissao(ctx);
  return { ctx, m };
}
const lpAlvo = LB.lp[LB.lp.length - 1];
let cad = K.anotar(K.vazio(), lpAlvo, false, '2026-11-19');
const { ctx, m } = criar(cad);
m.garantir();
const passos = ctx.missao.value.passos;
ok(passos.length === 8, 'missão continua com 8 passos');
ok(passos.some(p => p.id === lpAlvo.id && p.revisao), 'atividade do caderno volta na missão como revisão');
ok(m.publico.passosMissao.value.some(p => p.rotulo === 'Revisão de Português'), 'rótulo de revisão');
ok(new Set(passos.map(p => p.id)).size === 8, 'sem passo repetido');

// Habilidade fraca: em 200 dias simulados, aparece mais que sem peso
const habs = [...new Set(LB.mat.map(x => x.habilidadeBNCC))];
const fraca = habs[0];
let pesada = K.vazio();
for (let i = 0; i < 10; i++) pesada = K.anotar(pesada, { id: 'f' + i, materia: 'z', habilidadeBNCC: fraca }, false, 'd');
pesada.itens = {};
// Simula 200 dias (troca a data de "hoje") e conta quantas vezes a habilidade fraca cai na missão.
const contar = cadx => {
  const Real = Date;
  let n = 0;
  for (let d = 1; d <= 200; d++) {
    const t = criar(cadx);
    globalThis.Date = class extends Real { constructor(...x) { super(...(x.length ? x : [Real.UTC(2026, 0, d, 12)])); } };
    t.m.garantir();
    globalThis.Date = Real;
    n += t.ctx.missao.value.passos.filter(p => p.tipo === 'mat' && LB.mat.find(x => x.id === p.id).habilidadeBNCC === fraca).length;
  }
  return n;
};
const semPeso = contar(K.vazio()), comPeso = contar(pesada);
ok(comPeso > semPeso, `habilidade fraca puxada (${comPeso} com peso × ${semPeso} sem)`);

console.log(falhas ? `t_caderno: ${falhas} falha(s)` : `t_caderno: OK (fraca na missão: ${comPeso} × ${semPeso} sem peso)`);
process.exit(falhas ? 1 : 0);
