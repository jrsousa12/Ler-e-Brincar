// Teste guardado: brincadeira "Trem dos números" (js/tremregras.js = contas; js/telas/trem.js = tela).
// Uso: node testes/t_trem.js
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

  // CONTAS: 300 rodadas sorteadas, todas coerentes
  const defeitos = await p.evaluate(() => {
    const d = [], teto = { 2: 30, 5: 100, 10: 200 };
    for (let i = 0; i < 300; i++) {
      const r = LB.tremRegras.sortearRodada();
      if (r.map(t => t.nivel).join('') !== '12344') d.push('ordem dos níveis');
      if (r[3].passo === r[4].passo) d.push('níveis 4 com o mesmo passo');
      r.forEach(t => {
        if (t.nivel <= 3 && t.passo !== [2, 5, 10][t.nivel - 1]) d.push('passo do nível');
        if (t.numeros.length !== 5) d.push('não tem 5 vagões');
        t.numeros.forEach((n, k) => {
          if (k && n - t.numeros[k - 1] !== t.passo) d.push('sequência quebrada');
          if (n < t.passo || n > teto[t.passo] || n % t.passo) d.push('número fora da faixa');
        });
        if (t.faltam.length !== (t.nivel === 4 ? 2 : 1)) d.push('quantidade de vazios');
        const pos = t.faltam.map(f => f.pos);
        if (new Set(pos).size !== pos.length || (pos.length === 2 && pos[1] - pos[0] < 2)) d.push('vazios repetidos ou lado a lado');
        t.faltam.forEach(f => {
          if (f.certa !== t.numeros[f.pos]) d.push('certa errada');
          if (new Set(f.opcoes).size !== 3 || !f.opcoes.includes(f.certa) || f.opcoes.some(o => o < 1)) d.push('opções ruins ' + f.opcoes);
        });
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('text=Trem dos números');
  ok(await p.locator('.brincadeira-trem').count() === 1, 'abre o Trem dos números');
  const voltar = await p.locator('section.brincadeira-trem .btn-voltar').boundingBox();
  ok(voltar && voltar.x < 40 && voltar.width < 200, '"Voltar" no canto esquerdo');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = n => p.click(`.opcoes-trem button:text-is("${n}")`);
  const certa = () => p.evaluate(() => LB.app.perguntaTrem.certa);

  // Trem 1: erra uma opção (sem estrela), depois acerta
  ok(await p.locator('.vagao.vazio').count() === 1 && (await p.locator('.vagao.vazio').innerText()).trim() === '?', 'um vagão vazio com "?"');
  const errada = await p.evaluate(() => LB.app.perguntaTrem.opcoes.find(o => o !== LB.app.perguntaTrem.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  ok(await p.locator('.vagao.vazio').count() === 0, 'vagão preenchido após acertar');
  await p.click('text=Próximo');

  // Trens 2 e 3
  for (let i = 0; i < 2; i++) { await clicar(await certa()); await p.click('text=Próximo'); }

  // Trem 4: dois vazios; só o 2º acerto dá estrela
  ok(await p.evaluate(() => LB.app.tremAtual.nivel) === 4 && await p.locator('.vagao.vazio').count() === 2, 'nível 4 tem 2 vagões vazios');
  const antes = await estrelas();
  await clicar(await certa());
  ok(await estrelas() === antes && await p.locator('.vagao.vazio').count() === 1, '1º vazio não dá estrela');
  await p.click('text=Próximo');
  await clicar(await certa());
  ok(await estrelas() === antes + 1, '2º vazio dá estrela');
  await p.click('text=Próximo');

  // Trem 5 e conclusão
  await clicar(await certa()); await p.click('text=Próximo');
  await clicar(await certa());
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos.trem === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Filtros da lista: só em Matemática/Todas
  await p.click('.filtro >> text=Português');
  ok(await p.locator('.bloco-brincadeira:has-text("Trem dos números")').count() === 0, 'Português esconde o Trem');
  await p.click('.filtro >> text=Matemática');
  ok(await p.locator('.bloco-brincadeira:has-text("Trem dos números")').count() === 1, 'Matemática mostra o Trem');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_trem: ${falhas} falha(s)` : 't_trem: OK');
  process.exit(falhas ? 1 : 0);
})();
