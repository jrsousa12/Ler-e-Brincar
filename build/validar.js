// Validador do conteúdo. Uso: node build/validar.js
// Confere todos os arquivos de conteudo/ e lista só os erros (saída curta).
// Regras: original-deepseek/script-gerador-conteudo.md (seções 4 e 5).
'use strict';
const LB = require('./carregar')();
const { indiceCorreto } = LB.respostas;

// Códigos válidos e regras: build/fichas/bncc.json (motor build/bncc.js corrige)
const BNCC = require('./bncc-regras');
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
  h.habilidadesBNCC.forEach(c => BNCC.valido(c, 'lp') || erro(h.id, 'BNCC inválida ' + c));
  if (BNCC.trocarLista(h.habilidadesBNCC).join() !== h.habilidadesBNCC.join()) erro(h.id, 'BNCC não combina (rode node build/bncc.js)');
  h.perguntas.forEach((p, j) => checaQuestao(h.id + '#' + (j + 1), p));
}
for (const [lista, pref, materia, bncc] of [[LB.lp, 'lp', 'lingua-portuguesa', 'lp'], [LB.mat, 'mat', 'matematica', 'mat']]) {
  for (const a of lista) {
    checaId(a, pref, 3);
    if (a.materia !== materia) erro(a.id, 'matéria errada: ' + a.materia);
    if (!BNCC.valido(a.habilidadeBNCC, bncc)) erro(a.id, 'BNCC inválida ' + a.habilidadeBNCC);
    else if (BNCC.certo(a).bncc !== a.habilidadeBNCC) erro(a.id, `BNCC não combina: ${a.habilidadeBNCC} → ${BNCC.certo(a).bncc} (rode node build/bncc.js)`);
    if (![1, 2, 3].includes(a.nivel)) erro(a.id, 'nível inválido ' + a.nivel);
    checaQuestao(a.id, a);
  }
}
for (const c of LB.colorir) {
  checaId(c, 'colorir', 2);
  if (!c.svg.includes('viewBox="0 0 300 300"')) erro(c.id, 'SVG sem viewBox 0 0 300 300');
  if (/<text/.test(c.svg)) erro(c.id, 'SVG com texto');
}
const palavras = new Set();
for (const s of LB.silabas) {
  checaId(s, 'sil', 3);
  if ((s.silabas || []).join('') !== s.palavra) erro(s.id, 'sílabas não formam a palavra ' + s.palavra);
  if (!(s.silabas || []).length || s.silabas.length < 2) erro(s.id, 'precisa de 2 sílabas ou mais');
  if (!(s.extras || []).length || s.extras.some(e => s.silabas.includes(e))) erro(s.id, 'sílabas extras faltando ou iguais às certas');
  if (!s.emoji || !s.dica) erro(s.id, 'sem emoji ou dica');
  if (s.dica && s.dica.toUpperCase().includes(s.palavra)) erro(s.id, 'a dica entrega a palavra');
  if (![1, 2, 3].includes(s.nivel)) erro(s.id, 'nível inválido ' + s.nivel);
  if (palavras.has(s.palavra)) erro(s.id, 'palavra repetida ' + s.palavra);
  palavras.add(s.palavra);
}

// Ordem dos Fatos (conteudo/ordem.js): fora do carregar.js, lido aqui se existir.
const arqOrdem = require('path').join(process.env.CONTEUDO_RAIZ || require('path').join(__dirname, '..', 'conteudo'), 'ordem.js');
const ORDEM = require('fs').existsSync(arqOrdem) ? (new Function('window', 'LB', require('fs').readFileSync(arqOrdem, 'utf8') + ';return LB.ordem')({}, {})) : [];
const titulosOrdem = new Set();
for (const s of ORDEM) {
  checaId(s, 'ord', 2);
  if (!s.titulo || !s.enunciado) erro(s.id, 'sem título ou enunciado');
  if (!Array.isArray(s.frases) || s.frases.length !== 3 || new Set(s.frases).size !== 3) erro(s.id, 'precisa de 3 frases diferentes');
  if (titulosOrdem.has(s.titulo)) erro(s.id, 'título repetido ' + s.titulo);
  titulosOrdem.add(s.titulo);
}

const total = LB.historias.length + LB.lp.length + LB.mat.length + LB.colorir.length + LB.silabas.length;
console.log(`Conteúdo: ${LB.historias.length} histórias, ${LB.lp.length} LP, ${LB.mat.length} Mat, ${LB.colorir.length} colorir, ${LB.silabas.length} sílabas, ${ORDEM.length} ordem (${total + ORDEM.length} itens)`);
if (erros.length) {
  console.log(`ERROS (${erros.length}):\n  ` + erros.slice(0, 30).join('\n  '));
  process.exit(1);
}
console.log('OK: nenhum erro');
