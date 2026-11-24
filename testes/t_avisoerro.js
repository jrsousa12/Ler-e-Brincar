// Teste guardado: aviso de erro com "Recomeçar" (js/avisoerro.js), no navegador.
// Uso: node testes/t_avisoerro.js
'use strict';
const path = require('path');
const { chromium } = require('playwright');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + path.join(__dirname, '..', 'index.html'));
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  ok(await p.locator('#aviso-erro').count() === 0, 'sem erro, sem aviso');

  // Erro ignorável não mostra aviso
  await p.evaluate(() => LB.avisoErro.tratar(null, 'ResizeObserver loop completed'));
  ok(await p.locator('#aviso-erro').count() === 0, 'ResizeObserver não assusta');

  // Erro de verdade (fora do Vue) mostra o aviso uma vez só
  await p.evaluate(() => setTimeout(() => { throw new Error('quebrou de propósito'); }, 0));
  await p.waitForSelector('#aviso-erro', { timeout: 3000 }).catch(() => {});
  ok(await p.locator('#aviso-erro').count() === 1, 'erro solto mostra o aviso');
  ok((await p.textContent('#aviso-erro')).includes('Recomeçar'), 'aviso tem o botão Recomeçar');
  await p.evaluate(() => LB.avisoErro.tratar(new Error('outro')));
  ok(await p.locator('#aviso-erro').count() === 1, 'não empilha avisos');

  // Recomeçar recarrega e o aviso some
  await Promise.all([p.waitForEvent('load'), p.click('#aviso-erro-botao')]);
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  ok(await p.locator('#aviso-erro').count() === 0, 'depois de Recomeçar o app volta limpo');

  // Erro dentro de uma tela do Vue também mostra o aviso
  await p.evaluate(() => LB.app.$.appContext.config.errorHandler(new Error('erro de tela')));
  ok(await p.locator('#aviso-erro').count() === 1, 'erro do Vue mostra o aviso');

  await b.close();
  console.log(falhas ? falhas + ' falha(s)' : 'OK t_avisoerro');
  process.exit(falhas ? 1 : 0);
})();
