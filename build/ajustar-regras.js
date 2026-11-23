// Regras do motor de ajuste (build/ajustar-lp.js), sem ler nem gravar arquivos.
// Problemas da resposta certa numa pergunta de escolha:
//   comprida: bem maior que as erradas (a criança acerta só pelo tamanho) ou acima do máximo da série;
//   fora: em pergunta de "pista", palavras que não estão no texto lido.
// O motor NÃO corta: monta o plano da revisão (tamanhos e distratores da série) e confere a reescrita.
'use strict';
const ficha = require('./fichas/ajustar.json');
const dist = require('./fichas/distratores.json');

const minusc = s => s.toLocaleLowerCase('pt-BR');
const vazias = new Set(ficha.vazias);
const palavras = s => (minusc(s).match(/[\p{L}]+/gu) || []);
const raiz = p => p.slice(0, 4); // "chegou" e "chegar" contam como a mesma palavra

const textoDe = enunciado => ((enunciado || '').match(/Leia:\s*"([^"]+)"/) || [])[1] || '';
const ehPista = enunciado => ficha.pista.some(p => minusc(enunciado || '').includes(p));
const serieDe = nivel => dist.series[dist.serie_do_nivel[String(nivel)] || '3'];

function foraDoTexto(frase, texto) {
  const doTexto = new Set(palavras(texto).map(raiz));
  return [...new Set(palavras(frase).filter(p => p.length >= 4 && !vazias.has(p) && !doTexto.has(raiz(p))))];
}
function foraConta(certa, enunciado) {
  const texto = textoDe(enunciado);
  if (!texto || !ehPista(enunciado)) return [];
  const f = foraDoTexto(certa, texto);
  return f.length >= ficha.fora_minimo ? f : [];
}

// Lista de problemas (vazia = está bom). q: { enunciado, opcoes, correta, nivel }
function motivos(q) {
  const certa = String(q.opcoes[q.correta]);
  const erradas = q.opcoes.filter((o, i) => i !== q.correta).map(String);
  const maior = Math.max(...erradas.map(e => e.length));
  const m = [];
  if (certa.length > ficha.minimo_letras_aviso && certa.length > maior * ficha.razao_aviso) m.push('certa comprida perto das erradas');
  else if (certa.length > serieDe(q.nivel).max_certa) m.push('certa acima de ' + serieDe(q.nivel).max_certa + ' letras');
  const f = foraConta(certa, q.enunciado);
  if (f.length) m.push('certa com palavras fora do texto: ' + f.join(', '));
  return m;
}

// Plano da revisão: série, tamanhos pedidos e tipos de distrator aceitos
function plano(q) {
  const s = serieDe(q.nivel);
  const certa = String(q.opcoes[q.correta]);
  const alvo = Math.min(s.max_certa, certa.length);
  return { serie: s.nome, maxCerta: s.max_certa, erradas: [Math.round(alvo * ficha.equilibrio.min), Math.round(alvo * ficha.equilibrio.max)], tipos: Object.keys(s.tipos) };
}

// Confere a reescrita: { certa, erradas: [{ texto, tipo }] }. Devolve a lista de erros (vazia = aceita)
function conferir(q, nova) {
  const s = serieDe(q.nivel);
  const e = [];
  const { certa, erradas } = nova;
  if (!certa || erradas.length !== 2) return ['precisa de 1 certa e 2 erradas'];
  if (certa.length > s.max_certa) e.push('certa com ' + certa.length + ' letras (máximo ' + s.max_certa + ' no ' + s.nome + ')');
  for (const x of erradas) {
    const r = x.texto.length / certa.length;
    if (r < ficha.equilibrio.min || r > ficha.equilibrio.max) e.push('errada "' + x.texto + '" com ' + x.texto.length + ' letras (a certa tem ' + certa.length + '; peça entre ' + Math.ceil(certa.length * ficha.equilibrio.min) + ' e ' + Math.floor(certa.length * ficha.equilibrio.max) + ')');
    if (!s.tipos[x.tipo]) e.push('tipo {' + x.tipo + '} não é do ' + s.nome + ' (use: ' + Object.keys(s.tipos).join(', ') + ')');
    const ruim = palavras(x.texto).find(p => dist.evitar.includes(p));
    if (ruim) e.push('errada com "' + ruim + '" (absurda: a criança descarta sem ler)');
  }
  if (erradas[0].tipo === erradas[1].tipo) e.push('as duas erradas são do mesmo tipo {' + erradas[0].tipo + '}');
  if (new Set([certa, ...erradas.map(x => x.texto)].map(minusc)).size !== 3) e.push('opções repetidas');
  const f = foraConta(certa, q.enunciado);
  if (f.length) e.push('certa com palavras fora do texto: ' + f.join(', '));
  return e;
}

module.exports = { motivos, plano, conferir, foraDoTexto, textoDe, ehPista, serieDe };
