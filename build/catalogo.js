// Catálogo (motor 5): gera CATALOGO.md com o que já existe (conteúdo e código), para achar sem abrir arquivos.
// Uso: node build/catalogo.js (grava e resume) · --conferir (só confere se está em dia; falha se não estiver)
// Gerado automático: nunca editar CATALOGO.md à mão. CATALOGO_SAIDA=arquivo troca o destino (testes).
'use strict';
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const LB = require('./carregar')();
const saida = process.env.CATALOGO_SAIDA || path.join(raiz, 'CATALOGO.md');

const num = id => +String(id).split('-').pop();
const proximo = (lista, prefixo) => {
  const n = Math.max(0, ...lista.map(i => num(i.id))) + 1;
  return prefixo + '-' + String(n).padStart(prefixo === 'lp' || prefixo === 'mat' ? 3 : 2, '0');
};

function resumo() {
  const areas = [['historias', 'historia', 'Histórias'], ['lp', 'lp', 'Português'], ['mat', 'mat', 'Matemática'], ['colorir', 'colorir', 'Colorir']];
  const l = ['| Área | Itens | Próximo id livre |', '|---|---|---|'];
  for (const [chave, pre, nome] of areas) l.push(`| ${nome} | ${LB[chave].length} | \`${proximo(LB[chave], pre)}\` |`);
  return l;
}

// Português e Matemática: por habilidade da BNCC × nível, com os ids e títulos.
function porHabilidade(lista) {
  const grupos = {};
  for (const i of lista) (grupos[i.habilidadeBNCC] = grupos[i.habilidadeBNCC] || []).push(i);
  const l = ['| Habilidade | Nível 1 | Nível 2 | Nível 3 | Total | Tipos |', '|---|---|---|---|---|---|'];
  const itens = [];
  for (const hab of Object.keys(grupos).sort()) {
    const g = grupos[hab], n = k => g.filter(i => i.nivel === k).length || '·';
    const tipos = [...new Set(g.map(i => i.tipo))].join(', ');
    l.push(`| ${hab} | ${n(1)} | ${n(2)} | ${n(3)} | ${g.length} | ${tipos} |`);
    itens.push(`- **${hab}**: ` + g.map(i => `${i.id} ${i.titulo} (n${i.nivel})`).join(' · '));
  }
  return [...l, '', ...itens];
}

const historias = () => LB.historias.map(h =>
  `- ${h.id} ${h.emoji || ''} ${h.titulo} — nível ${h.nivel}, ${(h.perguntas || []).length} perguntas, ${(h.habilidadesBNCC || []).join(' ')}`);
const colorir = () => [LB.colorir.map(c => `${c.id} ${c.emoji || ''} ${c.titulo}`).join(' · ')];

// Código: cada arquivo, nº de linhas e a frase da 1ª linha (o comentário de cabeçalho).
function codigo() {
  const pastas = ['js', 'js/telas', 'js/moldes', 'build', 'testes'];
  const l = ['| Arquivo | Linhas | O que faz |', '|---|---|---|'];
  const arquivos = ['sw.js', ...pastas.flatMap(p => fs.readdirSync(path.join(raiz, p))
    .filter(f => f.endsWith('.js')).sort().map(f => p + '/' + f))];
  for (const f of arquivos) {
    const texto = fs.readFileSync(path.join(raiz, f), 'utf8');
    const linhas = texto.split('\n').length - (texto.endsWith('\n') ? 1 : 0);
    const frase = (texto.split('\n')[0].match(/^\/\/\s*(.*)/) || [, '(sem comentário no topo)'])[1].replace(/\|/g, '/');
    const marca = linhas > 300 ? ' ✖' : linhas > 200 ? ' ⚠' : '';
    l.push(`| \`${f}\` | ${linhas}${marca} | ${frase} |`);
  }
  return l;
}

function montar() {
  return [
    '# Catálogo do Ler & Brincar',
    '',
    '> Gerado por `node build/catalogo.js`. Não editar à mão. Para ver um item: `node build/item.js <id>`.',
    '',
    '## Resumo', '', ...resumo(), '',
    '## Português (por habilidade da BNCC)', '', ...porHabilidade(LB.lp), '',
    '## Matemática (por habilidade da BNCC)', '', ...porHabilidade(LB.mat), '',
    '## Histórias', '', ...historias(), '',
    '## Colorir', '', ...colorir(), '',
    '## Código (⚠ acima de 200 linhas · ✖ acima de 300)', '', ...codigo(), ''
  ].join('\n');
}

const novo = montar();
const atual = fs.existsSync(saida) ? fs.readFileSync(saida, 'utf8') : '';
if (process.argv.includes('--conferir')) {
  if (novo !== atual) { console.log('CATALOGO.md desatualizado: rode node build/catalogo.js'); process.exit(1); }
  console.log('CATALOGO.md em dia.');
} else {
  fs.writeFileSync(saida, novo);
  const n = k => LB[k].length;
  console.log(`CATALOGO.md ${novo === atual ? 'já estava em dia' : 'atualizado'}: ${n('historias')} histórias, ${n('lp')} LP, ${n('mat')} Mat, ${n('colorir')} desenhos; ${novo.split('\n').length} linhas.`);
}
