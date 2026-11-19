// Escreve um item no estilo de conteudo/*.js: {chave:'texto',...} numa linha só (usado por gerar-mat e item)
'use strict';
const esc = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
function escrever(v) {
  if (Array.isArray(v)) return '[' + v.map(escrever).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => k + ':' + escrever(x)).join(',') + '}';
  if (typeof v === 'number' || typeof v === 'boolean' || v === null) return String(v);
  return esc(v);
}
module.exports = escrever;
