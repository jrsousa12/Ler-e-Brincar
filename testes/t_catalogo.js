// Teste guardado: catálogo (build/catalogo.js). Uso: node testes/t_catalogo.js
// Gera o catálogo num arquivo temporário e confere seções, próximos ids e o modo --conferir.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const saida = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'catalogo-')), 'CATALOGO.md');
const roda = (...a) => spawnSync('node', [path.join(raiz, 'build/catalogo.js'), ...a],
  { encoding: 'utf8', env: Object.assign({}, process.env, { CATALOGO_SAIDA: saida }) });

ok(roda('--conferir').status === 1, '--conferir deveria falhar sem catálogo');
const r = roda();
ok(r.status === 0 && /atualizado/.test(r.stdout), 'gerar deveria funcionar: ' + r.stdout + r.stderr);
const md = fs.readFileSync(saida, 'utf8');
for (const s of ['## Resumo', '## Português', '## Matemática', '## Histórias', '## Colorir', '## Código'])
  ok(md.includes(s), 'falta a seção ' + s);

const LB = require(path.join(raiz, 'build/carregar'))();
const maior = l => Math.max(...l.map(i => +i.id.split('-').pop()));
ok(md.includes('`lp-' + String(maior(LB.lp) + 1).padStart(3, '0') + '`'), 'próximo id de LP errado');
ok(md.includes('`mat-' + String(maior(LB.mat) + 1).padStart(3, '0') + '`'), 'próximo id de Mat errado');
ok(md.includes('`historia-' + String(maior(LB.historias) + 1).padStart(2, '0') + '`'), 'próximo id de história errado');
ok(LB.lp.every(i => md.includes(i.id + ' ')) && LB.mat.every(i => md.includes(i.id + ' ')), 'falta algum item no catálogo');
ok(md.includes('`build/catalogo.js`'), 'falta o próprio motor na lista de código');

ok(roda('--conferir').status === 0, '--conferir deveria passar logo após gerar');
fs.appendFileSync(saida, 'mexido à mão\n');
ok(roda('--conferir').status === 1, '--conferir deveria acusar catálogo mexido');
ok(/já estava em dia/.test((fs.writeFileSync(saida, md), roda()).stdout), 'deveria dizer "já estava em dia"');

console.log(falhas ? `t_catalogo: ${falhas} FALHA(S)` : 't_catalogo: PASS');
process.exit(falhas ? 1 : 0);
