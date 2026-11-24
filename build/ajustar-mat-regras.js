// Regras do motor de ajuste de Matemática (build/ajustar-mat.js), sem ler nem gravar arquivos.
// Problemas das opções de uma questão de Matemática:
//   simétrica: a certa fica no meio, à mesma distância das duas erradas (8, 9, 10): dá para acertar sem a conta;
//   sem erro típico: na conta, a errada não é erro de criança (ficha build/fichas/mat.json) nem número perto;
//   longe: na escolha com números, errada longe da certa sem tipo conferido;
//   explicação sem a certa; certa de texto comprida perto das erradas (mesma regra do Português).
// O ajuste nunca muda a resposta certa: só as erradas (e a explicação, se pedir).
'use strict';
const ficha = require('./fichas/mat.json');
const gerar = require('./gerar-mat.js');
const R = require('./ajustar-regras.js');
const TIPOS = Object.keys({ ...ficha.nomes_dos_erros, ...ficha.tipos_escolha_extra });
const PERTO = 3; // "perto" = até 3 de distância da certa
const SO_CERTA = ['um_a_mais', 'um_a_menos', 'dez_a_mais', 'dez_a_menos', 'inverteu_algarismos']; // só precisam da certa
const CONTA = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };

const numero = s => (/^\d+$/.test(String(s).trim()) ? +s : null);
require('../js/respostas.js'); // regra única da resposta certa (valor, texto ou posição)
const indice = q => globalThis.LB.respostas.indiceCorreto(q);
const certaDe = q => q.opcoes[indice(q)];
const erradasDe = q => q.opcoes.filter((o, i) => i !== indice(q));

// A conta da questão (só em "operacao"): a primeira "a op b" da explicação ou do enunciado que dá a certa
function contaDe(q) {
  if (q.tipo !== 'operacao') return null;
  for (const t of [q.explicacao, q.enunciado]) {
    for (const m of String(t || '').matchAll(/(?<![+−×÷]\s?)(\d+) ([+−×÷]) (\d+)(?!\s?[+−×÷])/g)) {
      const a = +m[1], op = m[2], b = +m[3];
      if (CONTA[op](a, b) === q.correta) return { a, op, b, r: q.correta };
    }
  }
  return null;
}

// Valor que cada tipo de erro daria nesta questão (só os tipos que dá para calcular)
function valores(q) {
  const c = numero(certaDe(q));
  if (c === null) return {};
  const k = contaDe(q);
  const nomes = k ? [...new Set([...ficha.erros[k.op], ...SO_CERTA])] : SO_CERTA; // só os erros da ficha para o sinal
  const v = {};
  for (const n of nomes) { const x = k ? gerar.ERROS[n](k.a, k.b, c) : gerar.ERROS[n](0, 0, c); if (x !== null && x > 0) v[n] = x; }
  return v;
}

const simetrica = (c, e) => c !== null && e.length === 2 && e.every(x => x !== null) && e[0] + e[1] === 2 * c;

// Lista de problemas (vazia = está bom). tiposVistos: tipos já conferidos no registro (ou nada)
function motivos(q, tiposVistos) {
  const c = numero(certaDe(q)), e = erradasDe(q).map(numero), m = [];
  if (simetrica(c, e)) m.push('certa no meio, à mesma distância das erradas (' + e.join(' e ') + '): dá para acertar sem a conta');
  if (q.tipo === 'operacao') {
    const k = contaDe(q);
    if (!k) { if (!tiposVistos) m.push('não achei a conta na explicação (diga os tipos das erradas)'); }
    else {
      const tipicos = Object.values(valores(q));
      e.filter(x => !tipicos.includes(x) && Math.abs(x - c) > PERTO).forEach(x => m.push('errada ' + x + ' não é erro típico de ' + k.a + ' ' + k.op + ' ' + k.b));
    }
  } else if (c !== null && !tiposVistos) {
    e.filter(x => x === null || Math.abs(x - c) > Math.max(10, c / 2)).forEach(x => m.push('errada ' + (x === null ? 'que não é número' : x) + ' longe da certa ' + c));
  }
  if (q.tipo !== 'operacao' && !String(q.explicacao).toLowerCase().includes(String(certaDe(q)).toLowerCase())) m.push('a explicação não diz a certa');
  if (c === null) m.push(...R.motivos(q).filter(x => x.startsWith('certa comprida')));
  return m;
}

// Sugestão de erradas: na conta, os erros típicos (nunca simétricos); sem conta, o que dá com a certa
function sugerir(q) {
  const k = contaDe(q);
  if (k) return gerar.erradasComTipo(k.op, k.a, k.b, k.r);
  const c = numero(certaDe(q));
  if (c === null) return erradasDe(q).map(v => ({ valor: v, tipo: '?' }));
  const ficam = erradasDe(q).map(numero).filter(x => x !== null && Math.abs(x - c) <= Math.max(10, c / 2)).slice(0, 1).map(v => ({ valor: v, tipo: '?' }));
  for (const [tipo, v] of Object.entries(valores(q))) {
    if (ficam.length === 2) break;
    if (v !== c && !ficam.some(x => x.valor === v) && !(ficam.length === 1 && ficam[0].valor + v === 2 * c)) ficam.push({ valor: v, tipo });
  }
  return ficam;
}

// Confere a reescrita. nova: { opcoes (textos), correta (posição), tipos (das 2 erradas), explicacao? }
function conferir(q, nova) {
  const p = [];
  if (nova.opcoes.length !== 3 || nova.correta < 0) return ['precisa de 3 opções, a certa com *'];
  const certa = nova.opcoes[nova.correta], erradas = nova.opcoes.filter((o, i) => i !== nova.correta);
  if (String(certa) !== String(certaDe(q))) p.push('a certa mudou (era ' + certaDe(q) + '): o ajuste só troca as erradas');
  if (new Set(nova.opcoes.map(o => String(o).toLowerCase())).size !== 3) p.push('opções repetidas');
  const c = numero(certa), e = erradas.map(numero), v = valores(q);
  if (simetrica(c, e)) p.push('certa no meio, à mesma distância das erradas');
  if (q.tipo === 'operacao' && e.some(x => x === null)) p.push('na conta, todas as opções são números');
  nova.tipos.forEach((t, i) => {
    if (!TIPOS.includes(t) && t !== 'perto') return p.push('tipo {' + t + '} não existe; use: ' + TIPOS.join(', '));
    if (t === 'perto') { if (e[i] === null || Math.abs(e[i] - c) > PERTO) p.push(erradas[i] + ' não está perto (até ' + PERTO + ') da certa'); }
    else if (t in v) { if (e[i] !== v[t]) p.push(erradas[i] + ' não é {' + t + '} (daria ' + v[t] + ')'); }
    else if ((q.tipo === 'operacao' && contaDe(q)) || SO_CERTA.includes(t)) p.push('{' + t + '} não serve nesta questão');
  });
  if (nova.tipos[0] === nova.tipos[1]) p.push('as duas erradas são do mesmo tipo');
  const expl = nova.explicacao || q.explicacao;
  if (q.tipo !== 'operacao' && !String(expl).toLowerCase().includes(String(certa).toLowerCase())) p.push('a explicação não diz a certa');
  return p;
}

module.exports = { certaDe, contaDe, valores, motivos, sugerir, conferir, simetrica, TIPOS };
