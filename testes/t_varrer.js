// Teste guardado: varredura do código (build/varrer.js, Motor 9). Uso: node testes/t_varrer.js
// Monta uma pasta de mentira com um defeito de cada tipo e confere se cada aviso aparece,
// se o que é certo NÃO gera aviso, se --corrigir arruma os espaços e se os aceitos são pulados.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { analisar, corrigirEspacos } = require('../build/varrer-regras');
const { limpar } = require('../build/varrer-limpar');
const { varrer, listar } = require('../build/varrer');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
const codigos = (rel, texto, existe) => analisar(rel, texto, existe).map((a) => a.codigo);
const tem = (rel, texto, cod, existe) => ok(codigos(rel, texto, existe).includes(cod), `${cod} não achado em: ${texto.trim().slice(0, 60)}`);
const nao = (rel, texto, cod, existe) => ok(!codigos(rel, texto, existe).includes(cod), `${cod} achado sem motivo em: ${texto.trim().slice(0, 60)}`);

// 1. Limpador: apaga textos, comentários e regex, mantendo o tamanho.
const fonte = "const a = 'x == y'; // b == c\nconst r = /==/g; /* d == e */ const z = a === 1;\n";
ok(limpar(fonte).length === fonte.length, 'limpar mudou o tamanho');
ok(!/[^=]==[^=]/.test(limpar(fonte)), 'limpar deixou == de texto/comentário/regex');
ok(limpar(fonte, { textos: true }).includes("'x == y'") && !limpar(fonte, { textos: true }).includes('b == c'), 'opção textos');

// 2. Espaços.
tem('js/a.js', 'const a = 1; \n', 'espaco_no_fim');
tem('js/a.js', '\tconst a = 1;\n', 'tabulacao');
tem('js/a.js', 'a();\n\n\n\nb();\n', 'linhas_em_branco');
nao('js/a.js', 'a();\n\n\nb();\n', 'linhas_em_branco');
tem('js/a.js', 'a();', 'sem_quebra_final');
tem('js/a.js', 'a();\r\nb();\r\n', 'quebra_windows');
const sujo = '\tconst a = 1;   \r\n\n\n\n\nb();';
const limpo = corrigirEspacos(sujo);
ok(limpo === '  const a = 1;\n\n\nb();\n', 'corrigirEspacos: ' + JSON.stringify(limpo));
ok(codigos('js/a.js', limpo).length === 0, 'sobrou aviso depois de corrigir');

// 3. Sintaxe de JSON e CSS.
tem('build/fichas/x.json', '{"a": 1,}\n', 'json_invalido');
nao('build/fichas/x.json', '{"a": 1}\n', 'json_invalido');
tem('css/x.css', '.a { color: red;\n.b { color: blue; }\n', 'css_chaves');
tem('css/x.css', '.a { color: red; } }\n', 'css_chaves');
nao('css/x.css', '/* { */ .a { content: "}"; }\n', 'css_chaves');

// 4. Possíveis erros.
const existe = (rel) => rel === 'js/b.js';
tem('js/a.js', "import { x } from './c.js';\n", 'arquivo_inexistente', existe);
nao('js/a.js', "import { x } from './b.js';\n// require('./sumiu.js')\n", 'arquivo_inexistente', existe);
tem('index.html', '<script src="js/sumiu.js"></script>\n', 'arquivo_inexistente', existe);
nao('index.html', '<script src="js/b.js"></script><a href="https://x.com">x</a>\n', 'arquivo_inexistente', existe);
tem('js/a.js', 'if (a == 1) b();\n', 'igualdade_fraca');
tem('js/a.js', 'if (a != b) c();\n', 'igualdade_fraca');
nao('js/a.js', 'if (a === 1 && b !== 2 && c == null) d();\n', 'igualdade_fraca');
tem('js/a.js', 'if (a = 1) b();\n', 'atribuicao_no_if');
nao('js/a.js', 'if (a >= 1 && b <= 2 && c(() => 1)) d();\n', 'atribuicao_no_if');
tem('js/a.js', 'try { a(); } catch (e) {}\n', 'catch_vazio');
nao('js/a.js', 'try { a(); } catch (e) { /* sem armazenamento */ }\n', 'catch_vazio');
tem('js/a.js', "console.log('oi');\n", 'console_esquecido');
nao('build/a.js', "console.log('oi');\n", 'console_esquecido');
nao('js/a.js', "console.error('oi');\n", 'console_esquecido');
tem('js/a.js', "if (confirm('Apagar?')) a();\n", 'confirm_alert');
nao('js/a.js', "ctx.perguntar('Apagar?');\nconst o = { confirm() { return 1; } };\n", 'confirm_alert');
tem('js/a.js', 'function a() {}\nfunction a() {}\n', 'funcao_repetida');

