// Motor gerador da brincadeira "Ordem dos Fatos": uma linha de pedido → uma sequência de 3 fatos.
// Uso:
//   node build/gerar-ordem.js build/pedidos/ordem-<lote>.txt            → prévia (--ver mostra cada uma)
//   node build/gerar-ordem.js build/pedidos/ordem-<lote>.txt --gravar   → acrescenta no fim de conteudo/ordem.js
// Linha (fatos JÁ na ordem certa; o app sorteia a ordem dos botões):
//   Título | 1º fato | 2º fato | 3º fato | enunciado=Ordene o preparo do lanche:
// Sem enunciado=, usa o da ficha build/fichas/ordem.json. Ponto final é posto se faltar.
'use strict';
const fs = require('fs');
const path = require('path');
const { partir, rodar } = require('./pedido');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/ordem.json'), 'utf8'));

const contar = s => (s.match(/[\p{L}\d]+/gu) || []).length;
const fechar = s => (/[.!?]$/.test(s) ? s : s + '.');
const primeiraMaiuscula = s => s[0].toLocaleUpperCase('pt-BR') + s.slice(1);

// Uma linha → sequência (sem id); lança erro com o motivo
function montar(linha) {
  const { campos, extra } = partir(linha);
  const [titulo, ...resto] = campos;
  if (!titulo) throw new Error('falta o título');
  if (resto.length !== 3) throw new Error(resto.length + ' fato(s): precisa de exatamente 3 (Título | 1º | 2º | 3º)');
  const frases = resto.map(f => primeiraMaiuscula(fechar(f)));
  if (new Set(frases.map(f => f.toLowerCase())).size !== 3) throw new Error('fatos repetidos');
  const avisos = [];
  frases.forEach((f, i) => { if (contar(f) > ficha.palavras_por_fato) avisos.push((i + 1) + 'º fato com ' + contar(f) + ' palavras'); });
  const n = contar(titulo), { min, max } = ficha.titulo_palavras;
  if (n < min || n > max) avisos.push('título com ' + n + ' palavras');
  const enunciado = extra.enunciado ? fechar(extra.enunciado).replace(/\.$/, ':') : ficha.enunciado;
  return { titulo, enunciado, frases, _avisos: avisos };
}

const uso = 'Uso: node build/gerar-ordem.js <pedido.txt> [--gravar] [--ver]';
const principal = args => rodar({
  arquivo: 'ordem', chave: 'ordem', prefixo: 'ord', digitos: 2, montar, uso,
  repetido: q => q.titulo.toLowerCase(), grupo: () => 'sequências'
}, args);

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar };
