// Motor gerador de Língua Portuguesa: de uma linha curta de pedido, monta a atividade completa
// (opções erradas tiradas das trocas típicas da criança, explicação, BNCC e nível conferidos).
// Uso:
//   node build/gerar-lp.js build/pedidos/lp-<lote>.txt            → prévia (não grava); --ver mostra cada item
//   node build/gerar-lp.js build/pedidos/lp-<lote>.txt --gravar   → acrescenta no fim de conteudo/lp.js
// Linha = molde | campos... | chave=valor (titulo=, nivel=, bncc=, erradas=a/b). Moldes (ficha build/fichas/lp.json):
//   troca | Lucas queria duas, [mas] só tinha uma.          → completar; erradas do grupo (mais, más) ou das trocas
//   grafia | pássaro | 🐦                                     → "Qual é o jeito certo de escrever?" (pácaro, páçaro)
//   palavra | texto | pergunta | ma-nhã | tem=nh | erradas=fei-ra/a-ju-dar   → palavra do texto (confere o texto)
//   silabas | ca-va-lo                                       → "Quantas sílabas tem...?" (conta sozinho)
//   alfabetica | bola, casa, dado                             → "Qual vem primeiro na ordem alfabética?"
//   inferencia | enunciado | *Feliz | Com medo | Doente | explicação   (também: interpretacao, leia,
//     sinonimo, antonimo, plural, pontuacao, gramatica, escolha). A certa leva * na frente.
'use strict';
const fs = require('fs');
const path = require('path');
const { partir, escolha, rodar } = require('./pedido');
const BNCC = require('./bncc-regras');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/lp.json'), 'utf8'));

const minusc = s => s.toLocaleLowerCase('pt-BR');
const comoA = (modelo, s) => (modelo[0] === modelo[0].toLocaleUpperCase('pt-BR') && modelo[0] !== minusc(modelo[0]) ? s[0].toLocaleUpperCase('pt-BR') + s.slice(1) : s);
const semHifen = s => s.replace(/-/g, '');
const ordenar = l => [...l].sort((a, b) => a.localeCompare(b, 'pt-BR'));
const grupoDe = p => ficha.grupos.find(g => g.palavras.includes(minusc(p)));

// Erros de escrita típicos para uma palavra: [{ palavra, troca }] na ordem da ficha
function trocas(certa) {
  const saida = [];
  for (const t of ficha.trocas) {
    const re = new RegExp(t.de);
    if (!re.test(minusc(certa))) continue;
    const errada = comoA(certa, minusc(certa).replace(re, t.para));
    if (errada && errada !== certa && !saida.some(s => s.palavra === errada)) saida.push({ palavra: errada, troca: t });
  }
  return saida;
}

// Duas erradas para a palavra certa + explicação sugerida + título sugerido
function erradasDe(certa, extra) {
  if (extra.erradas) return { erradas: extra.erradas.split('/').map(s => s.trim()), explica: 'O certo é "' + certa + '".', titulo: '' };
  const g = grupoDe(certa);
  if (g) {
    const outras = g.palavras.filter(p => p !== minusc(certa)).slice(0, 2);
    return { erradas: outras.map(p => comoA(certa, p)), explica: g.explica[minusc(certa)] + ' ' + g.explica[outras[0]], titulo: '' };
  }
  const t = trocas(certa);
  if (t.length < 2) throw new Error('não achei 2 erros típicos para "' + certa + '": use erradas=a/b');
  return { erradas: [t[0].palavra, t[1].palavra], explica: 'O certo é "' + certa + '". ' + t[0].troca.explica, titulo: t[0].troca.titulo };
}

function base(molde, extra) {
  const m = ficha.moldes[molde];
  return { titulo: extra.titulo || m.titulo, materia: 'lingua-portuguesa', habilidadeBNCC: extra.bncc || m.bncc, nivel: extra.nivel ? +extra.nivel : m.nivel };
}

