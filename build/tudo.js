#!/usr/bin/env node
// Motor 6: comando único de conferência. Roda tudo em ordem e mostra uma linha por etapa.
// Uso: node build/tudo.js            -> todas as etapas
//      node build/tudo.js --rapido   -> pula as que abrem o navegador
//      node build/tudo.js --mudados  -> só as etapas ligadas aos arquivos alterados (git)
//      node build/tudo.js --lista    -> só mostra quais etapas rodariam
// Etapas, ordem e mapa "arquivo -> etapas": build/fichas/etapas.json (editar ali).
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const FICHA = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/etapas.json'), 'utf8'));

// Lista os arquivos de uma pasta (com subpastas) que terminam com uma das extensões.
function arquivos(pasta, exts) {
  const dir = path.join(RAIZ, pasta);
  if (!fs.existsSync(dir)) return [];
  if (fs.statSync(dir).isFile()) return [pasta];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(pasta, e.name);
    if (e.isDirectory()) return rel === path.join('build', 'previas') ? [] : arquivos(rel, exts); // previas: gerados, fora do git
    return exts.some((x) => e.name.endsWith(x)) ? [rel] : [];
  });
}

// Etapas internas: devolvem a lista de problemas (vazia = ok).
const INTERNAS = {
  sintaxe() {
    const lista = ['js', 'conteudo', 'build', 'testes', 'sw.js'].flatMap((p) => arquivos(p, ['.js']));
    return lista.filter((f) => spawnSync(process.execPath, ['--check', path.join(RAIZ, f)]).status !== 0)
      .map((f) => `erro de sintaxe: ${f}`);
  },
  tamanho() {
    const lim = FICHA.limite_linhas;
    const lista = ['js', 'css', 'build', 'testes', 'sw.js', 'index.html']
      .flatMap((p) => arquivos(p, ['.js', '.css', '.html']));
    return lista.map((f) => [f, fs.readFileSync(path.join(RAIZ, f), 'utf8').split('\n').length - 1])
      .filter(([, n]) => n > lim).map(([f, n]) => `${f}: ${n} linhas (limite ${lim})`);
  },
};

// Escolhe as etapas ligadas aos arquivos alterados, na ordem da ficha.
function escolher(alterados, ficha = FICHA) {
  const nomes = new Set();
  const soltos = [];
  for (const f of alterados) {
    const ligadas = Object.keys(ficha.mapa).filter((k) => f.startsWith(k)).flatMap((k) => ficha.mapa[k]);
    const proprio = path.basename(f, '.js');
    if (f.startsWith('testes/') && ficha.etapas[proprio]) ligadas.push(proprio);
    if (ligadas.length) ligadas.forEach((n) => nomes.add(n));
    else soltos.push(f);
  }
  return { etapas: Object.keys(ficha.etapas).filter((n) => nomes.has(n)), soltos };
}

function alteradosNoGit() {
  const r = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: RAIZ, encoding: 'utf8' });
  return r.stdout.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop());
}

// Roda uma etapa; devolve { ok, resumo, detalhe }.
function rodar(nome) {
  const cmd = FICHA.etapas[nome];
  if (cmd === 'interno') {
    const prob = INTERNAS[nome]();
    return { ok: !prob.length, resumo: prob.length ? `${prob.length} problema(s)` : 'ok', detalhe: prob.slice(0, 8) };
  }
  const [arq, ...args] = cmd.split(' ');
  const r = spawnSync(process.execPath, [arq, ...args], { cwd: RAIZ, encoding: 'utf8', timeout: 180000 });
  const linhas = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n');
  const avisos = linhas.find((l) => /aviso\(s\)/.test(l));
  return { ok: r.status === 0, resumo: avisos || linhas[linhas.length - 1], detalhe: linhas.slice(-6) };
}

function principal(argv) {
  let { etapas, soltos } = { etapas: Object.keys(FICHA.etapas), soltos: [] };
  if (argv.includes('--mudados')) {
    const alt = alteradosNoGit();
    if (!alt.length) { console.log('Nenhum arquivo alterado: nada a conferir.'); return 0; }
    ({ etapas, soltos } = escolher(alt));
  }
  if (argv.includes('--rapido')) etapas = etapas.filter((n) => !FICHA.navegador.includes(n));
  if (soltos.length) console.log(`Sem etapa ligada (ver mapa na ficha): ${soltos.join(', ')}`);
  if (argv.includes('--lista')) { console.log(`Etapas: ${etapas.join(', ') || '(nenhuma)'}`); return 0; }

  const falhas = [];
  for (const nome of etapas) {
    const t = Date.now();
    const r = rodar(nome);
    console.log(`${r.ok ? '✓' : '✗'} ${nome.padEnd(12)} ${((Date.now() - t) / 1000).toFixed(1)}s  ${r.resumo}`);
    if (!r.ok) { falhas.push(nome); r.detalhe.forEach((l) => console.log(`    ${l}`)); }
  }
  console.log(falhas.length ? `FALHOU: ${falhas.join(', ')}` : `TUDO OK (${etapas.length} etapas)`);
  return falhas.length ? 1 : 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { escolher, INTERNAS, FICHA };
