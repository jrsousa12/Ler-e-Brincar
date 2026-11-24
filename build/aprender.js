// Motor que aprende as peças dos desenhos de colorir: lê os lotes aprovados do Gemini
// (build/pedidos/colorir-gemini-<n>.js) e gera a biblioteca build/pecas/aprendidas.js (nunca editar à mão).
// Uso: node build/aprender.js              regrava a biblioteca e atualiza PECAS.md (biblioteca.js)
//      node build/aprender.js --conferir   falha se a biblioteca estiver desatualizada
// Cada <g data-peca="nome"> vira uma peça, no lugar em que foi desenhada. Mesmo nome com outro formato
// em outro desenho ganha número (bochecha2). A cópia repetida no mesmo desenho (2ª orelha) é só o outro lado.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const pastaPedidos = path.join(__dirname, 'pedidos');
const saida = path.join(__dirname, 'pecas/aprendidas.js');

function lotes() {
  return fs.readdirSync(pastaPedidos).map(a => a.match(/^colorir-gemini-(\d+)\.js$/)).filter(Boolean)
    .sort((a, b) => a[1] - b[1]).map(m => path.join(pastaPedidos, m[0]));
}

// Ponto de encaixe: o meio da caixa que cerca os números da peça.
function ancora(svg) {
  const xs = [], ys = [];
  const par = (x, y) => { xs.push(+x); ys.push(+y); };
  for (const [, d] of svg.matchAll(/ d="([^"]+)"/g)) {
    const n = d.match(/-?[\d.]+/g) || [];
    for (let i = 0; i + 1 < n.length; i += 2) par(n[i], n[i + 1]);
  }
  for (const [t] of svg.matchAll(/<(circle|ellipse)\b[^>]*>/g)) {
    const v = k => +((t.match(new RegExp(' ' + k + '="([\\d.-]+)"')) || [0, 0])[1]);
    const rx = v('r') || v('rx'), ry = v('r') || v('ry');
    par(v('cx') - rx, v('cy') - ry); par(v('cx') + rx, v('cy') + ry);
  }
  for (const [t] of svg.matchAll(/<rect\b[^>]*>/g)) {
    const v = k => +((t.match(new RegExp(' ' + k + '="([\\d.-]+)"')) || [0, 0])[1]);
    par(v('x'), v('y')); par(v('x') + v('width'), v('y') + v('height'));
  }
  const meio = l => Math.round((Math.min(...l) + Math.max(...l)) / 2);
  return xs.length ? [meio(xs), meio(ys)] : [150, 150];
}

// Junta as peças de todos os lotes, na ordem dos lotes e dos desenhos.
function aprender() {
  const pecas = [], porNome = {};
  for (const arq of lotes()) {
    delete require.cache[require.resolve(arq)];
    for (const d of require(arq)) {
      const vistos = new Set();
      for (const [, nome, miolo] of d.svg.matchAll(/<g data-peca="([^"]+)">(.*?)<\/g>/g)) {
        if (vistos.has(nome)) continue;
        vistos.add(nome);
        const iguais = porNome[nome] || (porNome[nome] = []);
        if (iguais.some(p => p.desenho === miolo)) continue;
        const nomeFinal = iguais.length ? nome + (iguais.length + 1) : nome;
        const p = { nome: nomeFinal, descricao: `parte "${nome}" do desenho ${d.id} (${path.basename(arq, '.js')})`, ancora: ancora(miolo), desenho: miolo };
        iguais.push(p);
        pecas.push(p);
      }
    }
  }
  return pecas;
}

function texto(pecas) {
  const linhas = pecas.map(p => `  { nome: ${JSON.stringify(p.nome)}, descricao: ${JSON.stringify(p.descricao)}, ancora: [${p.ancora}],\n` +
    `    desenho: () => ${JSON.stringify(p.desenho)} }`);
  return '// GERADO por node build/aprender.js a partir de build/pedidos/colorir-gemini-*.js. Não editar à mão.\n' +
    "'use strict';\nconst tema = 'aprendidas';\n\nmodule.exports = [\n" + linhas.join(',\n') + '\n].map(p => Object.assign(p, { tema }));\n';
}

function principal(args) {
  const pecas = aprender(), novo = texto(pecas);
  const atual = fs.existsSync(saida) ? fs.readFileSync(saida, 'utf8') : '';
  if (args.includes('--conferir')) {
    console.log(atual === novo ? `Biblioteca em dia (${pecas.length} peças).` : 'Biblioteca desatualizada: rode node build/aprender.js');
    return atual === novo ? 0 : 1;
  }
  fs.writeFileSync(saida, novo);
  console.log(`Aprendidas ${pecas.length} peças de ${lotes().length} lote(s): build/pecas/aprendidas.js`);
  if (!args.includes('--sem-lista')) console.log(execFileSync('node', [path.join(__dirname, 'biblioteca.js')], { encoding: 'utf8' }).trim());
  return 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { aprender, ancora, texto };
