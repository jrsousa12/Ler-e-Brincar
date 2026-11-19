// Motor gerador de Matemática: de uma linha curta de pedido, monta a atividade completa
// (conta conferida, figuras, opções erradas tiradas de erros típicos e explicação).
// Uso:
//   node build/gerar-mat.js build/pedidos/mat-onda3.txt            → só mostra o resumo (não grava)
//   node build/gerar-mat.js build/pedidos/mat-onda3.txt --gravar   → acrescenta no fim de conteudo/mat.js
// Linha do pedido (campos separados por " | "; linhas com # são comentário):
//   conta | emoji | enunciado (opcional) | frase final da explicação (opcional) | chave=valor...
//   8 − 3 | 🍬 | Pedro tinha 8 balas e comeu 3. Quantas sobraram? | Sobraram 5 balas.
//   7 + 5 | 🐸
//   3 × 4 | 🍪 | titulo=Pacotes de biscoito | nivel=3 | bncc=EF03MA06
// Sem enunciado, vira "Quanto é 8 − 3?". Nível, BNCC e título saem sozinhos (ver build/fichas/mat.json).
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const pastaConteudo = process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/mat.json'), 'utf8'));

const CONTA = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
const ehDuasCasas = n => n >= 10 && n <= 99;
const casas = n => [Math.floor(n / 10), n % 10];

// Cada erro típico: devolve o número que a criança daria (ou null se não se aplica)
const ERROS = {
  um_a_mais: (a, b, r) => r + 1,
  um_a_menos: (a, b, r) => r - 1,
  dez_a_mais: (a, b, r) => (r >= 10 ? r + 10 : null),
  dez_a_menos: (a, b, r) => (r >= 20 ? r - 10 : null),
  trocou_por_soma: (a, b) => a + b,
  trocou_por_subtracao: (a, b) => a - b,
  esqueceu_vai_um: (a, b, r) => ((a % 10) + (b % 10) >= 10 ? r - 10 : null),
  subtraiu_ao_contrario: (a, b) => {
    if (!ehDuasCasas(a) || (a % 10) >= (b % 10)) return null;
    const [da, ua] = casas(a), [db, ub] = casas(b);
    return Math.abs(da - db) * 10 + Math.abs(ua - ub);
  },
  inverteu_algarismos: (a, b, r) => (ehDuasCasas(r) && r % 10 !== 0 ? (r % 10) * 10 + Math.floor(r / 10) : null),
  um_grupo_a_mais: (a, b) => (a + 1) * b,
  um_grupo_a_menos: (a, b) => (a - 1) * b
};

function erradas(op, a, b, r) {
  const lista = [];
  const aceita = v => v !== null && Number.isInteger(v) && v >= 0 && v !== r && !lista.includes(v);
  for (const nome of ficha.erros[op]) {
    if (!ERROS[nome]) throw new Error('erro "' + nome + '" da ficha não existe no motor');
    const v = ERROS[nome](a, b, r);
    if (aceita(v)) lista.push(v);
    if (lista.length === 2) return lista;
  }
  for (const v of [r + 2, r - 2, r + 3]) { if (aceita(v)) lista.push(v); if (lista.length === 2) break; }
  return lista;
}

const temPalavra = (texto, lista) => lista.some(p => texto.toLowerCase().includes(p.toLowerCase()));
const preencher = (modelo, v) => modelo.replace(/\{(\w+)\}/g, (_, k) => v[k]);
const repetir = (emoji, n) => Array(n).fill(emoji).join('');

function apoio(op, a, b, emoji) {
  if (op === '×') return a * b <= 30 ? { esquerda: Array(a).fill(repetir(emoji, b)).join(' '), operador: a + ' × ' + b, direita: '' } : null;
  if (op === '÷') return a <= 20 ? { esquerda: repetir(emoji, a), operador: '÷' + b, direita: '' } : null;
  if (a > 20 || b > 20) return { esquerda: String(a), operador: op, direita: String(b) };
  return { esquerda: repetir(emoji, a), operador: op, direita: op === '+' ? repetir(emoji, b) : String(b) };
}

