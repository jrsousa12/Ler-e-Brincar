// Regras do estilo dos desenhos de colorir (usadas por build/colorir.js). Só lê o texto do SVG; não abre navegador.
// erros = não grava; avisos = grava, mas vale olhar a prévia.
'use strict';
const PINTAVEIS = /<(path|circle|ellipse|rect|polygon)\b[^>]*>/g;
const MINIMO_PARTES = 8;

function conferir(svg) {
  const erros = [], avisos = [];
  if (typeof svg !== 'string' || !svg.startsWith('<svg')) return { erros: ['não é um SVG'], avisos, partes: 0 };
  if (!svg.includes('viewBox="0 0 300 300"')) erros.push('falta viewBox="0 0 300 300"');
  if (/<text\b/.test(svg)) erros.push('tem texto (<text>): a criança não lê no desenho');
  if (/<(script|image|foreignObject)\b|\son\w+=/.test(svg)) erros.push('tem script, imagem ou evento: só formas');
  if (/<(line|polyline)\b/.test(svg)) erros.push('tem <line>/<polyline>: o toque pinta o traço; usar solto() do kit');
  const formas = svg.match(PINTAVEIS) || [];
  const abertas = formas.filter(t => /fill="none"/.test(t) && !/class="solto"/.test(t)).length;
  if (abertas) erros.push(abertas + ' forma(s) com fill="none" sem class="solto": o toque enche por dentro; usar solto()');
  const partes = formas.filter(t => !/class="solto"/.test(t)).length;
  if (partes < MINIMO_PARTES) avisos.push('só ' + partes + ' parte(s) para pintar (mínimo ' + MINIMO_PARTES + ')');
  const duras = formas.filter(t => /stroke="black"/.test(t) && !/stroke-linejoin="round"/.test(t)).length;
  if (duras) avisos.push(duras + ' forma(s) sem cantos arredondados (usar f() do kit build/desenho.js)');
  return { erros, avisos, partes };
}

module.exports = { conferir, MINIMO_PARTES };
