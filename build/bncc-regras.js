// Regras da BNCC: diz qual habilidade combina com cada item (ficha build/fichas/bncc.json).
// Usado pelo motor build/bncc.js, pelo validador e pelos geradores.
'use strict';
const ficha = require('./fichas/bncc.json');

const area = item => (item.materia === 'matematica' || /^mat-/.test(item.id || '')) ? 'mat' : 'lp';
const pergunta = e => String(e || '').replace(/^\s*Leia:\s*"[^"]*"\s*/, '');

function trecho(item, onde) {
  const t = { titulo: item.titulo, enunciado: item.enunciado, explicacao: item.explicacao, pergunta: pergunta(item.enunciado) }[onde];
  if (onde === 'tudo') return [item.titulo, item.enunciado, item.explicacao, JSON.stringify(item.apoioVisual || '')].join(' ');
  return String(t || '');
}

// Devolve { bncc, regra } ou null (nenhuma regra casou).
function propor(item) {
  for (const r of ficha.regras[area(item)]) {
    if (r.se_titulo && !new RegExp(r.se_titulo, 'i').test(item.titulo || '')) continue;
    if (r.se_tipo && item.tipo !== r.se_tipo) continue;
    const t = trecho(item, r.onde);
    if (r.nao && new RegExp(r.nao, 'i').test(t)) continue;
    if (new RegExp(r.padrao, 'i').test(t)) return { bncc: r.bncc, regra: r.nome };
  }
  return null;
}

// Código certo para um item de LP/Mat: regra > troca fixa > o que já tem.
function certo(item) {
  const p = propor(item);
  if (p) return p;
  const novo = ficha.trocar[item.habilidadeBNCC];
  return novo ? { bncc: novo, regra: 'troca fixa' } : { bncc: item.habilidadeBNCC, regra: 'sem regra' };
}

const trocarLista = lista => [...new Set((lista || []).map(c => ficha.trocar[c] || c))];
const valido = (codigo, ar) => !!ficha.oficial[codigo] && codigo.slice(4, 6) === (ar === 'mat' ? 'MA' : 'LP');
const texto = codigo => ficha.oficial[codigo] || '';

module.exports = { propor, certo, trocarLista, valido, texto, area };
