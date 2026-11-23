// Ajudante comum dos testes de geradores: cópia do conteúdo, rodar o motor nela e o validador.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');

module.exports = function copia(motor) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-gerar-'));
  for (const f of fs.readdirSync(path.join(raiz, 'conteudo'))) fs.copyFileSync(path.join(raiz, 'conteudo', f), path.join(tmp, f));
  const env = { ...process.env, CONTEUDO_RAIZ: tmp };
  const exec = (arq, args) => {
    try { return { cod: 0, saida: execFileSync('node', [path.join(raiz, arq), ...args], { env }).toString() }; }
    catch (e) { return { cod: e.status, saida: e.stdout.toString() }; }
  };
  return {
    pasta: tmp,
    pedido: texto => { const p = path.join(tmp, 'pedido.txt'); fs.writeFileSync(p, texto); return p; },
    ler: f => fs.readFileSync(path.join(tmp, f), 'utf8'),
    rodar: args => exec(motor, args),
    validar: () => exec('build/validar.js', []),
    apagar: () => fs.rmSync(tmp, { recursive: true })
  };
};
