// Motor gerador de Matemática: de uma linha curta de pedido, monta a atividade completa
// (conta conferida, figuras, opções erradas tiradas de erros típicos e explicação).
// Uso:
//   node build/gerar-mat.js build/pedidos/mat-<lote>.txt            → só mostra o resumo (não grava)
//   node build/gerar-mat.js build/pedidos/mat-<lote>.txt --gravar   → acrescenta no fim de conteudo/mat.js
// Linha do pedido (campos separados por " | "; linhas com # são comentário):
//   conta | emoji | enunciado (opcional) | frase final da explicação (opcional) | chave=valor...
//   8 − 3 | 🍬 | Pedro tinha 8 balas e comeu 3. Quantas sobraram? | Sobraram 5 balas.
//   7 + 5 | 🐸
//   3 × 4 | 🍪 | titulo=Pacotes de biscoito | nivel=3 | bncc=EF03MA07
// Questão de escolha (sem conta pronta): começa com "?"; a certa leva * na frente.
//   ? Qual número vem depois do 49? | *50 | 48 | 59 | Depois do 49 vem o 50. | bncc=EF02MA01 | emoji=🔢
// Sem enunciado, vira "Quanto é 8 − 3?". Nível, BNCC e título saem sozinhos (ver build/fichas/mat.json; BNCC pelas regras de build/fichas/bncc.json).
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
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
  esqueceu_vai_um: (a, b, r) => ((a >= 10 || b >= 10) && (a % 10) + (b % 10) >= 10 ? r - 10 : null),
  subtraiu_ao_contrario: (a, b) => {
    if (!ehDuasCasas(a) || (a % 10) >= (b % 10)) return null;
    const [da, ua] = casas(a), [db, ub] = casas(b);
    return Math.abs(da - db) * 10 + Math.abs(ua - ub);
  },
  inverteu_algarismos: (a, b, r) => (ehDuasCasas(r) && r % 10 !== 0 ? (r % 10) * 10 + Math.floor(r / 10) : null),
  um_grupo_a_mais: (a, b) => (a + 1) * b,
  um_grupo_a_menos: (a, b) => (a - 1) * b
};

// As 2 erradas com o tipo de erro de cada uma. Nunca simétricas (certa no meio, à mesma distância
// das duas: a criança acertaria sem fazer a conta). Sem erro típico que sirva, usa um número "perto".
function erradasComTipo(op, a, b, r) {
  const lista = [];
  const aceita = v => v !== null && Number.isInteger(v) && v > 0 && v !== r && !lista.some(x => x.valor === v) &&
    !(lista.length === 1 && lista[0].valor + v === 2 * r);
  for (const nome of ficha.erros[op]) {
    if (!ERROS[nome]) throw new Error('erro "' + nome + '" da ficha não existe no motor');
    const v = ERROS[nome](a, b, r);
    if (aceita(v)) lista.push({ valor: v, tipo: nome });
    if (lista.length === 2) return lista;
  }
  for (const v of [r + 2, r - 2, r + 3, r - 3]) { if (aceita(v)) lista.push({ valor: v, tipo: 'perto' }); if (lista.length === 2) break; }
  return lista;
}
const erradas = (op, a, b, r) => erradasComTipo(op, a, b, r).map(x => x.valor);

const temPalavra = (texto, lista) => lista.some(p => texto.toLowerCase().includes(p.toLowerCase()));
const preencher = (modelo, v) => modelo.replace(/\{(\w+)\}/g, (_, k) => v[k]);
const repetir = (emoji, n) => Array(n).fill(emoji).join('');

function apoio(op, a, b, emoji) {
  if (op === '×') return a * b <= 30 ? { esquerda: Array(a).fill(repetir(emoji, b)).join(' '), operador: a + ' × ' + b, direita: '' } : null;
  if (op === '÷') return a <= 20 ? { esquerda: repetir(emoji, a), operador: '÷' + b, direita: '' } : null;
  if (a > 20 || b > 20) return { esquerda: String(a), operador: op, direita: String(b) };
  return { esquerda: repetir(emoji, a), operador: op, direita: op === '+' ? repetir(emoji, b) : String(b) };
}

const { partir, escolha, rodar } = require('./pedido');
const BNCC = require('./bncc-regras'); // código da BNCC pelas regras de build/fichas/bncc.json

// "? enunciado | *certa | errada | errada | explicação" → questão de escolha
function montarEscolha(linha) {
  const { campos, extra } = partir(linha.replace(/^\?\s*/, ''));
  const enunciado = (campos[0] || '').replace(/(\d) - (\d)/g, '$1 − $2');
  const e = escolha(campos.slice(1));
  if (!e.explicacao) throw new Error('falta a explicação (depois das 3 opções)');
  const q = {
    titulo: extra.titulo || ficha.titulos.escolha, materia: 'matematica', habilidadeBNCC: extra.bncc || '',
    nivel: extra.nivel ? +extra.nivel : 2, tipo: 'multipla', enunciado,
    opcoes: e.opcoes, correta: e.correta, explicacao: e.explicacao, _emoji: extra.emoji
  };
  q.habilidadeBNCC = BNCC.certo(q).bncc;
  if (!q.habilidadeBNCC) throw new Error('diga a habilidade: bncc=EF02MA05 (ou outra)');
  return q;
}

// Uma linha de pedido → atividade (sem id). Lança erro com motivo claro se a conta não serve.
function montar(linha) {
  if (linha.startsWith('?')) return montarEscolha(linha);
  const { campos, extra } = partir(linha);
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
    titulo, materia: 'matematica', habilidadeBNCC: extra.bncc || '', nivel: extra.nivel ? +extra.nivel : nivel,
    tipo: 'operacao', enunciado
  };
  const vis = apoio(op, a, b, emoji);
  if (vis) q.apoioVisual = vis;
  const opcoes = [r, ...erradas(op, a, b, r)].sort((x, y) => x - y);
  Object.assign(q, { opcoes, correta: r, explicacao, _emoji: emoji });
  q.habilidadeBNCC = BNCC.certo(q).bncc;
  return q;
}

const uso = 'Uso: node build/gerar-mat.js <pedido.txt> [--gravar] [--ver]';
const principal = args => rodar({ arquivo: 'mat', chave: 'mat', prefixo: 'mat', digitos: 3, montar, uso }, args);

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar, erradas, erradasComTipo, apoio, ERROS };