// Uma linha de pedido → atividade (sem id). Lança erro com motivo claro se a conta não serve.
function montar(linha) {
  const partes = linha.split('|').map(s => s.trim());
  const extra = {};
  const campos = partes.filter(p => { const m = p.match(/^(\w+)=(.*)$/); if (m) extra[m[1]] = m[2].trim(); return !m; });
  const [conta, emoji, enunciadoDado, frase] = campos;
  const m = (conta || '').replace(/-/g, '−').replace(/[xX*]/g, '×').replace(/\//g, '÷').match(/^(\d+)\s*([+−×÷])\s*(\d+)$/);
  if (!m) throw new Error('conta não entendida: "' + conta + '" (use, por exemplo, 8 − 3)');
  if (!emoji) throw new Error('falta o emoji');
  const a = +m[1], op = m[2], b = +m[3], r = CONTA[op](a, b);
  if (r < 0) throw new Error(conta + ' dá negativo');
  if (!Number.isInteger(r)) throw new Error(conta + ' não é divisão exata');
  const enunciado = (enunciadoDado || 'Quanto é ' + a + ' ' + op + ' ' + b + '?').replace(/(\d) - (\d)/g, '$1 − $2');
  const problema = !!enunciadoDado;
  const dinheiro = temPalavra(enunciado, ficha.palavras_dinheiro);
  const multDiv = op === '×' || op === '÷';
  let bncc = multDiv ? (problema ? 'EF03MA06' : 'EF03MA03') : 'EF02MA05';
  if (!multDiv && problema) bncc = temPalavra(enunciado, ficha.palavras_juntar_retirar) ? 'EF02MA07' : 'EF02MA06';
  if (dinheiro) bncc = 'EF02MA19';
  const maior = Math.max(a, b, r);
  let nivel = maior <= 10 ? 1 : maior <= 20 ? 2 : 3;
  if (multDiv) nivel = Math.max(nivel, 2);
  const soma = op === '×' ? Array(a).fill(b).join(' + ') : '';
  const [ad, au] = casas(a), [bd, bu] = casas(b);
  const v = { a, b, r, soma, ad: ad * 10, au, bd: bd * 10, bu, sd: (ad + bd) * 10, su: au + bu, p: a - bd * 10 };
  const modelo = (b >= 10 && bu > 0 && ficha.explicacoes[op + 'dezenas']) || ficha.explicacoes[op];
  const explicacao = a + ' ' + op + ' ' + b + ' = ' + r + '. ' + (frase || preencher(modelo, v));
  const titulo = extra.titulo || ficha.titulos[dinheiro ? 'dinheiro' : (problema ? 'problema' : '') + op];
  const q = {
    titulo, materia: 'matematica', habilidadeBNCC: extra.bncc || bncc, nivel: extra.nivel ? +extra.nivel : nivel,
    tipo: 'operacao', enunciado
  };
  const vis = apoio(op, a, b, emoji);
  if (vis) q.apoioVisual = vis;
  const opcoes = [r, ...erradas(op, a, b, r)].sort((x, y) => x - y);
  return Object.assign(q, { opcoes, correta: r, explicacao, _emoji: emoji });
}

// Escreve no mesmo estilo de conteudo/mat.js: {chave:'texto',...} numa linha só
const esc = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
function escrever(v) {
  if (Array.isArray(v)) return '[' + v.map(escrever).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => k + ':' + escrever(x)).join(',') + '}';
  return typeof v === 'number' ? String(v) : esc(v);
}

function principal(args) {
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log('Uso: node build/gerar-mat.js <pedido.txt> [--gravar]'); return 1; }
  const destino = path.join(pastaConteudo, 'mat.js');
  const texto = fs.readFileSync(destino, 'utf8');
  globalThis.LB = {};
  new Function('LB', texto)(globalThis.LB);
  const existentes = LB.mat;
  let ultimo = Math.max(...existentes.map(q => +q.id.split('-')[1]));
  const enunciados = new Set(existentes.map(q => q.enunciado));
  const novas = [], problemas = [];
  let emojiAnterior = null;
  fs.readFileSync(arq, 'utf8').split('\n').forEach((l, n) => {
    if (!l.trim() || l.trim().startsWith('#')) return;
    try {
      const q = montar(l);
      if (enunciados.has(q.enunciado)) throw new Error('já existe no conteúdo: "' + q.enunciado + '"');
      if (q._emoji === emojiAnterior) problemas.push('linha ' + (n + 1) + ': aviso, mesmo emoji da anterior (' + q._emoji + ')');
      emojiAnterior = q._emoji; delete q._emoji;
      enunciados.add(q.enunciado);
      novas.push(Object.assign({ id: 'mat-' + String(++ultimo).padStart(3, '0') }, q));
    } catch (e) { problemas.push('linha ' + (n + 1) + ': ' + e.message); }
  });
  const erros = problemas.filter(p => !p.includes(': aviso,'));
  problemas.forEach(p => console.log(p));
  const conta = {};
  novas.forEach(q => { conta[q.habilidadeBNCC] = (conta[q.habilidadeBNCC] || 0) + 1; });
  console.log(novas.length + ' atividade(s): ' + (novas[0] ? novas[0].id + ' a ' + novas[novas.length - 1].id : '-') + ' · ' + JSON.stringify(conta));
  if (erros.length) { console.log('Nada gravado: corrija ' + erros.length + ' erro(s).'); return 1; }
  if (!args.includes('--gravar')) { console.log('(prévia; use --gravar para acrescentar em conteudo/mat.js)'); return 0; }
  const fim = texto.lastIndexOf('];');
  const linhas = novas.map(q => escrever(q) + ',').join('\n');
  fs.writeFileSync(destino, texto.slice(0, fim).replace(/,?\s*$/, ',\n') + linhas + '\n' + texto.slice(fim));
  console.log('Gravado em conteudo/mat.js. Agora: node build/validar.js');
  return 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar, erradas, escrever };
