// Teste guardado: celebrações (Fase 7, etapa 5) — janela do selo novo e fim da missão animado.
// Uso: node testes/t_celebracoes.js   (js/telas/selonovo.js, js/moldes/selonovo.js, js/moldes/missao.js)
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  const espera = ms => p.waitForTimeout(ms);
  const abrir = async () => {
    await p.goto('file://' + path.join(raiz, 'index.html'));
    await p.waitForSelector('.card', { timeout: 5000 });
    await espera(300);
  };

  await abrir();
  ok(Array.isArray(await p.evaluate(() => LB.app.selosVistos)), 'lista de selos vistos pronta ao abrir');
  ok(await p.locator('.caixa-selo').count() === 0, 'sem janela de selo ao abrir sem selos');

  // Ganhar 50 estrelas abre a janela do selo novo
  await p.evaluate(() => { LB.app.estrelas = 50; });
  await espera(1200);
  ok(await p.locator('.caixa-selo').count() === 1, 'janela do selo novo aparece');
  ok((await p.textContent('.selo-ganho-nome') || '').includes('50 Estrelas'), 'janela mostra o nome do selo');
  await p.click('.caixa-selo >> text=Oba!');
  await espera(200);
  ok(await p.locator('.caixa-selo').count() === 0, 'botão Oba! fecha a janela');
  ok(await p.evaluate(() => LB.app.selosVistos.includes('cinquenta')), 'selo fica marcado como visto');

  // Dois selos de uma vez: um depois do outro
  await p.evaluate(() => { LB.app.estrelas = 100; LB.app.diasMissao = ['2026-01-01']; });
  await espera(1200);
  const primeiro = await p.textContent('.selo-ganho-nome');
  await p.click('.caixa-selo >> text=Oba!');
  await espera(700);
  const segundo = await p.locator('.selo-ganho-nome').textContent().catch(() => '');
  ok(primeiro && segundo && primeiro !== segundo, 'dois selos novos aparecem um de cada vez');
  await p.click('.caixa-selo >> text=Oba!');

  // Reabrir não repete selo já visto
  await espera(500);
  await abrir();
  await espera(1200);
  ok(await p.locator('.caixa-selo').count() === 0, 'selo já visto não aparece de novo ao reabrir');

  // Cópia antiga (sem selosVistos): selos que já existem não fazem festa
  await p.evaluate(() => {
    const est = { estrelas: 120, concluidos: {}, diasMissao: [] };
    LB.app.selosVistos = null;
    LB.app.aplicarEstado(est);
  });
  await espera(1200);
  ok(await p.locator('.caixa-selo').count() === 0, 'cópia antiga: selos existentes contam como vistos');
  ok(await p.evaluate(() => LB.app.selosVistos.includes('cem')), 'cópia antiga: lista preenchida');

  // Fim da missão animado: medalha e 3 estrelas do prêmio
  await p.evaluate(() => {
    const m = LB.app.missao;
    LB.app.missao = { ...m, feitos: m.feitos.map(() => true), premiada: true };
    LB.app.irPara('missao');
  });
  await espera(400);
  ok(await p.locator('.missao-completa .medalha-missao').count() === 1, 'missão completa com medalha');
  ok(await p.locator('.estrelas-premio span').count() === 3, 'missão completa com 3 estrelas do prêmio');

  ok(!erros.length, 'sem erros na página: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_celebracoes: ${falhas} falha(s)` : 't_celebracoes: OK');
  process.exit(falhas ? 1 : 0);
})();
