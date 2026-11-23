// Teste guardado: brincadeira "Monte a Palavra" (js/telas/silabas.js) no navegador.
// Uso: node testes/t_silabas.js
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
  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});

  await p.click('.bloco-menu.brincar');
  await p.click('text=Monte a Palavra');
  ok(await p.locator('.brincadeira-silabas').count() === 1, 'abre a brincadeira');
  ok(await p.locator('.slot-bloco').count() === 2 && await p.locator('.bloco-silaba').count() === 4, '2 espaços e 4 sílabas');

  const estrelas = await p.evaluate(() => LB.app.estrelas);
  // Erro: monta LA + BO
  await p.click('.bloco-silaba >> text="LA"'); await p.click('.bloco-silaba >> text="BO"');
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1, 'ordem errada pede nova tentativa');
  // Devolve as duas e monta certo
  await p.click('.slot-bloco >> nth=0'); await p.click('.slot-bloco >> nth=1');
  ok(await p.locator('.bloco-silaba').count() === 4, 'sílabas voltam ao banco');
  await p.click('.bloco-silaba >> text="BO"'); await p.click('.bloco-silaba >> text="LA"');
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'BOLA certo');
  ok(await p.evaluate(() => LB.app.estrelas) === estrelas + 1, 'ganha 1 estrela');

  // Resolve as outras duas e conclui
  for (const [a, c] of [['CA', 'SA'], ['GA', 'TO']]) {
    await p.click('text=Próxima');
    await p.click(`.bloco-silaba >> text="${a}"`); await p.click(`.bloco-silaba >> text="${c}"`);
  }
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos.silabas === true), 'concluir volta e marca feito');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_silabas: ${falhas} falha(s)` : 't_silabas: OK');
  process.exit(falhas ? 1 : 0);
})();
