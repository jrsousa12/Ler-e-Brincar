// Teste guardado: conferidor de qualidade (build/conferir.js). Uso: node testes/t_conferir.js
// Monta um conteúdo de mentira com um defeito de cada tipo e confere se cada aviso aparece.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'conferir-'));
const p = (o, c, e = 'Qual?', x = 'Porque sim.') => ({ tipo: 'multipla', enunciado: e, opcoes: o, correta: c, explicacao: x });
const lp = (id, q) => Object.assign({ id, titulo: 't', materia: 'lingua-portuguesa', habilidadeBNCC: 'EF02LP03', nivel: 2 }, q);
const mat = (id, nivel, e, opcoes, correta, explicacao, apoioVisual) =>
  ({ id, titulo: 't', materia: 'matematica', habilidadeBNCC: 'EF02MA06', nivel, tipo: 'operacao', enunciado: e, apoioVisual, opcoes, correta, explicacao });
const svg = n => '<svg viewBox="0 0 300 300">' + '<circle r="1"/>'.repeat(n) + '</svg>';
const arquivos = {
  historias: [1, 2].map(n => ({ id: 'historia-0' + n, emoji: '🐱', nivel: 1, perguntas: [p(['Sim', 'Não', 'Na cabeça do espantalho'], 2)] })),
  lp: [lp('lp-001', p(['a', 'b', 'c'], 0, 'Igual?')), lp('lp-002', p(['a', 'b', 'c'], 0, 'igual?  ')),
       lp('lp-003', p(['a', 'b', 'c'], 0, 'x'.repeat(200)))],
  mat: [mat('mat-001', 1, 'Quanto é 2 + 1?', [2, 3, 4], 3, '2 + 1 = 3.'),
        mat('mat-002', 2, 'Tinha 3 e ganhou 2.', [4, 5, 6], 5, '3 + 2 = 5.', { esquerda: '🍎🍎', operador: '+', direita: '🍎🍎' }),
        mat('mat-003', 2, 'Quanto é 5 − 2?', [-1, 3, 40], 3, 'Tire e conte.'),
        mat('mat-004', 2, 'Tinha 12 lápis.', [3, 4, 5], 4, '12 ÷ 3 = 4.', { esquerda: '✏️×12', operador: '÷3', direita: '?' }),
        mat('mat-006', 2, 'Quanto é 70 − 30?', [40, 41, 100], 0, '70 − 30 = 40.'),
        mat('mat-005', 2, 'Pagou com R$ 20,00 uma conta de R$ 13,00.', ['R$ 7,00', 'R$ 11,00', 'R$ 9,00'], 0, 'Troco: R$ 7,00.')],
  colorir: [{ id: 'colorir-01', emoji: '🌙', svg: svg(1) }, { id: 'colorir-02', emoji: '🌙', svg: svg(6) }],
  silabas: []
};
for (const [nome, lista] of Object.entries(arquivos))
  fs.writeFileSync(path.join(pasta, nome + '.js'), `LB.${nome} = ${JSON.stringify(lista)};`);

const roda = (...a) => spawnSync('node', [path.join(raiz, 'build/conferir.js'), '--todos', ...a],
  { env: Object.assign({}, process.env, { CONTEUDO_RAIZ: pasta }), encoding: 'utf8' });
const s = roda().stdout;
const tem = (codigo, id) => ok(new RegExp(codigo + '[\\s\\S]*?' + id).test(s), `aviso ${codigo} em ${id}`);
tem('certa_mais_longa', 'historia-01#1');
tem('emoji_repetido', 'historia-02');
tem('enunciado_repetido', 'lp-002');
tem('texto_longo', 'lp-003');
tem('falta_figura', 'mat-001');
tem('figura_nao_bate', 'mat-002');
tem('opcao_negativa', 'mat-003');
tem('distrator_facil', 'mat-003');
tem('explicacao_sem_resposta', 'mat-003');
tem('emoji_repetido', 'colorir-02');
tem('desenho_simples', 'colorir-01');
ok(!/mat-004/.test(s), 'mat-004 (✏️×12, divisão) não deve dar aviso');
ok(!/distrator_facil[^\n]*mat-006|mat-006[^\n]*distrator_facil/.test(s), '100 numa conta de − é erro típico (trocou_por_soma), não é fácil de descartar');
ok(!/mat-005[^\n]*explicacao_sem_resposta|explicacao_sem_resposta[^\n]*mat-005/.test(s), 'certa com R$ (cifrão) na explicação não é aviso');
ok(!/colorir-02: 6/.test(s), 'desenho com 6 partes não é simples');
ok(roda().status === 0, 'sem --estrito, sai sem erro');
ok(roda('--estrito').status === 1, 'com --estrito e avisos, sai com erro');
ok(/Qualidade: 1 aviso/.test(roda('--tipo', 'falta_figura').stdout), '--tipo filtra');

// Ignorar: aviso aceito pelo dono na ficha some
const ficha = JSON.parse(fs.readFileSync(path.join(raiz, 'build/fichas/qualidade.json'), 'utf8'));
ficha.ignorar = { 'mat-001': ['falta_figura'] };
const fichaTeste = path.join(pasta, 'ficha.json');
fs.writeFileSync(fichaTeste, JSON.stringify(ficha));
const s2 = spawnSync('node', [path.join(raiz, 'build/conferir.js')],
  { env: Object.assign({}, process.env, { CONTEUDO_RAIZ: pasta, FICHA_QUALIDADE: fichaTeste }), encoding: 'utf8' }).stdout;
ok(!/falta_figura/.test(s2), 'ignorar na ficha esconde o aviso');

fs.rmSync(pasta, { recursive: true });
console.log(falhas ? `t_conferir: ${falhas} falha(s)` : 't_conferir: OK');
process.exit(falhas ? 1 : 0);
