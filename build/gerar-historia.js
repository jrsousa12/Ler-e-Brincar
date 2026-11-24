// Motor gerador de histórias: de um pedido em texto simples, monta a história com 3 perguntas conferidas.
// Uso:
//   node build/gerar-historia.js build/pedidos/historia-<onda>.txt            → prévia (--ver mostra cada uma)
//   node build/gerar-historia.js build/pedidos/historia-<onda>.txt --gravar   → acrescenta em conteudo/historias.js
// Formato (linhas com # são comentário):
//   = O pão quentinho | 🥖 | nivel=3 | ano=3 | bncc=EF02LP26,EF35LP04   ← começa uma história
//   Todo dia, Seu Antônio acende o forno. O cheiro se espalha pela rua.  ← parágrafos (viram frases)
//   ? Quem acende o forno? | *Seu Antônio | Rafael | O pai | O texto diz que é Seu Antônio.
//   ? ...                                                                ← pergunta de escolha
//   ! Por que Rafael saiu contente? | ... | ... | ... | explicação        ← pergunta de inferência
// Valores padrão (autor, BNCC, nível, cores): build/fichas/historias.json.
'use strict';
const fs = require('fs');
const path = require('path');
const { partir, escolha, linhas, abrir, ultimoNumero, novoId, concluir } = require('./pedido');
const BNCC = require('./bncc-regras');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/historias.json'), 'utf8'));

const frasesDe = p => p.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
const contarPalavras = f => (f.match(/[\p{L}\d]+/gu) || []).length;

// Bloco de linhas de uma história → item (sem id e sem cor); lança erro com o motivo
function montar(bloco) {
  const { campos, extra } = partir(bloco[0].replace(/^=\s*/, ''));
  const [titulo, emoji] = campos;
  if (!titulo || !emoji) throw new Error('cabeçalho: = Título | emoji');
  const texto = [], perguntas = [], avisos = [];
  for (const l of bloco.slice(1)) {
    if (/^[?!]/.test(l)) {
      const c = partir(l.slice(1)).campos;
      const e = escolha(c.slice(1));
      if (!c[0]) throw new Error('pergunta sem enunciado');
      if (!e.explicacao) throw new Error('pergunta "' + c[0] + '" sem explicação');
      perguntas.push({ tipo: l[0] === '!' ? 'inferencia' : 'multipla', enunciado: c[0], opcoes: e.opcoes, correta: e.correta, explicacao: e.explicacao });
    } else texto.push(...frasesDe(l));
  }
  const { min, max } = ficha.frases;
  if (texto.length < min || texto.length > max) throw new Error(texto.length + ' frases (precisa de ' + min + ' a ' + max + ')');
  if (perguntas.length !== 3) throw new Error(perguntas.length + ' perguntas (precisa de 3)');
  texto.forEach(f => { if (contarPalavras(f) > ficha.palavras_por_frase) avisos.push('frase longa (' + contarPalavras(f) + ' palavras): "' + f.slice(0, 40) + '..."'); });
  if (!perguntas.some(p => p.tipo === 'inferencia')) avisos.push('nenhuma pergunta de inferência (!)');
  const nPal = titulo.split(/\s+/).length;
  if (nPal < 2 || nPal > 5) avisos.push('título com ' + nPal + ' palavras');
  const nivel = extra.nivel ? +extra.nivel : ficha.nivel;
  return {
    titulo, autor: extra.autor || ficha.autor, anoEscolar: extra.ano ? +extra.ano : (nivel >= 3 ? 3 : 2),
    habilidadesBNCC: BNCC.trocarLista(extra.bncc ? extra.bncc.split(',').map(s => s.trim()) : ficha.bncc), nivel, emoji,
    corFundo: '', texto, perguntas, _avisos: avisos
  };
}

// Divide o pedido em blocos que começam com "="
function blocos(arq) {
  const saida = [];
  for (const l of linhas(arq)) {
    if (l.t.startsWith('=')) saida.push({ n: l.n, linhas: [l.t] });
    else if (saida.length) saida[saida.length - 1].linhas.push(l.t);
    else throw new Error('linha ' + l.n + ': antes da primeira história (comece com "= Título | emoji")');
  }
  return saida;
}

function principal(args) {
  const cfg = { arquivo: 'historias' };
  const arq = args.find(a => !a.startsWith('--'));
  if (!arq) { console.log('Uso: node build/gerar-historia.js <pedido.txt> [--gravar] [--ver]'); return 1; }
  const { destino, texto, lista } = abrir('historias', 'historias');
  let ultimo = ultimoNumero(lista);
  const titulos = new Set(lista.map(h => h.titulo.toLowerCase()));
  let emojiAnterior = lista.length ? lista[lista.length - 1].emoji : null;
  const novas = [], problemas = [];
  let lista2;
  try { lista2 = blocos(arq); } catch (e) { console.log(e.message); return 1; }
  for (const b of lista2) {
    try {
      const h = montar(b.linhas);
      if (titulos.has(h.titulo.toLowerCase())) throw new Error('já existe história com o título "' + h.titulo + '"');
      h._avisos.forEach(a => problemas.push('linha ' + b.n + ': aviso, ' + a));
      if (h.emoji === emojiAnterior) problemas.push('linha ' + b.n + ': aviso, mesmo emoji da anterior (' + h.emoji + ')');
      emojiAnterior = h.emoji; delete h._avisos;
      titulos.add(h.titulo.toLowerCase());
      const n = ++ultimo;
      h.corFundo = ficha.cores[n % ficha.cores.length];
      novas.push(Object.assign({ id: novoId('historia', n, 2) }, h));
    } catch (e) { problemas.push('linha ' + b.n + ': ' + e.message); }
  }
  return concluir(cfg, args, problemas, novas, destino, texto, h => 'nivel ' + h.nivel);
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar, frasesDe };
