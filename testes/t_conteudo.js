// Teste guardado: regra de resposta certa + validador. Uso: node testes/t_conteudo.js
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Regra de resposta certa (js/respostas.js)
globalThis.LB = {};
require(path.join(raiz, 'js/respostas.js'));
const { ehCorreta } = LB.respostas;
const maca = { tipo: 'operacao', opcoes: [2, 3, 4], correta: 2 };          // mat-036
ok(ehCorreta(maca, 0) && !ehCorreta(maca, 2), 'operação: valor 2 na posição 0');
ok(ehCorreta({ tipo: 'multipla', opcoes: ['2', '3', '4'], correta: 1 }, 1), 'múltipla: posição');
ok(ehCorreta({ tipo: 'multipla', opcoes: ['2', '10', '20'], correta: '20' }, 2), 'múltipla com texto');
ok(ehCorreta({ tipo: 'completar', opcoes: ['caro', 'carro', 'x'], correta: 'carro' }, 1), 'completar');

// 2. Validador: conteúdo real passa
const validar = (env) => {
  try { return { cod: 0, saida: execFileSync('node', [path.join(raiz, 'build/validar.js')], { env: { ...process.env, ...env } }).toString() }; }
  catch (e) { return { cod: e.status, saida: e.stdout.toString() }; }
};
ok(validar({}).cod === 0, 'conteúdo real deve passar');

// 3. Validador: erros plantados numa cópia são pegos
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-'));
for (const f of fs.readdirSync(path.join(raiz, 'conteudo'))) fs.copyFileSync(path.join(raiz, 'conteudo', f), path.join(tmp, f));
const troca = (arq, de, para) => {
  const p = path.join(tmp, arq), t = fs.readFileSync(p, 'utf8');
  if (!t.includes(de)) throw new Error('trecho não achado em ' + arq + ': ' + de);
  fs.writeFileSync(p, t.replace(de, para));
};
troca('mat.js', "opcoes:[9,10,11],correta:10", "opcoes:[9,10,11],correta:11");       // mat-011 conta errada
troca('lp.js', "opcoes:['cafe','café','cafê']", "opcoes:['cafe','café','cafe']");    // lp-037 repetida
troca('lp.js', "id:'lp-012'", "id:'lp-011'");                                          // id repetido
const r = validar({ CONTEUDO_RAIZ: tmp });
ok(r.cod === 1, 'cópia com erros deve falhar');
for (const esperado of ['mat-011: conta 5 + 5 = 10', 'lp-037: opções repetidas', 'lp-011: id repetido']) {
  ok(r.saida.includes(esperado), 'validador deveria acusar "' + esperado + '"');
}
fs.rmSync(tmp, { recursive: true });

console.log(falhas ? `t_conteudo: ${falhas} falha(s)` : 't_conteudo: OK');
process.exit(falhas ? 1 : 0);