// 5. Segurança.
tem('js/a.js', "eval('1+1');\n", 'codigo_dinamico');
tem('js/a.js', "new Function('return 1')();\n", 'codigo_dinamico');
tem('js/a.js', "setTimeout('a()', 10);\n", 'codigo_dinamico');
nao('js/a.js', 'setTimeout(() => a(), 10);\n', 'codigo_dinamico');
tem('js/a.js', 'caixa.innerHTML = texto;\n', 'html_cru');
tem('js/moldes/a.js', "const m = `<span v-html=\"x\"></span>`;\n", 'html_cru');
nao('js/a.js', "// usar v-html só com conteúdo fixo\nif (caixa.innerHTML === '') a();\n", 'html_cru');
tem('js/a.js', "document.write('x');\n", 'document_write');
tem('js/a.js', "const u = 'http://exemplo.com';\n", 'http_inseguro');
nao('build/a.js', "const ns = 'http://www.w3.org/2000/svg';\n", 'http_inseguro');
tem('index.html', '<a href="https://x.com" target="_blank">x</a>\n', 'blank_sem_rel');
nao('index.html', '<a href="https://x.com" target="_blank" rel="noopener">x</a>\n', 'blank_sem_rel');
tem('index.html', '<script src="https://cdn.x.com/vue.js"></script>\n', 'arquivo_de_fora');
tem('js/a.js', "const apiKey = 'abcd1234efgh5678';\n", 'segredo');
nao('js/a.js', "const senha = ctx.valor;\n", 'segredo');

// 6. Motor de ponta a ponta numa pasta de mentira: lista, aceitos e --corrigir.
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'varrer-'));
fs.mkdirSync(path.join(pasta, 'js'));
fs.mkdirSync(path.join(pasta, 'conteudo'));
fs.writeFileSync(path.join(pasta, 'js/a.js'), 'a(); \nif (b == 1) c();\n');
fs.writeFileSync(path.join(pasta, 'js/b.js'), 'caixa.innerHTML = x;\n');
fs.writeFileSync(path.join(pasta, 'conteudo/lp.js'), 'a == b; \n');
const ficha = { pastas: ['js', 'conteudo'], extensoes: ['.js'], fora: ['conteudo/'], graves: [], nomes: {}, aceitos: { 'js/b.js': ['html_cru'], 'js/a.js': ['igualdade_fraca@2'] } };
const lista = listar(pasta, ficha);
ok(lista.join() === 'js/a.js,js/b.js', 'listar: ' + lista.join());
const r1 = varrer(lista, { raiz: pasta, ficha });
ok(r1.avisos.map((a) => a.codigo).join() === 'espaco_no_fim', 'aceitos: ' + r1.avisos.map((a) => a.codigo).join());
const r2 = varrer(lista, { raiz: pasta, ficha, corrigir: true });
ok(r2.corrigidos === 1 && r2.avisos.length === 0, 'corrigir: ' + JSON.stringify(r2));
ok(fs.readFileSync(path.join(pasta, 'js/a.js'), 'utf8') === 'a();\nif (b == 1) c();\n', 'corrigir mudou mais que espaços');
fs.rmSync(pasta, { recursive: true, force: true });

// 6. Sobras: função, variável, classe e animação que ninguém usa (projeto inteiro de uma vez).
const { sobras } = require('../build/varrer-sobras');
const projeto = [
  { rel: 'js/a.js', texto: "function usada() {}\nfunction sobrou() {}\nconst lida = 1; const largada = 2; const { x, y: z } = LB;\nusada(lida, x);\n" },
  { rel: 'js/b.js', texto: "const molde = `<div class=\"ativa\" :class=\"'v' + valor\"></div>`;\nel.classList.add('tema-' + cor);\nLB.molde = molde;\n" },
  { rel: 'css/c.css', texto: '.ativa{a:b}\n.esquecida{a:b}\n.v5,.tema-azul{a:b}\n.do-conteudo{a:b}\n@media (max-width:9px){.dentro{a:b}}\n@keyframes gira{}\n@keyframes parada{}\n.ativa{animation:gira 1s}\n' },
];
const achou = sobras(projeto, ['<p class="do-conteudo">']).map((a) => `${a.codigo}:${a.nome}`).sort().join(' ');
ok(achou === 'animacao_sem_uso:parada classe_sem_uso:dentro classe_sem_uso:esquecida funcao_sem_uso:sobrou variavel_sem_uso:largada variavel_sem_uso:z', 'sobras: ' + achou);

console.log(falhas ? `${falhas} falha(s)` : 'OK: varredura (espaços, sintaxe, erros, segurança, aceitos, corrigir, sobras)');
process.exit(falhas ? 1 : 0);