const MOLDES = {
  troca(c, extra) {
    let frase = c[0] || '', certa = c[1], explicacao = c[2];
    const marca = frase.match(/\[([^\]]+)\]/);
    if (marca) { certa = marca[1]; explicacao = c[1]; frase = frase.replace(marca[0], '___'); }
    if (!frase.includes('___') || !certa) throw new Error('marque a resposta na frase com [colchetes] ou use ___ e diga a certa');
    const e = erradasDe(certa, extra);
    return { tipo: 'completar', enunciado: 'Complete: "' + frase + '"', opcoes: ordenar([certa, ...e.erradas]), correta: certa, explicacao: explicacao || e.explica };
  },
  grafia(c, extra) {
    const certa = c[0];
    if (!certa) throw new Error('falta a palavra');
    const e = erradasDe(certa, extra);
    const opcoes = ordenar([certa, ...e.erradas]);
    const q = { tipo: 'multipla', enunciado: 'Qual é o jeito certo de escrever?' + (c[1] ? ' ' + c[1] : ''), opcoes, correta: opcoes.indexOf(certa), explicacao: c[2] || e.explica };
    if (e.titulo && !extra.titulo) q.titulo = e.titulo;
    q._emoji = c[1];
    return q;
  },
  palavra(c, extra) {
    const [texto, pergunta, certa, explicacao] = c;
    if (!texto || !pergunta || !certa) throw new Error('use: palavra | texto | pergunta | certa');
    const doTexto = texto.match(/[\p{L}]+/gu) || [];
    const palavras = doTexto.map(minusc);
    const noTexto = p => palavras.includes(minusc(semHifen(p)));
    let erradas = extra.erradas ? extra.erradas.split('/').map(s => s.trim()) : null;
    const tem = extra.tem ? minusc(extra.tem) : '';
    if (!erradas) {
      if (certa.includes('-')) throw new Error('com sílabas separadas, diga as erradas também: erradas=fei-ra/a-ju-dar');
      const n = certa.length;
      erradas = [...new Set(doTexto)].filter(p => p.length >= 3 && minusc(p) !== minusc(certa) && !(tem && minusc(p).includes(tem)))
        .sort((a, b) => Math.abs(a.length - n) - Math.abs(b.length - n)).slice(0, 2);
    }
    for (const p of [certa, ...erradas]) if (!noTexto(p)) throw new Error('"' + p + '" não está no texto');
    if (tem && !minusc(certa).includes(tem)) throw new Error('a certa "' + certa + '" não tem "' + tem + '"');
    if (tem && erradas.some(p => minusc(p).includes(tem))) throw new Error('uma errada também tem "' + tem + '"');
    const opcoes = ordenar([certa, ...erradas]);
    const exp = explicacao || ('"' + certa + '" é a palavra do texto que ' + (tem ? 'tem "' + tem + '".' : 'responde à pergunta.'));
    return { tipo: 'multipla', enunciado: 'Leia: "' + texto + '" ' + pergunta, opcoes, correta: opcoes.indexOf(certa), explicacao: exp };
  },
  silabas(c) {
    const partes = (c[0] || '').split('-').filter(Boolean);
    if (partes.length < 1 || !c[0].includes('-') && partes[0].length > 3) throw new Error('separe as sílabas com hífen: ca-va-lo');
    const n = partes.length, ini = Math.max(1, n - 1);
    const opcoes = [ini, ini + 1, ini + 2].map(String);
    const q = { tipo: 'multipla', enunciado: 'Quantas sílabas tem a palavra "' + partes.join('') + '"?' + (c[1] ? ' ' + c[1] : ''), opcoes, correta: opcoes.indexOf(String(n)), explicacao: partes.join('-').toLocaleUpperCase('pt-BR') + ': ' + n + (n === 1 ? ' sílaba.' : ' sílabas.') };
    q._emoji = c[1];
    return q;
  },
  alfabetica(c, extra) {
    const lista = (c[0] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (lista.length !== 3 || new Set(lista.map(minusc)).size !== 3) throw new Error('dê 3 palavras diferentes separadas por vírgula');
    const certa = ordenar(lista)[extra.ultima ? 2 : 0];
    const q = { tipo: 'multipla', enunciado: 'Qual palavra vem ' + (extra.ultima ? 'por último' : 'primeiro') + ' na ordem alfabética?', opcoes: lista, correta: lista.indexOf(certa), explicacao: 'Na ordem alfabética: ' + ordenar(lista).join(', ') + '. ' + (extra.ultima ? 'Por último' : 'Primeiro') + ' vem "' + certa + '".' };
    if (new Set(lista.map(p => minusc(p)[0])).size < 3 && !extra.nivel) q.nivel = 2;
    return q;
  }
};

// Avisos de qualidade: enunciado longo, certa muito mais comprida que as erradas
function avisos(q) {
  const a = [];
  if (q.enunciado.length > ficha.limite_enunciado) a.push('enunciado com ' + q.enunciado.length + ' letras');
  const certa = typeof q.correta === 'number' ? q.opcoes[q.correta] : q.correta;
  const maiorErrada = Math.max(...q.opcoes.filter(o => o !== certa).map(o => o.length));
  if (certa.length > 15 && certa.length > maiorErrada * 1.8) a.push('a certa é bem mais comprida que as erradas (a criança pode adivinhar)');
  return a;
}

// Uma linha de pedido → atividade (sem id)
function montar(linha) {
  const { campos, extra } = partir(linha);
  const molde = campos.shift();
  if (!ficha.moldes[molde]) throw new Error('molde desconhecido "' + molde + '" (veja build/fichas/lp.json)');
  let corpo;
  if (MOLDES[molde]) corpo = MOLDES[molde](campos, extra);
  else {
    const e = escolha(campos.slice(1));
    if (!campos[0]) throw new Error('falta o enunciado');
    if (!e.explicacao) throw new Error('falta a explicação (depois das 3 opções)');
    corpo = { tipo: 'multipla', enunciado: campos[0], opcoes: e.opcoes, correta: e.correta, explicacao: e.explicacao, _emoji: extra.emoji };
  }
  const [o1, o2, o3] = corpo.opcoes;
  if (new Set([o1, o2, o3].map(minusc)).size !== 3) throw new Error('opções repetidas: ' + corpo.opcoes.join(', '));
  const q = Object.assign(base(molde, extra), corpo);
  q.habilidadeBNCC = BNCC.certo(q).bncc; // regras de build/fichas/bncc.json
  q._avisos = avisos(q);
  // ordem dos campos igual à do conteúdo existente
  const { titulo, materia, habilidadeBNCC, nivel, tipo, enunciado, opcoes, correta, explicacao, _emoji, _avisos } = q;
  return { titulo, materia, habilidadeBNCC, nivel, tipo, enunciado, opcoes, correta, explicacao, _emoji, _avisos };
}

const uso = 'Uso: node build/gerar-lp.js <pedido.txt> [--gravar] [--ver]';
const principal = args => rodar({ arquivo: 'lp', chave: 'lp', prefixo: 'lp', digitos: 3, montar, uso }, args);

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { montar, trocas, erradasDe };
