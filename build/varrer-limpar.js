// Ajudante da varredura (Motor 9): apaga o miolo de textos e comentários de um código JS,
// mantendo o tamanho e as quebras de linha. Assim as regras de "possível erro" não se enganam
// com um "==" escrito dentro de uma frase. Expressões regulares (/.../) também são apagadas.
'use strict';

// Antes de uma barra "/", estes sinais indicam que ela abre uma expressão regular (não é divisão).
const ANTES_DE_REGEX = new Set(['', '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^']);
const PALAVRAS_ANTES_DE_REGEX = /(?:^|[^\w$])(return|typeof|case|do|else|in|of|void|yield|await)$/;

const vazio = (c) => (c === '\n' ? '\n' : ' ');

// comentarios=true: mantém os comentários. textos=true: mantém o miolo dos textos e das regex
// (útil para achar coisas escritas dentro de um molde HTML, mas fora dos comentários).
function limpar(texto, { comentarios = false, textos = false } = {}) {
  let saida = '';
  let i = 0;
  let ultimo = ''; // último caractere de código que não é espaço
  const n = texto.length;
  while (i < n) {
    const c = texto[i];
    const d = texto[i + 1];
    if (c === '/' && d === '/') { // comentário de linha
      const fim = texto.indexOf('\n', i);
      const ate = fim === -1 ? n : fim;
      saida += comentarios ? texto.slice(i, ate) : ' '.repeat(ate - i);
      i = ate;
      continue;
    }
    if (c === '/' && d === '*') { // comentário de bloco
      const fim = texto.indexOf('*/', i + 2);
      const ate = fim === -1 ? n : fim + 2;
      const trecho = texto.slice(i, ate);
      saida += comentarios ? trecho : trecho.replace(/[^\n]/g, ' ');
      i = ate;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { // texto: guarda as aspas, apaga o miolo
      let j = i + 1;
      while (j < n && texto[j] !== c) {
        if (texto[j] === '\\') j++;
        else if (c !== '`' && texto[j] === '\n') break; // aspas sem fechar: para na linha
        j++;
      }
      const miolo = texto.slice(i + 1, j);
      saida += c + (textos ? miolo : miolo.replace(/[^\n]/g, vazio)) + (texto[j] === c ? c : '');
      i = texto[j] === c ? j + 1 : j;
      ultimo = c;
      continue;
    }
    if (c === '/' && (ANTES_DE_REGEX.has(ultimo) || PALAVRAS_ANTES_DE_REGEX.test(saida.trimEnd()))) {
      let j = i + 1;
      let classe = false;
      while (j < n && texto[j] !== '\n' && (classe || texto[j] !== '/')) {
        if (texto[j] === '\\') j++;
        else if (texto[j] === '[') classe = true;
        else if (texto[j] === ']') classe = false;
        j++;
      }
      if (texto[j] === '/') { // achou o fim: é regex
        saida += textos ? texto.slice(i, j + 1) : '/' + ' '.repeat(j - i - 1) + '/';
        i = j + 1;
        ultimo = '/x';
        continue;
      }
    }
    saida += c;
    if (!/\s/.test(c)) ultimo = c;
    i++;
  }
  return saida;
}

// Número da linha (começando em 1) de uma posição do texto.
function linhaDe(texto, pos) {
  let n = 1;
  for (let i = 0; i < pos; i++) if (texto.charCodeAt(i) === 10) n++;
  return n;
}

module.exports = { limpar, linhaDe };
