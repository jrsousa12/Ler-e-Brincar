// Motor da BNCC: confere se o código de cada item combina com a atividade e corrige.
// Uso:
//   node build/bncc.js            prévia: resumo "de → para" e lista em build/revisao/bncc.txt
//   node build/bncc.js --gravar   aplica as trocas (só o campo do código muda)
//   node build/bncc.js --codigos  lista os códigos usados, com o texto oficial
// Regras e textos oficiais: build/fichas/bncc.json. CONTEUDO_RAIZ=pasta troca a pasta (teste).
'use strict';
const fs = require('fs');
const path = require('path');
const { todos } = require('./item');
const escrever = require('./escrever');
const R = require('./bncc-regras');
const ler = l => new Function('return ' + l.replace(/,\s*$/, ''))();

// Lista de mudanças: { r (linha do item), item, de, para, regra }
function mudancas() {
  const lista = [];
  for (const r of todos()) {
    if (!['lp', 'mat', 'historias'].includes(r.nome)) continue;
    const item = ler(r.linhas[r.i]);
    if (r.nome === 'historias') {
      const para = R.trocarLista(item.habilidadesBNCC);
      if (para.join() !== item.habilidadesBNCC.join()) lista.push({ r, item, de: item.habilidadesBNCC.join(','), para, regra: 'troca fixa' });
      continue;
    }
    const c = R.certo(item);
    if (c.bncc !== item.habilidadeBNCC) lista.push({ r, item, de: item.habilidadeBNCC, para: c.bncc, regra: c.regra });
  }
  return lista;
}

function gravar(lista) {
  const arquivos = new Map();
  for (const m of lista) {
    const campo = m.r.nome === 'historias' ? 'habilidadesBNCC' : 'habilidadeBNCC';
    m.item[campo] = m.para;
    const fim = /,\s*$/.test(m.r.linhas[m.r.i]) ? ',' : '';
    m.r.linhas[m.r.i] = escrever(m.item) + fim;
    arquivos.set(m.r.arquivo, m.r.linhas);
  }
  for (const [arq, linhas] of arquivos) fs.writeFileSync(arq, linhas.join('\n'));
  return arquivos.size;
}

function relatorio(lista) {
  const grupos = {};
  for (const m of lista) {
    const k = `${m.de} → ${[].concat(m.para).join(',')}`;
    (grupos[k] = grupos[k] || []).push(m);
  }
  const linhas = ['# Correções de BNCC (prévia de node build/bncc.js)', ''];
  for (const [k, ms] of Object.entries(grupos)) {
    const para = [].concat(ms[0].para)[0];
    linhas.push(`## ${k} (${ms.length}) — ${R.texto(para)}`);
    ms.forEach(m => linhas.push(`- ${m.item.id} ${m.item.titulo} [${m.regra}]`));
    linhas.push('');
  }
  return { grupos, texto: linhas.join('\n') };
}

function codigos() {
  const uso = {};
  for (const r of todos()) {
    if (!['lp', 'mat', 'historias'].includes(r.nome)) continue;
    const it = ler(r.linhas[r.i]);
    [].concat(it.habilidadesBNCC || it.habilidadeBNCC).forEach(c => { uso[c] = (uso[c] || 0) + 1; });
  }
  Object.keys(uso).sort().forEach(c => console.log(`${c} (${uso[c]}) ${R.texto(c) || '!! código fora da BNCC'}`));
}

function principal(args) {
  if (args.includes('--codigos')) return codigos();
  const lista = mudancas();
  if (!lista.length) return console.log('BNCC: tudo certo, nenhuma troca.');
  const { grupos, texto } = relatorio(lista);
  for (const [k, ms] of Object.entries(grupos)) console.log(`${String(ms.length).padStart(4)}  ${k}`);
  if (args.includes('--gravar')) {
    const n = gravar(lista);
    console.log(`Gravado: ${lista.length} itens em ${n} arquivo(s). Agora: node build/validar.js e node build/catalogo.js`);
  } else {
    const destino = path.join(__dirname, 'revisao', 'bncc.txt');
    fs.writeFileSync(destino, texto);
    console.log(`${lista.length} itens a trocar. Lista: build/revisao/bncc.txt. Para aplicar: --gravar`);
  }
}

if (require.main === module) principal(process.argv.slice(2));
module.exports = { mudancas, gravar };
