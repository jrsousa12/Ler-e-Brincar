// Motor de ajuste dos enunciados longos de Português (irmão do ajustar-lp.js): acha o enunciado acima do
// limite da ficha de qualidade (aviso texto_longo do conferir.js) e monta a folha; depois de reescrita, confere e grava.
// Uso:
//   node build/ajustar-enunciado.js [lp-245 ...] [--folha arq.txt]   → acha e monta a folha
//        (padrão build/revisao/enunciado-revisao.txt; sem ids = todos os itens de Português)
//   node build/ajustar-enunciado.js --aplicar <folha.txt> [--gravar]  → confere; --gravar grava
// Linha da folha: lp-245 | texto=texto lido mais curto | pergunta=... | explicacao=...
//   (enunciado "Leia: "texto" pergunta"; pergunta e explicacao só se mudarem; sem "Leia:", use enunciado=...)
// Confere: cabe no limite; as palavras da certa que estavam no texto continuam nele; cada opção tirada
// do texto continua no texto; trechos entre aspas da explicação continuam no texto (ou nova explicacao=).
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const { achar, todos } = require('./item');
const L = require('./fichas/qualidade.json').limites; // mesmos limites do conferir.js
const vazias = new Set(require('./fichas/ajustar.json').vazias);

const pastaRev = () => process.env.REVISAO_RAIZ || path.join(__dirname, 'revisao');
const limite = q => (q.nivel === 1 ? L.enunciado_nivel1 : L.enunciado);
const minusc = s => String(s).toLocaleLowerCase('pt-BR');
const limpo = s => minusc(s).replace(/[.!?…]+$/, '').trim();
const palavras = s => (minusc(s).match(/[\p{L}]+/gu) || []).filter(p => p.length >= 4 && !vazias.has(p));
const raiz = p => p.slice(0, 4); // "chegou" e "chegar" contam como a mesma palavra

// "Leia: "texto" pergunta" → { texto, pergunta }; sem esse jeito → null
function partes(enunciado) {
  const m = String(enunciado || '').match(/^Leia:\s*"([^"]+)"\s*(.*)$/s);
  return m ? { texto: m[1], pergunta: m[2] } : null;
}
const montar = (texto, pergunta) => 'Leia: "' + texto + '" ' + pergunta;

function lerLinha(l) {
  const campos = l.split('|').map(s => s.trim());
  const n = { id: campos.shift() };
  for (const c of campos) { const m = c.match(/^(\w+)=(.*)$/s); if (m) n[m[1]] = m[2].trim(); }
  return n;
}

// Confere o enunciado novo de q. Devolve a lista de erros (vazia = aceito)
function conferir(q, novo, explicacao) {
  const e = [];
  const lim = limite(q);
  if (novo.length > lim) e.push('enunciado com ' + novo.length + ' letras (até ' + lim + ')');
  const a = partes(q.enunciado), d = partes(novo);
  if (a && !d) e.push('perdeu o jeito Leia: "texto" pergunta');
  const velho = a ? a.texto : q.enunciado, atual = d ? d.texto : novo;
  const temNovo = new Set(palavras(atual).map(raiz)), temVelho = new Set(palavras(velho).map(raiz));
  if (Array.isArray(q.opcoes) && typeof q.correta === 'number') {
    const certa = String(q.opcoes[q.correta]);
    const sumiu = [...new Set(palavras(certa).filter(p => temVelho.has(raiz(p)) && !temNovo.has(raiz(p))))];
    if (sumiu.length) e.push('a pista da certa sumiu do texto: ' + sumiu.join(', '));
    q.opcoes.forEach(o => {
      const t = limpo(o);
      if (t && minusc(velho).includes(t) && !minusc(atual).includes(t)) e.push('a opção "' + o + '" estava no texto e sumiu');
    });
  }
  const exp = explicacao || q.explicacao || '';
  for (const [, trecho] of exp.matchAll(/["“']([^"”']{3,})["”']/g))
    if (minusc(velho).includes(minusc(trecho)) && !minusc(atual).includes(minusc(trecho))) e.push('a explicação cita "' + trecho + '", que saiu do texto (mande explicacao=)');
  if (explicacao && explicacao.length > L.explicacao) e.push('explicação com ' + explicacao.length + ' letras (até ' + L.explicacao + ')');
  return e;
}

