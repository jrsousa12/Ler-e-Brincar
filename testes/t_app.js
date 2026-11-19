// Teste guardado: abre o app no navegador (Playwright) e confere as telas principais.
// Uso: node testes/t_app.js   (precisa de vendor/vue.global.prod.js e vendor/dexie.min.js)
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');
const pasta = process.env.CAPTURAS || '';   // se definido, salva capturas de tela nessa pasta

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  p.on('requestfailed', r => { if (!/^data:|fonts.g/.test(r.url())) erros.push('não carregou: ' + r.url()); });
  const foto = async (n) => { if (pasta) await p.screenshot({ path: path.join(pasta, n + '.png') }); };

  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
  ok(await p.evaluate(() => typeof Vue !== 'undefined' && typeof Dexie !== 'undefined'), 'Vue e Dexie locais');
  ok((await p.locator('.card').count()) >= 4, 'tela inicial com 4 cartões');
  ok((await p.textContent('body')).includes('30 desenhos'), 'tela inicial conta 30 desenhos');
  await foto('1-inicio');

  // Abre uma história e responde a 1ª pergunta certo
  await p.click('nav >> text=Ler');
  await p.locator('.card').first().click();
  await foto('2-historia');
  await p.getByRole('button', { name: /pergunta|responder|vamos/i }).first().click().catch(() => ok(false, 'botão de ir às perguntas'));
  ok((await p.locator('.opcao').count()) >= 3, 'história mostra a 1ª pergunta com opções');
  // Atividade mat-036 (8 maçãs ÷ 4 = 2): o valor 2 está na posição 0
  await p.evaluate(() => {
    const vm = LB.app;
    vm.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036'));
  });
  await p.waitForSelector('.opcao');
  await p.locator('.opcao').nth(0).click();
  ok(await p.locator('.opcao').nth(0).evaluate(e => e.classList.contains('correta')), 'mat-036: 2 é a certa');
  await foto('3-atividade');

  // Colorir: abre o desenho 30 (novo) e pinta
  await p.evaluate(() => {
    const vm = LB.app;
    vm.abrirColorir(LB.CONTEUDO.colorir.find(c => c.id === 'colorir-30'));
  });
  await p.waitForTimeout(300);
  ok((await p.locator('svg ellipse').count()) > 0, 'colorir-30 (Abelha) desenhado');
  await foto('4-colorir');

  // Conquistas (selos) pela barra de baixo
  await p.click('nav >> text=Selos');
  ok((await p.locator('.selo').count()) > 0, 'tela de conquistas mostra os selos');
  // Portão dos adultos abre pelo ⚙️
  await p.click('button[title=Ajustes]');
  ok(await p.locator('.portao-parental').isVisible(), 'portão dos adultos abre');

  ok(erros.length === 0, 'erros no navegador: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_app: ${falhas} falha(s)` : 't_app: OK');
  process.exit(falhas ? 1 : 0);
})();
