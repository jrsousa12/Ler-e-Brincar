// Motor 9, parte 2: sobras do código. Diferente de varrer-regras.js (um arquivo por vez),
// aqui se olha o projeto inteiro, porque o app liga os arquivos pelo objeto LB, sem import.
// Acha: função que ninguém chama, variável que ninguém lê e classe de CSS que nenhuma tela usa.
// É um palpite pelo nome: se o nome aparece uma vez só em todo o código, sobrou.
'use strict';
const { limpar } = require('./varrer-limpar');

// Conta quantas vezes cada palavra (letras, números, _ e $) aparece em todos os textos juntos.
function contarPalavras(textos, padrao = /[A-Za-z_$][\w$]*/g) {
  const conta = new Map();
  for (const t of textos) for (const p of t.match(padrao) || []) conta.set(p, (conta.get(p) || 0) + 1);
  return conta;
}

const linhaDe = (texto, pos) => texto.slice(0, pos).split('\n').length;

// Nomes criados em "const a = ", "let { b, c: d = 1 } = ", "function e(".
function nomesCriados(codigo) {
  const achados = [];
  for (const m of codigo.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) achados.push({ nome: m[1], pos: m.index, tipo: 'funcao_sem_uso' });
  for (const m of codigo.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*|\{[^}=]*\})\s*=/g)) {
    const partes = m[1].startsWith('{') ? m[1].slice(1, -1).split(',') : [m[1]];
    for (const p of partes) {
      const nome = p.split(':').pop().trim();
      if (/^[A-Za-z_$][\w$]*$/.test(nome)) achados.push({ nome, pos: m.index, tipo: 'variavel_sem_uso' });
    }
  }
  return achados;
}

// Classes de CSS: ".nome" nos seletores (o texto antes de cada "{", fora das regras @).
function classesDoCss(texto) {
  const limpo = texto.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const achados = [];
  for (const s of limpo.matchAll(/([^{};]*)\{/g)) {
    if (s[1].trim().startsWith('@')) continue;
    for (const m of s[1].matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) achados.push({ nome: m[1], pos: s.index + m.index });
  }
  return achados;
}

// arquivos: [{ rel, texto }] do código; extras: textos onde classes também podem aparecer (conteúdo).
function sobras(arquivos, extras = []) {
  const js = arquivos.filter((a) => /\.(js|html)$/.test(a.rel));
  const palavras = contarPalavras(js.map((a) => limpar(a.texto)).concat(js.map((a) => a.texto)));
  const avisos = [];
  for (const a of js.filter((x) => x.rel.endsWith('.js'))) {
    const codigo = limpar(a.texto);
    // O caminho de um require ('./escrever') não é uso do nome escrever.
    const doArquivo = contarPalavras([codigo, a.texto.replace(/require\((['"])[^'"]*\1\)/g, 'require()')]);
    for (const n of nomesCriados(codigo)) {
      // Cada nome conta duas vezes (código limpo + texto original); 2 = só a própria criação.
      // Variável: conta só no arquivo (nomes como "ok" se repetem em outros). Função: no projeto todo.
      const vezes = (n.tipo === 'variavel_sem_uso' ? doArquivo : palavras).get(n.nome) || 0;
      if (vezes <= 2 && !n.nome.startsWith('_')) {
        avisos.push({ rel: a.rel, linha: linhaDe(a.texto, n.pos), codigo: n.tipo, nome: n.nome });
      }
    }
  }
  const textos = js.map((a) => a.texto).concat(extras);
  const usos = contarPalavras(textos, /-?[A-Za-z_][\w-]*/g);
  const montadas = prefixosMontados(textos);
  const css = arquivos.filter((x) => x.rel.endsWith('.css'));
  for (const a of css) {
    const vistas = new Set();
    for (const c of classesDoCss(a.texto)) {
      if (vistas.has(c.nome) || usos.get(c.nome) || montadas.some((p) => c.nome.startsWith(p))) continue;
      vistas.add(c.nome);
      avisos.push({ rel: a.rel, linha: linhaDe(a.texto, c.pos), codigo: 'classe_sem_uso', nome: c.nome });
    }
  }
  // Animação (@keyframes nome) que nenhum "animation" chama: o nome aparece uma vez só.
  const nomesCss = contarPalavras(css.map((a) => a.texto).concat(textos), /-?[A-Za-z_][\w-]*/g);
  for (const a of css) {
    for (const m of a.texto.matchAll(/@keyframes\s+([\w-]+)/g)) {
      if (nomesCss.get(m[1]) === 1) avisos.push({ rel: a.rel, linha: linhaDe(a.texto, m.index), codigo: 'animacao_sem_uso', nome: m[1] });
    }
  }
  return avisos;
}

// Começos de classe montadas na hora: :class="'v' + valor" ou class="tema-${x}" (então "v5" e
// "tema-azul" contam como usadas). Só dentro de class="", :class="", classList.x() e className =.
function prefixosMontados(textos) {
  const achados = new Set();
  for (const t of textos) {
    for (const c of t.matchAll(/:?class="([^"]*)"|classList\.\w+\(([^)]*)\)|className\s*=\s*([^;\n]*)/g)) {
      const trecho = c[1] || c[2] || c[3] || '';
      for (const m of trecho.matchAll(/['`]([A-Za-z_][\w-]*)['`]\s*\+/g)) achados.add(m[1]);
      for (const m of trecho.matchAll(/(?:^|[\s'`])([A-Za-z_][\w-]*)\$\{/g)) achados.add(m[1]);
    }
  }
  return [...achados];
}

module.exports = { sobras, nomesCriados, classesDoCss, prefixosMontados };
