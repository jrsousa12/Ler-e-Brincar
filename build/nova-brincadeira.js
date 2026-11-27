// Motor "brincadeira nova": cria os 5 arquivos de uma brincadeira e liga tudo no app, de uma vez.
// Uso:
//   node build/nova-brincadeira.js relogio "Que horas são?" 🕐 mat            → só mostra a prévia
//   node build/nova-brincadeira.js relogio "Que horas são?" 🕐 mat --gravar   → cria e liga
// id: só letras minúsculas sem acento (vira o nome dos arquivos); matéria: mat ou lp (diz em que filtro aparece).
// Cria: js/<id>regras.js (contas, com um EXEMPLO para trocar), js/telas/<id>.js (usa o kit js/rodada.js),
//       js/moldes/<id>.js, css/telas/<id>.css, testes/t_<id>.js.
// Liga: index.html, sw.js (lista + VERSAO), js/app.js, botão em js/moldes/atividades.js, build/fichas/etapas.json.
// Moldes dos arquivos: build/modelos/brincadeira.js. Teste do motor: testes/t_nova_brincadeira.js
'use strict';
const fs = require('fs');
const path = require('path');
const modelos = require('./modelos/brincadeira');
const raiz = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(raiz, f), 'utf8');

function parar(msg) { console.log('ERRO: ' + msg); process.exit(1); }

// Troca um trecho que precisa existir uma vez só (senão o arquivo mudou e o motor não arrisca).
function encaixar(texto, arquivo, ancora, novo) {
  const vezes = texto.split(ancora).length - 1;
  if (vezes !== 1) parar(`em ${arquivo}, o ponto de encaixe aparece ${vezes} vez(es): ${JSON.stringify(ancora.slice(0, 60))}`);
  return texto.replace(ancora, () => novo);
}

