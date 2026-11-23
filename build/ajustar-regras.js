// Regras do motor de ajuste (build/ajustar-lp.js), sem ler nem gravar arquivos.
// Problemas tratados na resposta certa de uma pergunta de escolha:
//   1. comprida demais perto das erradas (a criança acerta só pelo tamanho);
//   2. em pergunta de "pista", palavras que não estão no texto lido.
// Correção: corta o FINAL da frase num ponto seguro (ficha 'cortes'), sem trazer palavra nova.
'use strict';
const ficha = require('./fichas/ajustar.json');

const minusc = s => s.toLocaleLowerCase('pt-BR');
const vazias = new Set(ficha.vazias);
const palavras = s => (minusc(s).match(/[\p{L}]+/gu) || []);
const raiz = p => p.slice(0, 4); // "chegou" e "chegar" contam como a mesma palavra

// Texto lido: o trecho entre aspas depois de "Leia:"
const textoDe = enunciado => ((enunciado || '').match(/Leia:\s*"([^"]+)"/) || [])[1] || '';
const ehPista = enunciado => ficha.pista.some(p => minusc(enunciado || '').includes(p));

// Palavras com conteúdo da frase que não aparecem no texto
function foraDoTexto(frase, texto) {
  const doTexto = new Set(palavras(texto).map(raiz));
  return [...new Set(palavras(frase).filter(p => p.length >= 4 && !vazias.has(p) && !doTexto.has(raiz(p))))];
}

// Versões mais curtas: a frase cortada antes de cada ponto de corte (só o começo fica)
function cortesDe(certa) {
  const fim = /[.!?]$/.test(certa) ? certa.slice(-1) : '';
  const corpo = fim ? certa.slice(0, -1) : certa;
  const posicoes = new Set();
  for (const c of ficha.cortes) {
    let i = corpo.indexOf(c);
    while (i > 0) { posicoes.add(i); i = corpo.indexOf(c, i + 1); }
  }
  return [...posicoes].sort((a, b) => a - b).map(i => corpo.slice(0, i).replace(/[,;:\s]+$/, '') + fim);
}

// Palavras fora do texto só contam a partir de 'fora_minimo' (trocar uma palavra por outra parecida é normal)
function foraConta(certa, enunciado) {
  const texto = textoDe(enunciado);
  if (!texto || !ehPista(enunciado)) return [];
  const f = foraDoTexto(certa, texto);
  return f.length >= ficha.fora_minimo ? f : [];
}

// Precisa de ajuste? Devolve a lista de motivos (vazia = está bom)
function motivos(certa, erradas, enunciado) {
  const m = [];
  const maior = Math.max(...erradas.map(e => e.length));
  if (certa.length > ficha.minimo_letras_aviso && certa.length > maior * ficha.razao_aviso) m.push('comprida');
  if (foraConta(certa, enunciado).length) m.push('fora');
  return m;
}

// Ajusta uma certa. Devolve { nova, mudou, motivos, pendente }
function ajustarCerta(certa, erradas, enunciado) {
  const antes = motivos(certa, erradas, enunciado);
  if (!antes.length) return { nova: certa, mudou: false, motivos: [], pendente: '' };
  const maior = Math.max(...erradas.map(e => e.length));
  const errMin = new Set(erradas.map(minusc));
  const piso = Math.max(ficha.minimo_letras, maior * ficha.piso);
  // Cortes aceitáveis: não ficam curtos demais e não trazem problema novo
  const boas = cortesDe(certa).filter(c => c.length >= piso && palavras(c).length >= 2 && !errMin.has(minusc(c)))
    .filter(c => motivos(c, erradas, enunciado).every(m => antes.includes(m)));
  // O corte mais longo que resolve mais problemas (guarda o máximo do sentido)
  const melhor = boas.map(c => ({ c, n: motivos(c, erradas, enunciado).length }))
    .filter(x => x.n < antes.length).sort((a, b) => a.n - b.n || b.c.length - a.c.length)[0];
  const nova = melhor ? melhor.c : certa;
  const pendente = motivos(nova, erradas, enunciado).map(r => r === 'comprida'
    ? 'certa ainda comprida (' + nova.length + ' letras; maior errada ' + maior + '): encurte a certa ou alongue as erradas'
    : 'certa tem palavras fora do texto: ' + foraConta(nova, enunciado).join(', ')).join('; ');
  return { nova, mudou: nova !== certa, motivos: antes, pendente };
}

module.exports = { ajustarCerta, motivos, foraDoTexto, cortesDe, textoDe, ehPista };
