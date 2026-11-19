// Teste guardado: motor de item único (build/item.js). Uso: node testes/t_item.js
// Trabalha numa cópia de conteudo/: mostra, busca, altera, desfaz e confere que os arquivos voltaram iguais.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'item-'));
const nomes = ['historias', 'lp', 'mat', 'colorir'];
for (const n of nomes) fs.copyFileSync(path.join(raiz, 'conteudo', n + '.js'), path.join(pasta, n + '.js'));
const original = Object.fromEntries(nomes.map(n => [n, fs.readFileSync(path.join(pasta, n + '.js'), 'utf8')]));
const rodar = (...a) => {
  const r = spawnSync('node', [path.join(raiz, 'build/item.js'), ...a], { env: { ...process.env, CONTEUDO_RAIZ: pasta }, encoding: 'utf8' });
  return { cod: r.status, saida: r.stdout + r.stderr };
};
const linhaDe = (n, id) => fs.readFileSync(path.join(pasta, n + '.js'), 'utf8').split('\n').find(l => l.startsWith(`{id:'${id}'`));

// Mostrar: um item de cada arquivo, saída pequena (svg encurtado)
for (const id of ['historia-01', 'lp-001', 'mat-001', 'colorir-01']) {
  const r = rodar(id);
  ok(r.cod === 0 && r.saida.includes(id), 'mostrar ' + id);
  ok(r.saida.length < 3000, 'saída curta ' + id + ' (' + r.saida.length + ')');
}
ok(/letras\)/.test(rodar('colorir-01').saida), 'svg encurtado');
ok(rodar('colorir-01', '--inteiro').saida.includes('</svg>'), '--inteiro mostra tudo');
const c = rodar('colorir-01', '-c', 'titulo,emoji').saida;
ok(c.includes('titulo') && !c.includes('svg'), '-c mostra só os campos');
ok(rodar('nada-999').cod === 1, 'id inexistente falha');

// Busca
ok(/Total: [1-9]/.test(rodar('--busca', 'gato').saida), 'busca dá total');
ok(/Total: 0/.test(rodar('--busca', 'zzzxxq').saida), 'busca vazia');

// Alterar: texto, JSON, campo novo, caminho com pontos
const antes = linhaDe('mat', 'mat-001');
let r = rodar('mat-001', "explicacao=Conte com a 'mão'.", 'nivel:=2', 'dica=Use os dedos', 'apoioVisual.operador=x');
ok(r.cod === 0 && r.saida.includes('alterado'), 'alterar: ' + r.saida);
const it = new Function('return ' + linhaDe('mat', 'mat-001').replace(/,$/, ''))();
ok(it.explicacao === "Conte com a 'mão'." && it.nivel === 2 && it.dica === 'Use os dedos' && it.apoioVisual.operador === 'x', 'valores gravados');
ok(linhaDe('mat', 'mat-001').endsWith(','), 'vírgula do fim mantida');
r = rodar('historia-01', 'perguntas.0.correta:=0');
ok(r.cod === 0, 'caminho em lista');
ok(rodar('mat-001', 'id=mat-999').cod === 1, 'troca de id falha');
ok(rodar('mat-001', 'nivel:=[1,').cod === 1, 'JSON inválido falha');
ok(rodar('mat-001', 'mat-002', 'nivel:=1').cod === 1, 'dois ids ao alterar falha');
ok(rodar('mat-001', '-x', 'naoexiste').cod === 1, 'apagar campo inexistente falha');

// Desfazer e conferir que tudo voltou igual
const orig = n => new Function('LB', original[n] + ';return LB')({});
const o = orig('mat').mat[0], h = orig('historias').historias[0];
rodar('mat-001', '-x', 'dica', 'explicacao=' + o.explicacao, 'nivel:=' + o.nivel, 'apoioVisual.operador=' + o.apoioVisual.operador);
rodar('historia-01', 'perguntas.0.correta:=' + JSON.stringify(h.perguntas[0].correta));
ok(linhaDe('mat', 'mat-001') === antes, 'linha mat-001 voltou igual');
for (const n of nomes) ok(fs.readFileSync(path.join(pasta, n + '.js'), 'utf8') === original[n], n + '.js voltou idêntico');

fs.rmSync(pasta, { recursive: true, force: true });
console.log(falhas ? `t_item: ${falhas} falha(s)` : 't_item: OK');
process.exit(falhas ? 1 : 0);
