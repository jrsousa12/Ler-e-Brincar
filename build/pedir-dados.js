// Dados do motor build/pedir.js: o que o app já tem e as escolhas automáticas (tema, série, níveis, lote).
// Lê o conteúdo com build/carregar.js (CONTEUDO_RAIZ troca a pasta, nos testes) e a ficha build/fichas/pedir.json.
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/pedir.json'), 'utf8'));
const pastaConteudo = () => process.env.CONTEUDO_RAIZ || path.join(raiz, 'conteudo');
const pastaPedidos = () => process.env.PEDIDOS_RAIZ || path.join(raiz, 'build/pedidos');

let cache;
const LB = () => cache || (cache = require('./carregar')());

// Ordem dos Fatos fica fora do carregar.js (usa window.LB)
function ordem() {
  const arq = path.join(pastaConteudo(), 'ordem.js');
  if (!fs.existsSync(arq)) return [];
  const w = { LB: {} };
  new Function('window', 'LB', fs.readFileSync(arq, 'utf8'))(w, w.LB);
  return w.LB.ordem || [];
}

// Conta quantos itens há por valor de um campo
function contar(lista, campo) {
  const c = {};
  for (const x of lista) c[x[campo]] = (c[x[campo]] || 0) + 1;
  return c;
}

// lp/mat: o tema da ficha com menos itens no app (só da série pedida, se houver)
function tema(tipo, op) {
  const lista = ficha.temas[tipo].filter(t => !op.serie || t.serie === op.serie);
  const n = contar(LB()[tipo], 'habilidadeBNCC');
  if (op.bncc) {
    const t = ficha.temas[tipo].find(x => x.bncc === op.bncc);
    if (!t) throw new Error('código ' + op.bncc + ' não está nos temas de ' + tipo + ' (build/fichas/pedir.json)');
    return { ...t, tem: n[t.bncc] || 0 };
  }
  if (!lista.length) throw new Error('nenhum tema de ' + tipo + ' da série ' + op.serie);
  const ordenados = lista.map(t => ({ ...t, tem: n[t.bncc] || 0 })).sort((a, b) => a.tem - b.tem);
  return ordenados[0];
}

// Divide a quantidade entre os 3 níveis, dando mais ao nível com menos itens
function repartir(qtd, porNivel) {
  const niveis = [1, 2, 3].sort((a, b) => (porNivel[a] || 0) - (porNivel[b] || 0));
  const p1 = Math.ceil(qtd * 0.4), p2 = Math.round((qtd - p1) / 2);
  const partes = [p1, p2, qtd - p1 - p2];
  return niveis.map((nv, i) => ({ nivel: nv, qtd: partes[i] })).filter(x => x.qtd > 0);
}

// Monte a Palavra: palavras que já existem e quantas pedir de cada tipo
function silabas(qtd) {
  const lista = LB().silabas;
  return { existem: lista.map(s => s.palavra), niveis: repartir(qtd, contar(lista, 'nivel')) };
}

// Histórias: títulos e o nível com menos histórias (série 3 para o nível 3)
function historias(op) {
  const lista = LB().historias;
  const n = contar(lista, 'nivel');
  const nivel = op.nivel || [3, 2, 1].sort((a, b) => (n[a] || 0) - (n[b] || 0))[0];
  return { existem: lista.map(h => h.titulo), nivel, serie: nivel >= 3 ? 3 : 2 };
}

// Brincadeiras que já existem (lidas dos botões da tela de atividades) e a matéria com menos
function brincadeiras() {
  const linhas = fs.readFileSync(path.join(raiz, 'js/moldes/atividades.js'), 'utf8').split('\n');
  const lista = [];
  let materia = '', dentroLP = false;
  for (const l of linhas) {
    if (l.includes('<template v-if="filtroMateria !== \'matematica\'">')) dentroLP = true;
    else if (dentroLP && l.includes('</template>')) dentroLP = false;
    if (l.includes('bloco-brincadeira')) {
      materia = l.includes("!== 'lingua-portuguesa'") ? 'mat' : (dentroLP || l.includes("!== 'matematica'")) ? 'lp' : '';
    }
    const m = l.match(/aria-hidden="true">([^<]+)<\/span>([^<]+)</);
    if (m) lista.push({ emoji: m[1], nome: m[2].trim(), materia });
  }
  const mat = lista.filter(b => b.materia === 'mat').length, lp = lista.filter(b => b.materia === 'lp').length;
  return { existem: lista, materia: mat <= lp ? 'mat' : 'lp' };
}

// Próximo nome de lote livre em build/pedidos (lote1, lote2...), olhando <tipo>-loteN.*
function proximoLote(tipo) {
  const pasta = pastaPedidos();
  const nums = fs.existsSync(pasta) ? fs.readdirSync(pasta)
    .map(f => f.match(new RegExp('^' + tipo + '-lote(\\d+)\\.'))).filter(Boolean).map(m => +m[1]) : [];
  return 'lote' + (Math.max(0, ...nums) + 1);
}

module.exports = { ficha, tema, silabas, historias, ordem, brincadeiras, proximoLote, repartir, pastaPedidos };
