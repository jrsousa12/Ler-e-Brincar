// Regras da varredura (Motor 9). Cada grupo recebe { rel, texto, existe } e devolve uma lista
// de { linha, codigo }. Os nomes dos códigos, explicados para o dono, ficam em build/fichas/varrer.json.
'use strict';
const path = require('path');
const { limpar, linhaDe } = require('./varrer-limpar');

const ext = (rel) => path.extname(rel);
const ehApp = (rel) => rel.startsWith('js/') || rel === 'sw.js'; // código que roda no aparelho

// Procura um padrão no texto todo e devolve uma marcação por ocorrência.
function procurar(texto, re, codigo) {
  const lista = [];
  for (const m of texto.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))) {
    lista.push({ linha: linhaDe(texto, m.index + (m[0].length - m[0].trimStart().length)), codigo });
  }
  return lista;
}

// 1. Espaços e formato (os únicos que --corrigir arruma).
function espacos({ texto }) {
  const lista = [];
  if (texto.includes('\r\n')) lista.push({ linha: linhaDe(texto, texto.indexOf('\r\n')), codigo: 'quebra_windows' });
  if (texto.length && !texto.endsWith('\n')) lista.push({ linha: linhaDe(texto, texto.length), codigo: 'sem_quebra_final' });
  const linhas = texto.replace(/\r\n/g, '\n').split('\n');
  let brancas = 0;
  linhas.forEach((l, i) => {
    if (/[ \t]+$/.test(l) && l.trim()) lista.push({ linha: i + 1, codigo: 'espaco_no_fim' });
    if (/^\s*\t/.test(l) && l.trim()) lista.push({ linha: i + 1, codigo: 'tabulacao' });
    brancas = l.trim() ? 0 : brancas + 1;
    if (brancas === 3 && i < linhas.length - 1) lista.push({ linha: i + 1, codigo: 'linhas_em_branco' });
  });
  return lista;
}

// Arruma só os espaços: tira espaço no fim, troca tabulação do começo por 2 espaços,
// deixa no máximo 2 linhas em branco seguidas e põe a quebra de linha final.
function corrigirEspacos(texto) {
  let t = texto.replace(/\r\n/g, '\n');
  t = t.split('\n').map((l) => {
    const sem = l.replace(/[ \t]+$/, '');
    return sem.replace(/^[ \t]+/, (ini) => ini.replace(/\t/g, '  '));
  }).join('\n');
  t = t.replace(/\n{4,}/g, '\n\n\n').replace(/\n*$/, '\n');
  return t === '\n' ? '' : t;
}

// 2. Sintaxe de JSON e CSS (o JS já é conferido pela etapa "sintaxe" do tudo.js).
function sintaxe({ rel, texto }) {
  if (ext(rel) === '.json') {
    try { JSON.parse(texto); return []; } catch (e) {
      const pos = Number((/position (\d+)/.exec(e.message) || [])[1] || 0);
      return [{ linha: linhaDe(texto, pos), codigo: 'json_invalido' }];
    }
  }
  if (ext(rel) === '.css') {
    const t = limpar(texto);
    let nivel = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '{') nivel++;
      if (t[i] === '}' && --nivel < 0) return [{ linha: linhaDe(t, i), codigo: 'css_chaves' }];
    }
    if (nivel > 0) return [{ linha: linhaDe(t, t.lastIndexOf('{')), codigo: 'css_chaves' }];
  }
  return [];
}