function lerPedido(args) {
  const [id, nome, emoji, materia] = args.filter(a => !a.startsWith('--'));
  if (!id || !nome || !emoji || !materia) parar('faltou algo. Uso: node build/nova-brincadeira.js <id> "<Nome>" <emoji> <mat|lp> [--gravar]');
  if (!/^[a-z]{3,20}$/.test(id)) parar('o id deve ter só letras minúsculas sem acento (3 a 20), ex.: relogio');
  if (/['"`<>\\{}$]/.test(nome)) parar('o nome não pode ter aspas, < >, { } ou $');
  if (!['mat', 'lp'].includes(materia)) parar('a matéria deve ser mat ou lp');
  return { id, nome, emoji, materia, Cap: id[0].toUpperCase() + id.slice(1) };
}

// Arquivos novos: caminho → texto.
function arquivosNovos(b) {
  return {
    [`js/${b.id}regras.js`]: modelos.regras(b),
    [`js/telas/${b.id}.js`]: modelos.tela(b),
    [`js/moldes/${b.id}.js`]: modelos.molde(b),
    [`css/telas/${b.id}.css`]: modelos.css(b),
    [`testes/t_${b.id}.js`]: modelos.teste(b)
  };
}

// Arquivos existentes já com as ligações: caminho → texto novo.
function ligacoes(b) {
  const saida = {};

  let html = ler('index.html');
  html = encaixar(html, 'index.html', '<link rel="stylesheet" href="css/tema-creme.css">', `<link rel="stylesheet" href="css/telas/${b.id}.css">\n<link rel="stylesheet" href="css/tema-creme.css">`);
  html = encaixar(html, 'index.html', '<script src="js/telas/selos.js"></script>', `<script src="js/${b.id}regras.js"></script>\n<script src="js/telas/${b.id}.js"></script>\n<script src="js/telas/selos.js"></script>`);
  html = encaixar(html, 'index.html', '<script src="js/moldes/selos.js"></script>', `<script src="js/moldes/${b.id}.js"></script>\n<script src="js/moldes/selos.js"></script>`);
  saida['index.html'] = html;

  let sw = ler('sw.js');
  const versao = sw.match(/const VERSAO = 'lb-v(\d+)';/);
  if (!versao) parar('não achei a VERSAO em sw.js');
  sw = encaixar(sw, 'sw.js', versao[0], `const VERSAO = 'lb-v${Number(versao[1]) + 1}';`);
  sw = encaixar(sw, 'sw.js', "'css/tema-creme.css'", `'css/telas/${b.id}.css', 'css/tema-creme.css'`);
  sw = encaixar(sw, 'sw.js', "'js/telas/selos.js'", `'js/${b.id}regras.js', 'js/telas/${b.id}.js', 'js/moldes/${b.id}.js',\n  'js/telas/selos.js'`);
  saida['sw.js'] = sw;
  b.versao = 'lb-v' + (Number(versao[1]) + 1);

  let app = ler('js/app.js');
  app = encaixar(app, 'js/app.js', ' + m.colorir', ` + m.${b.id} + m.colorir`);
  app = encaixar(app, 'js/app.js', '        ...LB.usarSomFigura(ctx),\n', `        ...LB.usarSomFigura(ctx),\n        ...LB.usar${b.Cap}(ctx),\n`);
  saida['js/app.js'] = app;

  const filtro = b.materia === 'mat' ? "filtroMateria !== 'lingua-portuguesa'" : "filtroMateria !== 'matematica'";
  const cor = b.materia === 'mat' ? 'mercado' : 'ler';
  const botao = `        <button v-if="${filtro}" type="button" class="bloco-brincadeira ${cor}" @click="abrir${b.Cap}">\n` +
    `          <span class="bloco-emoji" aria-hidden="true">${b.emoji}</span>${b.nome}<span v-if="concluidos['${b.id}']" class="selo-feito">✓</span>\n` +
    '        </button>\n';
  const fimGrade = '      </div>\n      <h3 class="titulo-secao">Atividades</h3>';
  saida['js/moldes/atividades.js'] = encaixar(ler('js/moldes/atividades.js'), 'js/moldes/atividades.js', fimGrade, botao + fimGrade);

  const etapas = JSON.parse(ler('build/fichas/etapas.json'));
  const t = 't_' + b.id;
  etapas.etapas[t] = `testes/${t}.js`;
  if (!etapas.navegador.includes(t)) etapas.navegador.push(t);
  [`js/${b.id}regras.js`, `js/telas/${b.id}.js`, `js/moldes/${b.id}.js`, `css/telas/${b.id}.css`, `testes/${t}.js`].forEach(f => { etapas.mapa[f] = [t]; });
  ['js/moldes/atividades.js', 'js/rodada.js'].forEach(f => {
    if (etapas.mapa[f] && !etapas.mapa[f].includes(t)) etapas.mapa[f].push(t);
  });
  saida['build/fichas/etapas.json'] = JSON.stringify(etapas, null, 2) + '\n';
  return saida;
}

function principal() {
  const args = process.argv.slice(2);
  const b = lerPedido(args);
  const novos = arquivosNovos(b);
  const existentes = Object.keys(novos).filter(f => fs.existsSync(path.join(raiz, f)));
  if (existentes.length) parar('já existe: ' + existentes.join(', ') + ' (escolha outro id)');
  if (ler('js/app.js').includes(`LB.usar${b.Cap}(`)) parar(`js/app.js já usa LB.usar${b.Cap}`);
  const mudados = ligacoes(b);     // confere todos os encaixes antes de gravar qualquer coisa

  console.log(`Brincadeira ${b.emoji} "${b.nome}" (id ${b.id}, ${b.materia === 'mat' ? 'Matemática' : 'Português'})`);
  console.log('Cria:  ' + Object.keys(novos).join(', '));
  console.log('Liga:  ' + Object.keys(mudados).join(', ') + ` (sw.js → ${b.versao})`);
  if (!args.includes('--gravar')) { console.log('Prévia apenas. Para criar: acrescente --gravar'); return; }

  Object.entries({ ...novos, ...mudados }).forEach(([f, texto]) => {
    fs.mkdirSync(path.dirname(path.join(raiz, f)), { recursive: true });
    fs.writeFileSync(path.join(raiz, f), texto);
  });
  console.log('Gravado. Próximos passos:');
  console.log(`  1. Troque o EXEMPLO em js/${b.id}regras.js pelas contas de verdade (e o visual em js/moldes/${b.id}.js e css/telas/${b.id}.css)`);
  console.log(`  2. node testes/t_${b.id}.js   3. node build/catalogo.js   4. node build/tudo.js`);
}

principal();
