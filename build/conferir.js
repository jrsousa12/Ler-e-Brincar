// Conferidor de qualidade (motor 3). Uso: node build/conferir.js [--tipo codigo] [--todos] [--estrito]
// Diferente do validador: só AVISA o que pode atrapalhar a criança (não é erro). Saída curta.
// Limites, nomes e avisos aceitos: build/fichas/qualidade.json (calibrar ali).
'use strict';
const path = require('path');
const LB = require('./carregar')();
const ficha = require(process.env.FICHA_QUALIDADE || path.join(__dirname, 'fichas/qualidade.json'));
const L = ficha.limites;
const { indiceCorreto } = LB.respostas;
const args = process.argv.slice(2);
const soTipo = args.includes('--tipo') ? args[args.indexOf('--tipo') + 1] : null;

const avisos = [];
function avisa(id, codigo, detalhe) {
  const base = id.split('#')[0];
  if ((ficha.ignorar[base] || []).includes(codigo)) return;
  avisos.push({ id, codigo, detalhe });
}
const seg = new Intl.Segmenter('pt', { granularity: 'grapheme' });
const contaFiguras = s => [...seg.segment(String(s))].filter(g => /\p{Extended_Pictographic}/u.test(g.segment)).length;

function confereQuestao(id, q, eMat, nivel) {
  const o = q.opcoes || [], i = indiceCorreto(q);
  if (i < 0) return; // o validador já acusa
  const certa = String(o[i]);
  if (!eMat) {
    const outras = o.filter((_, j) => j !== i).map(x => String(x).length);
    const maior = Math.max(...outras);
    if (certa.length >= maior * L.certa_mais_longa_fator && certa.length - maior >= L.certa_mais_longa_letras)
      avisa(id, 'certa_mais_longa', `"${certa}" (${certa.length}) × outras até ${maior} letras`);
  }
  const lim = nivel === 1 ? L.enunciado_nivel1 : L.enunciado;
  if ((q.enunciado || '').length > lim) avisa(id, 'texto_longo', `enunciado com ${q.enunciado.length} letras (até ${lim})`);
  if ((q.explicacao || '').length > L.explicacao) avisa(id, 'texto_longo', `explicação com ${q.explicacao.length} letras (até ${L.explicacao})`);
  if (!eMat) return;
  const r = +certa;
  o.forEach(x => {
    if (+x < 0) avisa(id, 'opcao_negativa', String(x));
    else if (Math.abs(+x - r) > Math.max(L.distrator_distancia_minima, r)) avisa(id, 'distrator_facil', `${x} (certa ${r})`);
  });
  if (!new RegExp('(^|\\D)' + certa.replace('.', '\\.') + '(\\D|$)').test(q.explicacao || ''))
    avisa(id, 'explicacao_sem_resposta', `certa ${certa}`);
}

function confereFiguras(a) {
  const v = a.apoioVisual;
  if (!v) { if (a.nivel === 1) avisa(a.id, 'falta_figura', a.enunciado); return; }
  if (!['+', '−'].includes(v.operador)) return; // grupos (×2) e repartir: contagem é outra
  const nums = (a.enunciado.match(/\d+/g) || []).map(Number);
  [['esquerda', 0], ['direita', 1]].forEach(([lado, k]) => {
    const t = String(v[lado] || '');
    const n = /\d/.test(t) ? 0 : contaFiguras(t); // "✏️×12" já diz o número
    if (n && nums[k] !== undefined && n !== nums[k]) avisa(a.id, 'figura_nao_bate', `${lado}: ${n} figuras, conta diz ${nums[k]}`);
  });
}

const vistos = new Map();
function repetido(codigo, chave, id) {
  if (!chave) return;
  const k = codigo + '|' + chave;
  if (vistos.has(k)) avisa(id, codigo, `igual a ${vistos.get(k)}: ${chave}`);
  else vistos.set(k, id);
}
const normal = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

for (const h of LB.historias) {
  repetido('emoji_repetido', 'história ' + h.emoji, h.id);
  h.perguntas.forEach((p, j) => confereQuestao(h.id + '#' + (j + 1), p, false, h.nivel));
}
for (const a of LB.lp) { repetido('enunciado_repetido', normal(a.enunciado), a.id); confereQuestao(a.id, a, false, a.nivel); }
for (const a of LB.mat) { repetido('enunciado_repetido', normal(a.enunciado) + ' ' + JSON.stringify(a.apoioVisual || ''), a.id); confereQuestao(a.id, a, true, a.nivel); confereFiguras(a); }
for (const c of LB.colorir) {
  repetido('emoji_repetido', 'colorir ' + c.emoji, c.id);
  const partes = (c.svg.match(/<(path|circle|ellipse|rect|polygon)\b/g) || []).length;
  if (partes < L.desenho_partes_minimo) avisa(c.id, 'desenho_simples', `${partes} parte(s) (mínimo ${L.desenho_partes_minimo})`);
}

// Resumo: quantos de cada aviso + alguns exemplos (todos com --todos ou --tipo)
const lista = soTipo ? avisos.filter(a => a.codigo === soTipo) : avisos;
const porTipo = {};
lista.forEach(a => (porTipo[a.codigo] = porTipo[a.codigo] || []).push(a));
const quantos = args.includes('--todos') || soTipo ? Infinity : 3;
console.log(`Qualidade: ${lista.length} aviso(s)` + (soTipo ? ` do tipo ${soTipo}` : ''));
for (const [codigo, itens] of Object.entries(porTipo)) {
  console.log(`- ${codigo} (${itens.length}): ${ficha.nomes[codigo] || ''}`);
  itens.slice(0, quantos).forEach(a => console.log(`    ${a.id}: ${a.detalhe}`));
  if (itens.length > quantos) console.log(`    ... mais ${itens.length - quantos} (ver: --tipo ${codigo})`);
}
if (!lista.length) console.log('OK: nenhum aviso');
if (args.includes('--estrito') && lista.length) process.exit(1);
