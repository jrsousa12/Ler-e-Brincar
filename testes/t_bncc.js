// Teste guardado: motor da BNCC (build/bncc.js + build/bncc-regras.js + build/fichas/bncc.json).
// Uso: node testes/t_bncc.js. Confere regras com itens de exemplo e corrige uma cópia do conteúdo.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const raiz = path.join(__dirname, '..');
const R = require('../build/bncc-regras');
const ficha = require('../build/fichas/bncc.json');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// Ficha: textos oficiais e regras só com códigos que existem
ok(Object.keys(ficha.oficial).length > 300, 'ficha tem os textos oficiais');
ok(/^Inferir informações implícitas/.test(R.texto('EF35LP04')), 'texto oficial do EF35LP04');
for (const [ar, regras] of Object.entries(ficha.regras)) regras.forEach(r => ok(R.valido(r.bncc, ar), `regra "${r.nome}" com código válido`));
ok(R.valido('EF02MA06', 'mat') && !R.valido('EF02MA06', 'lp') && !R.valido('EF99LP01', 'lp'), 'valido() olha área e lista');

// Regras com itens de exemplo
const lp = (titulo, enunciado = '', explicacao = '') => ({ id: 'lp-900', materia: 'lingua-portuguesa', habilidadeBNCC: 'EF02LP03', titulo, enunciado, explicacao });
const mat = (titulo, enunciado, tipo = 'operacao') => ({ id: 'mat-900', materia: 'matematica', habilidadeBNCC: 'EF02MA06', titulo, enunciado, tipo });
const casos = [
  [lp('R ou RR'), 'EF03LP01'], [lp('Acento'), 'EF03LP04'], [lp('Sinônimo'), 'EF02LP10'], [lp('Ordem alfabética'), 'EF01LP10'],
  [lp('Palavra no texto', 'Leia: "O ninho caiu." Qual palavra do texto tem o dígrafo "nh"?'), 'EF03LP03'],
  [lp('Palavra no texto', 'Leia: "A bruxa riu." Qual palavra começa com o encontro consonantal "br"?'), 'EF02LP04'],
  [lp('Palavra no texto', 'Leia: "O sofá." Qual palavra é oxítona?'), 'EF03LP06'],
  [mat('Divisão', 'Quanto é 10 ÷ 2?'), 'EF03MA08'], [mat('Dobro', 'Quanto é 5 × 2?'), 'EF02MA08'],
  [mat('Problema', 'Ana tinha 9 balas e deu 4. Quantas sobraram?'), 'EF02MA06'], [mat('Somando', 'Quanto é 4 + 3?'), 'EF02MA05'],
  [mat('Problema', 'Cada caixa tem 4 lápis. Quantos há em 2 caixas?'), 'EF03MA07'], [mat('Sucessor', 'Qual vem depois do 9?', 'multipla'), 'EF02MA01'],
];
for (const [item, esperado] of casos) ok(R.certo(item).bncc === esperado, `${item.titulo} (${item.enunciado.slice(0, 30)}) → ${esperado}, veio ${R.certo(item).bncc}`);
ok(R.certo(lp('Interpretação')).bncc === 'EF02LP03', 'sem regra: mantém o código');
ok(R.certo(Object.assign(lp('Pistas'), { habilidadeBNCC: 'EF15LP04' })).bncc === 'EF35LP04', 'troca fixa EF15LP04 → EF35LP04');
ok(R.trocarLista(['EF02LP26', 'EF15LP04']).join() === 'EF02LP26,EF35LP04', 'histórias: troca fixa na lista');

// Motor numa cópia: estraga dois itens, prévia não muda nada, --gravar conserta só eles
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'bncc-'));
const nomes = ['historias', 'lp', 'mat', 'colorir', 'silabas', 'ordem'];
for (const n of nomes) fs.copyFileSync(path.join(raiz, 'conteudo', n + '.js'), path.join(pasta, n + '.js'));
const env = { ...process.env, CONTEUDO_RAIZ: pasta };
const rodar = (prog, ...a) => spawnSync('node', [path.join(raiz, prog), ...a], { env, encoding: 'utf8' });
const original = fs.readFileSync(path.join(pasta, 'mat.js'), 'utf8');
rodar('build/item.js', 'mat-022', 'habilidadeBNCC=EF03MA06');
rodar('build/item.js', 'historia-01', 'habilidadesBNCC:=["EF02LP26","EF15LP04"]');
const estragado = fs.readFileSync(path.join(pasta, 'mat.js'), 'utf8');
const revisao = path.join(raiz, 'build/revisao/bncc.txt');
const antes = fs.existsSync(revisao) ? fs.readFileSync(revisao, 'utf8') : null;
const p = rodar('build/bncc.js');
ok(/2 itens a trocar/.test(p.stdout), 'prévia acha os 2 itens estragados: ' + p.stdout.trim().split('\n').pop());
ok(fs.readFileSync(path.join(pasta, 'mat.js'), 'utf8') === estragado, 'prévia não grava');
const g = rodar('build/bncc.js', '--gravar');
ok(/Gravado: 2 itens/.test(g.stdout), '--gravar aplica');
ok(fs.readFileSync(path.join(pasta, 'mat.js'), 'utf8') === original, 'mat.js voltou igual ao original');
ok(/tudo certo/.test(rodar('build/bncc.js').stdout), 'depois de gravar: nada a trocar');
if (antes === null) fs.rmSync(revisao, { force: true }); else fs.writeFileSync(revisao, antes);
fs.rmSync(pasta, { recursive: true, force: true });

console.log(falhas ? `t_bncc: ${falhas} falha(s)` : 't_bncc: OK');
process.exit(falhas ? 1 : 0);
