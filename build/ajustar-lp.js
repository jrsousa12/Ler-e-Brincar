// Motor de ajuste de Português: acha a resposta certa comprida demais (a criança acerta só pelo
// tamanho) ou, em pergunta de "pista", presa a palavras fora do texto. NÃO corta: monta uma folha
// de revisão com o plano (tamanhos e distratores da série) e, depois de reescrita, confere e grava.
// Uso:
//   node build/ajustar-lp.js [lp-245..lp-314 | lp-250 ...] [--folha arq.txt]   → acha e monta a folha
//        (padrão build/revisao/lp-revisao.txt; sem ids = todo o Português)
//   node build/ajustar-lp.js --aplicar <folha.txt> [--gravar]   → confere a reescrita; --gravar grava
// Linha da folha: lp-245 | *certa curta | errada maior {contrario} | errada maior {trecho} | explicacao=...
// Tudo o que é gravado fica no registro build/revisao/registro.jsonl. Regras: build/ajustar-regras.js;
// fichas: build/fichas/ajustar.json e build/fichas/distratores.json.
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const { achar, todos } = require('./item');
const R = require('./ajustar-regras');
const pastaRev = () => process.env.REVISAO_RAIZ || path.join(__dirname, 'revisao');

// Ids: "lp-245..lp-314", ids soltos, ou nada (= todo o Português)
function idsPedidos(args) {
  const lp = todos().filter(x => x.nome === 'lp').map(x => x.id);
  if (!args.length) return lp;
  const num = id => +id.split('-').pop();
  return args.flatMap(a => {
    const m = a.match(/^(lp-\d+)\.\.(lp-\d+)$/);
    return m ? lp.filter(id => num(id) >= num(m[1]) && num(id) <= num(m[2])) : [a];
  });
}
const escolha = q => q.tipo === 'multipla' && Array.isArray(q.opcoes) && q.opcoes.length === 3 && typeof q.correta === 'number';

function bloco(q, m) {
  const p = R.plano(q);
  const s = R.serieDe(q.nivel);
  const ops = q.opcoes.map((o, i) => (i === q.correta ? '*' : '') + o + (i === q.correta ? '' : ' {?}'));
  return ['# ' + q.id + ' · ' + p.serie + ' · certa até ' + p.maxCerta + ' letras, com outras palavras (não cortar) · erradas de ' + p.erradas[0] + ' a ' + p.erradas[1] + ' letras (0,75 a 1,3 vezes a certa nova)',
    '# problema: ' + m.join('; '),
    '# texto: ' + (R.textoDe(q.enunciado) || '(sem texto)'),
    '# pergunta: ' + q.enunciado.replace(/^Leia:\s*"[^"]+"\s*/, ''),
    '# distratores do ' + p.serie + ' (um tipo diferente em cada errada): ' + p.tipos.map(t => t + ' = ' + s.tipos[t].como).join(' · '),
    q.id + ' | ' + ops.join(' | '), ''].join('\n');
}

function montarFolha(ids, arq) {
  const blocos = [];
  for (const id of ids) {
    const q = achar(id).item;
    if (!escolha(q)) continue;
    const m = R.motivos(q);
    if (m.length) blocos.push(bloco(q, m));
  }
  if (!blocos.length) { console.log('Nenhum item precisa de ajuste.'); return 0; }
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, '# Folha de revisão (build/ajustar-lp.js). Reescreva a linha de cada item: certa mais curta com outras\n# palavras, erradas maiores, cada errada com o {tipo} de distrator. Depois: node build/ajustar-lp.js --aplicar ' + path.relative(process.cwd(), arq) + '\n\n' + blocos.join('\n'));
  console.log(blocos.length + ' item(ns) precisam de ajuste → ' + path.relative(process.cwd(), arq));
  return 0;
}

// "lp-245 | *certa | errada {tipo} | errada {tipo} | explicacao=..." → { id, opcoes, correta, tipos, explicacao }
function lerLinha(l) {
  const campos = l.split('|').map(s => s.trim());
  const id = campos.shift();
  const extra = {};
  const ops = campos.filter(c => { const m = c.match(/^(\w+)=(.*)$/); if (m) extra[m[1]] = m[2].trim(); return !m; });
  const correta = ops.findIndex(o => o.startsWith('*'));
  const tipos = [];
  const opcoes = ops.map((o, i) => {
    if (i === correta) return o.replace(/^\*\s*/, '');
    const m = o.match(/\s*\{([\w?]+)\}$/);
    tipos.push(m ? m[1] : '');
    return m ? o.slice(0, m.index).trim() : o;
  });
  return { id, opcoes, correta, tipos, explicacao: extra.explicacao };
}

function aplicar(arq, gravar) {
  const linhas = fs.readFileSync(arq, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));
  const prontos = [], erros = [];
  for (const l of linhas) {
    const n = lerLinha(l);
    let r0;
    try { r0 = achar(n.id); } catch (e) { erros.push(n.id + ': não existe'); continue; }
    const q = r0.item;
    const nova = { certa: n.opcoes[n.correta], erradas: n.opcoes.filter((o, i) => i !== n.correta).map((t, i) => ({ texto: t, tipo: n.tipos[i] })) };
    const e = n.correta < 0 || n.opcoes.length !== 3 ? ['precisa de 3 opções, a certa com *'] : R.conferir(q, nova);
    if (e.length) { erros.push(n.id + ': ' + e.join('; ')); continue; }
    prontos.push({ r0, q, n });
  }
  erros.forEach(l => console.log('RECUSADO ' + l));
  prontos.forEach(({ q, n }) => console.log('ok ' + q.id + ': "' + n.opcoes[n.correta] + '" · erradas ' + n.tipos.join(' + ')));
  if (gravar && !erros.length) {
    const reg = [];
    for (const { q, n } of prontos) {
      const r0 = achar(q.id); // relê: o arquivo muda a cada item gravado
      const antes = { opcoes: r0.item.opcoes, correta: r0.item.correta };
      Object.assign(r0.item, { opcoes: n.opcoes, correta: n.correta }, n.explicacao ? { explicacao: n.explicacao } : {});
      r0.linhas[r0.i] = escrever(r0.item) + (/,\s*$/.test(r0.linhas[r0.i]) ? ',' : '');
      fs.writeFileSync(r0.arquivo, r0.linhas.join('\n'));
      reg.push(JSON.stringify({ data: new Date().toISOString().slice(0, 10), id: q.id, serie: R.serieDe(q.nivel).nome, antes, depois: { opcoes: n.opcoes, correta: n.correta }, tipos: n.tipos }));
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
  const folha = iF >= 0 ? args.splice(iF, 2)[1] : path.join(pastaRev(), 'lp-revisao.txt');
  const iA = args.indexOf('--aplicar');
  if (iA >= 0) { const arq = args[iA + 1]; if (!arq) { console.log('Diga a folha: --aplicar <folha.txt>'); return 1; } return aplicar(arq, args.includes('--gravar')); }
  return montarFolha(idsPedidos(args.filter(a => !a.startsWith('--'))), folha);
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { lerLinha, principal };
