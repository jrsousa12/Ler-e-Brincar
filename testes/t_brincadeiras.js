// Teste guardado: brincadeiras "Memória" (js/telas/memoria.js) e "Som e Figura" (js/telas/somfigura.js).
// Uso: node testes/t_brincadeiras.js
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
  const estrelas = () => p.evaluate(() => LB.app.estrelas);

  // MEMÓRIA
  await p.click('.bloco-menu.brincar');
  await p.click('text=Memória');
  ok(await p.locator('.carta-memoria').count() === 8, 'memória com 8 cartas');
  const cartas = await p.evaluate(() => LB.app.cartasMemoria.map(c => ({ par: c.par, tipo: c.tipo })));
  ok(cartas.filter(c => c.tipo === 'figura').length === 4, '4 figuras e 4 palavras');
  // Erro: duas cartas de pares diferentes desviram
  const i0 = 0, iErr = cartas.findIndex(c => c.par !== cartas[0].par);
  await p.click('.carta-memoria >> nth=' + i0);
  await p.click('.carta-memoria >> nth=' + iErr);
  await p.waitForTimeout(1100);
  ok(await p.locator('.carta-memoria.virada').count() === 0, 'par errado desvira');
  const e0 = await estrelas();
  const pares = [...new Set(cartas.map(c => c.par))];
  for (const par of pares) {
    for (let i = 0; i < cartas.length; i++) if (cartas[i].par === par) await p.click('.carta-memoria >> nth=' + i);
  }
  ok(await p.locator('.carta-memoria.achada').count() === 8, 'todos os pares achados');
  ok(await estrelas() === e0 + 4, 'ganha 1 estrela por par');
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos.memoria === true), 'memória concluída volta e marca');

  // SOM E FIGURA
  await p.click('text=Som e Figura');
  const rod = await p.evaluate(() => LB.app.rodadasSom.length);
  ok(rod === 5, 'som e figura com 5 rodadas');
  ok(await p.locator('.carta-figura').count() === 3, '3 figuras por rodada');
  ok(await p.evaluate(() => LB.app.rodadasSom.every(r => new Set(r.opcoes.map(o => o.emoji)).size === 3 && r.opcoes.some(o => o.palavra === r.palavra))),
    'figuras diferentes e a certa sempre presente');
  const e1 = await estrelas();
  for (let k = 0; k < rod; k++) {
    const { certa, errada } = await p.evaluate(() => {
      const r = LB.app.alvoSom;
      return { certa: r.opcoes.findIndex(o => o.palavra === r.palavra), errada: r.opcoes.findIndex(o => o.palavra !== r.palavra) };
    });
    if (k === 0) {
      await p.click('.carta-figura >> nth=' + errada);
      ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1, 'figura errada pede nova tentativa');
    }
    await p.click('.carta-figura >> nth=' + certa);
    ok(await p.locator('.feedback-jogo.correto').count() === 1, 'figura certa na rodada ' + (k + 1));
    await p.click(k < rod - 1 ? 'text=Próxima' : 'text=Concluir');
  }
  ok(await estrelas() === e1 + rod, 'ganha 1 estrela por rodada');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos['som-figura'] === true), 'som e figura concluída volta e marca');
  // LISTA DE ATIVIDADES em grade: mesmo título vira um cartão; tocar abre uma atividade ainda não feita
  const g = await p.evaluate(() => ({ n: LB.app.gruposAtividades.length, total: LB.app.atividadesFiltradas.length }));
  ok(g.n > 0 && g.n < g.total, 'atividades agrupadas por título (' + g.n + ' cartões)');
  ok(await p.locator('.grade-brincadeiras .bloco-brincadeira').count() === 3, '3 blocos de brincadeira');
  await p.locator('.cartao-atividade').first().click();
  ok(await p.evaluate(() => LB.app.tela === 'atividade' && !LB.app.concluidos[LB.app.atividadeAtual.id]), 'cartão abre atividade ainda não feita');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_brincadeiras: ${falhas} falha(s)` : 't_brincadeiras: OK');
  process.exit(falhas ? 1 : 0);
})();