// Caminhos de arquivos citados no código (import, require, src/href no HTML).
// Em .js, ignora o que estiver dentro de comentário.
function citados(rel, texto) {
  const lista = [];
  const semComentario = ext(rel) === '.js' ? limpar(texto, { textos: true }) : texto;
  const res = ext(rel) === '.html'
    ? [/\b(?:src|href)="([^"#?]+)"/g]
    : [/\bimport\s[^'"]*?from\s*['"]([^'"]+)['"]/g, /\bimport\s*\(\s*['"]([^'"]+)['"]/g, /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g];
  for (const re of res) {
    for (const m of semComentario.matchAll(re)) {
      const alvo = m[1];
      const local = ext(rel) === '.html' ? !/^[a-z]+:|^\/\//i.test(alvo) : alvo.startsWith('.');
      if (local) lista.push({ alvo, pos: m.index });
    }
  }
  return lista;
}

// 3. Possíveis erros (só em .js).
function erros({ rel, texto, existe }) {
  const lista = [];
  if (ext(rel) === '.js' || ext(rel) === '.html') {
    for (const { alvo, pos } of citados(rel, texto)) {
      const caminho = path.posix.normalize(path.posix.join(path.posix.dirname(rel), alvo));
      if (![caminho, caminho + '.js', caminho + '/index.js'].some(existe)) lista.push({ linha: linhaDe(texto, pos), codigo: 'arquivo_inexistente' });
    }
  }
  if (ext(rel) !== '.js') return lista;
  const codigo = limpar(texto);
  const comComentarios = limpar(texto, { comentarios: true });
  lista.push(...procurar(codigo, /[^=!<>]={2}(?!=)(?!\s*null\b)|!=(?!=)(?!\s*null\b)/, 'igualdade_fraca'));
  lista.push(...procurar(codigo, /\b(?:if|while)\s*\((?:[^()]|\([^()]*\))*?[^=!<>+\-*/%&|^]=(?![=>])/, 'atribuicao_no_if'));
  lista.push(...procurar(comComentarios, /\bcatch\s*(?:\([^)]*\))?\s*\{\s*\}/, 'catch_vazio'));
  if (ehApp(rel)) {
    lista.push(...procurar(codigo, /\bconsole\.log\s*\(|\bdebugger\b/, 'console_esquecido'));
    lista.push(...procurar(codigo, /(?:^|[^.\w$])(?:window\.)?(?:confirm|alert|prompt)\s*\((?![^)]*\)\s*\{)/, 'confirm_alert'));
  }
  const vistos = new Map();
  for (const m of codigo.matchAll(/\bfunction\s+([\w$]+)\s*\(/g)) {
    if (vistos.has(m[1])) lista.push({ linha: linhaDe(codigo, m.index), codigo: 'funcao_repetida' });
    else vistos.set(m[1], true);
  }
  return lista;
}

// 4. Segurança.
const SEGREDO = /(?:api[_-]?key|secret|token|senha|password)["']?\s*[:=]\s*["'][A-Za-z0-9_\-+/=.]{12,}["']|\bghp_[A-Za-z0-9]{20,}|\bsk-[A-Za-z0-9]{20,}|\bAKIA[A-Z0-9]{16}\b/i;
function seguranca({ rel, texto }) {
  const lista = [];
  if (ext(rel) === '.js') lista.push(...procurar(limpar(texto), /\beval\s*\(|\bnew\s+Function\s*\(|\bset(?:Timeout|Interval)\s*\(\s*["'`]/, 'codigo_dinamico'));
  if (ext(rel) === '.js' || ext(rel) === '.html') {
    const fonte = ext(rel) === '.js' ? limpar(texto, { textos: true }) : texto; // sem comentários
    lista.push(...procurar(fonte, /\.(?:innerHTML|outerHTML)\s*\+?=(?!=)|\binsertAdjacentHTML\s*\(|\bv-html=/, 'html_cru'));
    lista.push(...procurar(fonte, /\bdocument\.write(?:ln)?\s*\(/, 'document_write'));
    lista.push(...procurar(fonte, /target=["']_blank["'](?![^>]*\brel=)/, 'blank_sem_rel'));
  }
  lista.push(...procurar(texto, /http:\/\/(?!localhost|127\.0\.0\.1|www\.w3\.org)[\w.-]+/, 'http_inseguro'));
  if (rel === 'index.html' || rel.startsWith('js/')) {
    lista.push(...procurar(texto, /<(?:script|link)\b[^>]*\b(?:src|href)=["'](?:https?:)?\/\//, 'arquivo_de_fora'));
  }
  lista.push(...procurar(texto, SEGREDO, 'segredo'));
  return lista;
}

const GRUPOS = { espacos, sintaxe, erros, seguranca };

// Roda todas as regras num arquivo e devolve a lista ordenada por linha.
function analisar(rel, texto, existe = () => true) {
  return Object.entries(GRUPOS)
    .flatMap(([grupo, f]) => f({ rel, texto, existe }).map((a) => ({ ...a, grupo })))
    .sort((a, b) => a.linha - b.linha);
}

module.exports = { analisar, corrigirEspacos, GRUPOS };
