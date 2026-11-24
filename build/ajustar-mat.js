// Motor de ajuste de Matemática: acha opções fracas (certa no meio à mesma distância das erradas,
// errada que não é erro de criança, errada longe, explicação sem a certa) e monta uma folha de
// revisão JÁ com a sugestão de erradas tiradas dos erros típicos; depois de revista, confere e grava.
// Nunca muda a resposta certa.
// Uso:
//   node build/ajustar-mat.js [mat-001..mat-050 | mat-005 ...] [--folha arq.txt]   → acha e monta a folha
//        (padrão build/revisao/mat-revisao.txt; sem ids = toda a Matemática)
//   node build/ajustar-mat.js --aplicar <folha.txt> [--gravar]   → confere a folha; --gravar grava
// Linha da folha: mat-005 | *9 | 8 {um_a_menos} | 11 {perto} | explicacao=...   ({?} = falta dizer o tipo)
// Tudo o que é gravado fica em build/revisao/registro.jsonl (ajuste "mat"). Regras: build/ajustar-mat-regras.js.
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const { achar, todos } = require('./item');
const { lerLinha } = require('./ajustar-lp');
const R = require('./ajustar-mat-regras');
const pastaRev = () => process.env.REVISAO_RAIZ || path.join(__dirname, 'revisao');

function idsPedidos(args) {
  const mat = todos().filter(x => x.nome === 'mat').map(x => x.id);
  if (!args.length) return mat;
  const num = id => +id.split('-').pop();
  return args.flatMap(a => {
    const m = a.match(/^(mat-\d+)\.\.(mat-\d+)$/);
    return m ? mat.filter(id => num(id) >= num(m[1]) && num(id) <= num(m[2])) : [a];
  });
}

// Tipos já conferidos de cada id (a última vez que o ajuste de Matemática gravou aquele item)
function tiposVistos() {
  const arq = path.join(pastaRev(), 'registro.jsonl'), vistos = {};
  if (!fs.existsSync(arq)) return vistos;
  for (const l of fs.readFileSync(arq, 'utf8').split('\n')) {
    if (!l.includes('"ajuste":"mat"')) continue;
    const r = JSON.parse(l);
    vistos[r.id] = r.tipos;
  }
  return vistos;
}

function bloco(q, m) {
  const certa = R.certaDe(q);
  const v = Object.entries(R.valores(q)).map(([t, x]) => t + '=' + x).join(', ');
  const sug = R.sugerir(q).map(x => x.valor + ' {' + x.tipo + '}');
  return ['# ' + q.id + ' · ' + q.enunciado + ' · opções agora: ' + q.opcoes.join(', '),
    '# problema: ' + m.join('; '),
    '# erros que dá para calcular: ' + (v || '(nenhum)') + ' · perto = até 3 da certa' + (q.tipo === 'operacao' ? '' : ' · também: trocou_ideia, contrario'),
    q.id + ' | *' + certa + ' | ' + sug.join(' | '), ''].join('\n');
}

function montarFolha(ids, arq) {
  const vistos = tiposVistos(), blocos = [];
  let revisar = 0;
  for (const id of ids) {
    const q = achar(id).item;
    if (!Array.isArray(q.opcoes) || q.opcoes.length !== 3) continue;
    const m = R.motivos(q, vistos[id]);
    if (!m.length) continue;
    const b = bloco(q, m);
    if (b.includes('{?}')) revisar++;
    blocos.push(b);
  }
  if (!blocos.length) { console.log('Nenhum item de Matemática precisa de ajuste.'); return 0; }
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, '# Folha de revisão (build/ajustar-mat.js). Cada linha já traz a sugestão de erradas; troque se quiser,\n# sem mudar a certa, e escreva o {tipo} onde estiver {?}. Depois: node build/ajustar-mat.js --aplicar ' + path.relative(process.cwd(), arq) + '\n\n' + blocos.join('\n'));
  console.log(blocos.length + ' item(ns) precisam de ajuste (' + revisar + ' com {?} para completar) → ' + path.relative(process.cwd(), arq));
  return 0;
}

function aplicar(arq, gravar) {
  const linhas = fs.readFileSync(arq, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));
  const prontos = [], erros = [];
  for (const l of linhas) {
    const n = lerLinha(l);
    let q;
    try { q = achar(n.id).item; } catch (e) { erros.push(n.id + ': não existe'); continue; }
    const e = R.conferir(q, n);
    if (e.length) { erros.push(n.id + ': ' + e.join('; ')); continue; }
    prontos.push({ q, n });
  }
  erros.forEach(l => console.log('RECUSADO ' + l));
  if (!gravar) prontos.forEach(({ q, n }) => console.log('ok ' + q.id + ': ' + n.opcoes.join(', ') + ' · erradas ' + n.tipos.join(' + ')));
  if (gravar && !erros.length) {
    const reg = [];
    for (const { q, n } of prontos) {
      const r0 = achar(q.id); // relê: o arquivo muda a cada item gravado
      const antes = { opcoes: r0.item.opcoes, correta: r0.item.correta };
      const depois = r0.item.tipo === 'operacao'
        ? { opcoes: n.opcoes.map(Number).sort((x, y) => x - y), correta: r0.item.correta }
        : { opcoes: n.opcoes, correta: typeof r0.item.correta === 'string' ? n.opcoes[n.correta] : n.correta };
      Object.assign(r0.item, depois, n.explicacao ? { explicacao: n.explicacao } : {});
      r0.linhas[r0.i] = escrever(r0.item) + (/,\s*$/.test(r0.linhas[r0.i]) ? ',' : '');
      fs.writeFileSync(r0.arquivo, r0.linhas.join('\n'));
      reg.push(JSON.stringify({ data: new Date().toISOString().slice(0, 10), id: q.id, ajuste: 'mat', antes, depois, tipos: n.tipos }));
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
  const folha = iF >= 0 ? args.splice(iF, 2)[1] : path.join(pastaRev(), 'mat-revisao.txt');
  const iA = args.indexOf('--aplicar');
  if (iA >= 0) { const arq = args[iA + 1]; if (!arq) { console.log('Diga a folha: --aplicar <folha.txt>'); return 1; } return aplicar(arq, args.includes('--gravar')); }
  return montarFolha(idsPedidos(args.filter(a => !a.startsWith('--'))), folha);
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { principal };
