// Teste guardado: motor build/nova-brincadeira.js. Trabalha numa cópia temporária do projeto (a pasta real não muda).
// Uso: node testes/t_nova_brincadeira.js
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const raiz = path.join(__dirname, '..');

let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const copia = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-nova-'));
const fora = ['.git', 'previas', 'node_modules'];
fs.cpSync(raiz, copia, { recursive: true, filter: f => !fora.includes(path.basename(f)) });
const ler = f => fs.readFileSync(path.join(copia, f), 'utf8');
const rodar = (...args) => {
  const r = spawnSync('node', args, { cwd: copia, encoding: 'utf8' });
  return { cod: r.status, saida: (r.stdout || '') + (r.stderr || '') };
};
const motor = (...a) => rodar('build/nova-brincadeira.js', ...a);
const versao = () => Number(ler('sw.js').match(/lb-v(\d+)/)[1]);

try {
  const v0 = versao(), indice0 = ler('index.html');

  // Pedidos ruins são recusados sem mexer em nada
  ok(motor('Relógio', 'X', '🕐', 'mat').cod === 1, 'recusa id com maiúscula/acento');
  ok(motor('relogio', 'X', '🕐', 'ciencias').cod === 1, 'recusa matéria desconhecida');
  ok(motor('trem', 'Outro trem', '🚂', 'mat').cod === 1, 'recusa id que já existe');

  // Prévia não grava
  const previa = motor('relogio', 'Que horas são?', '🕐', 'mat');
  ok(previa.cod === 0 && /Prévia/.test(previa.saida), 'prévia roda');
  ok(!fs.existsSync(path.join(copia, 'js/telas/relogio.js')) && ler('index.html') === indice0 && versao() === v0, 'prévia não grava nada');

  // Gravar: cria os 5 arquivos e liga tudo
  ok(motor('relogio', 'Que horas são?', '🕐', 'mat', '--gravar').cod === 0, 'gravar roda');
  ['js/relogioregras.js', 'js/telas/relogio.js', 'js/moldes/relogio.js', 'css/telas/relogio.css', 'testes/t_relogio.js']
    .forEach(f => ok(fs.existsSync(path.join(copia, f)), 'criou ' + f));
  ['js/relogioregras.js', 'js/telas/relogio.js', 'js/moldes/relogio.js', 'testes/t_relogio.js']
    .forEach(f => ok(rodar('--check', f).cod === 0, 'sintaxe de ' + f));
  const html = ler('index.html');
  ok(['css/telas/relogio.css', 'js/relogioregras.js', 'js/telas/relogio.js', 'js/moldes/relogio.js'].every(f => html.includes(f)), 'index.html liga os 4 arquivos');
  ok(html.indexOf('js/rodada.js') < html.indexOf('js/telas/relogio.js'), 'kit de rodada carrega antes da tela');
  ok(versao() === v0 + 1, 'VERSAO do sw.js subiu 1');
  ok(/'js\/telas\/relogio\.js'/.test(ler('sw.js')), 'sw.js guarda a tela nova');
  ok(ler('js/app.js').includes('m.relogio') && ler('js/app.js').includes('LB.usarRelogio(ctx)'), 'app.js liga molde e tela');
  ok(/abrirRelogio[\s\S]*Que horas são\?[\s\S]*PRÊMIOS/.test(ler('js/moldes/materias.js')), 'botão na tela Matemática');
  ok(/relogio: 'matematica'/.test(ler('js/telas/materias.js')), 'LB.materiaDe sabe que fica em Matemática');
  const etapas = JSON.parse(ler('build/fichas/etapas.json'));
  ok(etapas.etapas.t_relogio && etapas.navegador.includes('t_relogio') && etapas.mapa['js/telas/relogio.js'], 'teste novo no mapa do tudo.js');

  // Não cria duas vezes
  ok(motor('relogio', 'Que horas são?', '🕐', 'mat', '--gravar').cod === 1 && versao() === v0 + 1, 'segunda vez é recusada');

  // A brincadeira criada funciona de verdade, e o app segue funcionando sem internet
  const t = rodar('testes/t_relogio.js');
  ok(t.cod === 0, 'teste da brincadeira criada: ' + t.saida.trim());
  const off = rodar('testes/t_offline.js');
  ok(off.cod === 0, 'app sem internet com a brincadeira nova: ' + off.saida.trim().split('\n').pop());
} finally {
  fs.rmSync(copia, { recursive: true, force: true });
}

console.log(falhas ? `t_nova_brincadeira: ${falhas} falha(s)` : 't_nova_brincadeira: OK');
process.exit(falhas ? 1 : 0);
