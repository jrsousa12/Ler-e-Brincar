// Validador do conteúdo. Uso: node build/validar.js
// Confere todos os arquivos de conteudo/ e lista só os erros (saída curta).
// Regras: original-deepseek/script-gerador-conteudo.md (seções 4 e 5).
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const RAIZ_CONTEUDO = process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');

globalThis.LB = {};
require(path.join(raiz, 'js/respostas.js'));
for (const f of ['historias', 'lp', 'mat', 'colorir']) {
  new Function('LB', fs.readFileSync(path.join(RAIZ_CONTEUDO, f + '.js'), 'utf8'))(LB);
}
const { indiceCorreto } = LB.respostas;

const BNCC_LP = ['EF02LP03', 'EF02LP07', 'EF02LP26', 'EF15LP03', 'EF15LP04'];
const BNCC_MAT = ['EF02MA05', 'EF02MA06', 'EF02MA07', 'EF02MA19', 'EF03MA03', 'EF03MA06'];
const erros = [];
const erro = (id, msg) => erros.push(id + ': ' + msg);
const ids = new Set();

function checaId(item, prefixo, digitos) {
  const re = new RegExp('^' + prefixo + '-\\d{' + digitos + '}$');
  if (!re.test(item.id)) erro(item.id, 'id fora do padrão ' + prefixo + '-' + '0'.repeat(digitos));
  if (ids.has(item.id)) erro(item.id, 'id repetido');
  ids.add(item.id);
}

function checaQuestao(id, q) {
  const o = q.opcoes || [];
  if (o.length !== 3) erro(id, o.length + ' opções (precisa de 3)');
  if (new Set(o.map(String)).size !== o.length) erro(id, 'opções repetidas');
  const i = indiceCorreto(q);
  if (!(i >= 0 && i < o.length)) erro(id, 'resposta certa não está nas opções: ' + JSON.stringify(q.correta));
  if (q.tipo === 'completar' && !q.enunciado.includes('___')) erro(id, 'completar sem ___');
  if (!q.explicacao) erro(id, 'sem explicação');
  if (/\d\s-\s\d/.test(q.enunciado + q.explicacao)) erro(id, 'use − (sinal de menos), não hífen');
  // Conta escrita no enunciado: confere o resultado
  const m = (q.enunciado || '').match(/(\d+)\s*([+−×÷])\s*(\d+)\?/);
  if (m && i >= 0) {
    const a = +m[1], b = +m[3];
    const r = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[m[2]];
    if (+o[i] !== r) erro(id, `conta ${m[1]} ${m[2]} ${m[3]} = ${r}, mas a certa é ${o[i]}`);
  }
}

for (const h of LB.historias) {
  checaId(h, 'historia', 2);
  if (h.texto.length < 5 || h.texto.length > 6) erro(h.id, h.texto.length + ' parágrafos (5 ou 6)');
  if (h.perguntas.length !== 3) erro(h.id, h.perguntas.length + ' perguntas (precisa de 3)');
  h.habilidadesBNCC.forEach(c => BNCC_LP.includes(c) || erro(h.id, 'BNCC inválida ' + c));
  h.perguntas.forEach((p, j) => checaQuestao(h.id + '#' + (j + 1), p));
}
for (const [lista, pref, materia, bncc] of [[LB.lp, 'lp', 'lingua-portuguesa', BNCC_LP], [LB.mat, 'mat', 'matematica', BNCC_MAT]]) {
  for (const a of lista) {
    checaId(a, pref, 3);
    if (a.materia !== materia) erro(a.id, 'matéria errada: ' + a.materia);
    if (!bncc.includes(a.habilidadeBNCC)) erro(a.id, 'BNCC inválida ' + a.habilidadeBNCC);
    if (![1, 2, 3].includes(a.nivel)) erro(a.id, 'nível inválido ' + a.nivel);
    checaQuestao(a.id, a);
  }
}
for (const c of LB.colorir) {
  checaId(c, 'colorir', 2);
  if (!c.svg.includes('viewBox="0 0 300 300"')) erro(c.id, 'SVG sem viewBox 0 0 300 300');
  if (/<text/.test(c.svg)) erro(c.id, 'SVG com texto');
}

const total = LB.historias.length + LB.lp.length + LB.mat.length + LB.colorir.length;
console.log(`Conteúdo: ${LB.historias.length} histórias, ${LB.lp.length} LP, ${LB.mat.length} Mat, ${LB.colorir.length} colorir (${total} itens)`);
if (erros.length) {
  console.log(`ERROS (${erros.length}):\n  ` + erros.slice(0, 30).join('\n  '));
  process.exit(1);
}
console.log('OK: nenhum erro');