function bloco(q) {
  const p = partes(q.enunciado), lim = limite(q);
  const ops = (q.opcoes || []).map((o, i) => (i === q.correta ? '*' : '') + o).join(' | ');
  const cab = ['# ' + q.id + ' · nível ' + q.nivel + ' · enunciado com ' + q.enunciado.length + ' letras (até ' + lim + ')' +
    (p ? ' · texto até ' + (lim - montar('', p.pergunta).length) + ' letras com esta pergunta' : ''),
  '# opções: ' + ops, '# explicação: ' + (q.explicacao || '')];
  return [...cab, q.id + ' | ' + (p ? 'texto=' + p.texto + ' | pergunta=' + p.pergunta : 'enunciado=' + q.enunciado), ''].join('\n');
}

function montarFolha(pedidos, arq) {
  const blocos = todos().filter(x => x.nome === 'lp' && (!pedidos.length || pedidos.includes(x.id)))
    .map(x => achar(x.id).item).filter(q => (q.enunciado || '').length > limite(q)).map(bloco);
  if (!blocos.length) { console.log('Nenhum enunciado precisa de ajuste.'); return 0; }
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, '# Folha dos enunciados longos (build/ajustar-enunciado.js). Encurte o texto= de cada item com outras palavras,\n# mantendo a pista da certa e as palavras das opções. Depois: node build/ajustar-enunciado.js --aplicar ' + path.relative(process.cwd(), arq) + '\n\n' + blocos.join('\n'));
  console.log(blocos.length + ' enunciado(s) precisam de ajuste → ' + path.relative(process.cwd(), arq));
  return 0;
}

function aplicar(arq, gravar) {
  const linhas = fs.readFileSync(arq, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));
  const prontos = [], erros = [];
  for (const l of linhas) {
    const n = lerLinha(l);
    let q;
    try { q = achar(n.id).item; } catch (e) { erros.push(n.id + ': não existe'); continue; }
    const p = partes(q.enunciado);
    const novo = n.enunciado || (n.texto && montar(n.texto, n.pergunta || (p ? p.pergunta : '')));
    if (!novo) { erros.push(n.id + ': falta texto= (ou enunciado=)'); continue; }
    if ((n.texto || '').includes('"')) { erros.push(n.id + ': aspas dentro do texto: use aspas simples'); continue; }
    const e = conferir(q, novo, n.explicacao);
    if (e.length) { erros.push(n.id + ': ' + e.join('; ')); continue; }
    prontos.push({ n, novo });
  }
  erros.forEach(l => console.log('RECUSADO ' + l));
  prontos.forEach(({ n, novo }) => console.log('ok ' + n.id + ': ' + novo.length + ' letras'));
  if (gravar && !erros.length) {
    const reg = [];
    for (const { n, novo } of prontos) {
      const r0 = achar(n.id); // relê: o arquivo muda a cada item gravado
      const antes = { enunciado: r0.item.enunciado, explicacao: r0.item.explicacao };
      Object.assign(r0.item, { enunciado: novo }, n.explicacao ? { explicacao: n.explicacao } : {});
      r0.linhas[r0.i] = escrever(r0.item) + (/,\s*$/.test(r0.linhas[r0.i]) ? ',' : '');
      fs.writeFileSync(r0.arquivo, r0.linhas.join('\n'));
      reg.push(JSON.stringify({ data: new Date().toISOString().slice(0, 10), id: n.id, ajuste: 'enunciado', antes, depois: { enunciado: novo, explicacao: r0.item.explicacao } }));
    }
    fs.mkdirSync(pastaRev(), { recursive: true });
    if (reg.length) fs.appendFileSync(path.join(pastaRev(), 'registro.jsonl'), reg.join('\n') + '\n');
  }
  console.log(prontos.length + ' aceito(s), ' + erros.length + ' recusado(s)' + (gravar ? (erros.length ? ' · nada gravado: corrija os recusados' : ' · gravado e anotado em build/revisao/registro.jsonl. Agora: node build/validar.js') : ' (prévia; use --gravar)'));
  return erros.length ? 1 : 0;
}

function principal(argv) {
  const args = [...argv];
  const iF = args.indexOf('--folha');
  const folha = iF >= 0 ? args.splice(iF, 2)[1] : path.join(pastaRev(), 'enunciado-revisao.txt');
  const iA = args.indexOf('--aplicar');
  if (iA >= 0) { const arq = args[iA + 1]; if (!arq) { console.log('Diga a folha: --aplicar <folha.txt>'); return 1; } return aplicar(arq, args.includes('--gravar')); }
  return montarFolha(args.filter(a => !a.startsWith('--')), folha);
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { principal, conferir, partes, lerLinha };
