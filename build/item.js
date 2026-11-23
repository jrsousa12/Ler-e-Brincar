// Motor de item único: mostra, busca e altera um item de conteudo/*.js sem abrir o arquivo.
// Uso:
//   node build/item.js lp-037 [mat-001 ...]        mostra o(s) item(ns) (textos longos encurtados)
//   node build/item.js colorir-05 -c titulo,emoji  só os campos pedidos
//   node build/item.js lp-037 --inteiro            sem encurtar (cuidado: svg é enorme)
//   node build/item.js --busca "gato"              lista id + título dos itens com o texto, e o total
//   node build/item.js mat-012 explicacao="Conte nos dedos."   troca um texto
//   node build/item.js mat-012 nivel:=2 'opcoes:=[4,5,6]'      troca como JSON (número, lista...)
//   node build/item.js historia-03 perguntas.0.correta:=1      caminho com pontos entra em listas/objetos
//   node build/item.js lp-037 -x dica                          apaga um campo
// Só a linha do item muda; o resto do arquivo fica igual. Depois de alterar: node build/validar.js
// CONTEUDO_RAIZ=pasta troca a pasta do conteúdo (usado no teste).
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');
const raiz = path.join(__dirname, '..');
const ARQUIVOS = ['historias', 'lp', 'mat', 'colorir', 'silabas'];
const pasta = () => process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');
const ler = linha => new Function('return ' + linha.replace(/,\s*$/, ''))();

// Todos os itens: { id, arquivo, linhas, i, item }
function todos() {
  const lista = [];
  for (const nome of ARQUIVOS) {
    const arq = path.join(pasta(), nome + '.js');
    const linhas = fs.readFileSync(arq, 'utf8').split('\n');
    linhas.forEach((l, i) => {
      const m = l.match(/^\{id:'([^']+)'/);
      if (m) lista.push({ id: m[1], arquivo: arq, nome, linhas, i });
    });
  }
  return lista;
}
function achar(id) {
  const r = todos().find(x => x.id === id);
  if (!r) throw new Error('Item não encontrado: ' + id);
  r.item = ler(r.linhas[r.i]);
  return r;
}

// Encurta textos longos para mostrar
function encurtar(v) {
  if (typeof v === 'string' && v.length > 200) return v.slice(0, 120) + ` … (${v.length} letras)`;
  if (Array.isArray(v)) return v.map(encurtar);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, encurtar(x)]));
  return v;
}
function mostrar(ids, campos, inteiro) {
  for (const id of ids) {
    const { item, nome } = achar(id);
    let v = campos ? Object.fromEntries(campos.map(c => [c, item[c]])) : item;
    if (!inteiro) v = encurtar(v);
    console.log(`# ${id} (conteudo/${nome}.js)\n` + JSON.stringify(v, null, 1));
  }
}

function buscar(texto) {
  const t = texto.toLowerCase();
  const achados = todos().filter(x => x.linhas[x.i].toLowerCase().includes(t));
  for (const x of achados) {
    const it = ler(x.linhas[x.i]);
    console.log(x.id + ' · ' + String(it.titulo || it.enunciado || '').slice(0, 60));
  }
  console.log('Total: ' + achados.length);
}

// Troca ou apaga um valor por caminho com pontos (ex.: perguntas.0.correta)
function mexer(obj, caminho, valor, apagar) {
  const partes = caminho.split('.');
  let alvo = obj;
  for (const p of partes.slice(0, -1)) {
    if (alvo[p] === undefined || typeof alvo[p] !== 'object') throw new Error('Caminho não existe: ' + caminho);
    alvo = alvo[p];
  }
  const ult = partes[partes.length - 1];
  if (apagar) {
    if (!(ult in alvo)) throw new Error('Campo não existe: ' + caminho);
    if (Array.isArray(alvo)) alvo.splice(Number(ult), 1); else delete alvo[ult];
  } else alvo[ult] = valor;
}
function alterar(id, ordens) {
  const r = achar(id);
  const mudados = [];
  for (const o of ordens) {
    if (o.apagar) { mexer(r.item, o.campo, null, true); mudados.push('-' + o.campo); continue; }
    let valor = o.texto;
    if (o.json) {
      try { valor = JSON.parse(o.texto); } catch (e) { throw new Error(`Valor JSON inválido em ${o.campo}: ${o.texto}`); }
    }
    mexer(r.item, o.campo, valor, false);
    mudados.push(o.campo);
  }
  if (r.item.id !== id) throw new Error('Não é permitido trocar o id do item.');
  const fim = /,\s*$/.test(r.linhas[r.i]) ? ',' : '';
  r.linhas[r.i] = escrever(r.item) + fim;
  fs.writeFileSync(r.arquivo, r.linhas.join('\n'));
  console.log(`${id} alterado em conteudo/${r.nome}.js: ${mudados.join(', ')}. Agora: node build/validar.js`);
}

function principal(args) {
  if (!args.length || args.includes('-h')) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter(l => l.startsWith('//')).join('\n'));
    return 0;
  }
  const ids = [], ordens = [];
  let campos = null, inteiro = false;
  for (let k = 0; k < args.length; k++) {
    const a = args[k];
    if (a === '--busca') { buscar(args[++k] || ''); return 0; }
    if (a === '--inteiro') inteiro = true;
    else if (a === '-c') campos = (args[++k] || '').split(',').filter(Boolean);
    else if (a === '-x') ordens.push({ campo: args[++k], apagar: true });
    else {
      const m = a.match(/^([\w.]+)(:?=)([\s\S]*)$/);
      if (m) ordens.push({ campo: m[1], json: m[2] === ':=', texto: m[3] });
      else ids.push(a);
    }
  }
  if (!ids.length) throw new Error('Falta o id do item. Veja: node build/item.js -h');
  if (!ordens.length) { mostrar(ids, campos, inteiro); return 0; }
  if (ids.length > 1) throw new Error('Para alterar, use um item por vez.');
  alterar(ids[0], ordens);
  return 0;
}

if (require.main === module) {
  try { process.exit(principal(process.argv.slice(2))); }
  catch (e) { console.log('ERRO: ' + e.message); process.exit(1); }
}
module.exports = { achar, todos };
