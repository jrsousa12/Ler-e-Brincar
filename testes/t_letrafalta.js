// Teste guardado: brincadeira "Letra que falta" (js/letrafaltaregras.js = regras; js/telas/letrafalta.js = tela).
// Uso: node testes/t_letrafalta.js
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // REGRAS: 300 rodadas coerentes (5 palavras diferentes, 1 buraco, 3 letras com a certa)
  const defeitos = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.letraFaltaRegras.sortearRodada();
      if (r.length !== 5 || new Set(r.map(x => x.id)).size !== 5) d.push('rodada sem 5 palavras diferentes');
      if (r[0].nivel > 2) d.push('começa difícil');
      r.forEach(x => {
        if (x.letras.filter(l => l === '_').length !== 1) d.push('sem um buraco só em ' + x.palavra);
        if (x.palavra[x.pos] !== x.certa) d.push('certa errada em ' + x.palavra);
        if (x.letras.map((l, k) => k === x.pos ? x.certa : l).join('') !== x.palavra) d.push('máscara não fecha em ' + x.palavra);
        if (new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'regras: ' + defeitos.join(' | '));

  // TELA
  await p.click('.bloco-menu.ler');
  await p.click('.bloco-brincadeira:has-text("Letra que falta")');
  ok(await p.locator('.brincadeira-letrafalta').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.brincadeira-letrafalta .teclado-ditado button:text-is("${v}")`);
  const certa = () => p.evaluate(() => LB.app.perguntaLetraFalta.certa);

  const errada = await p.evaluate(() => LB.app.perguntaLetraFalta.opcoes.find(o => o !== LB.app.perguntaLetraFalta.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  ok(!(await p.locator('.slots-palavra').innerText()).includes('?'), 'acertou: a letra aparece no lugar do ?');
  for (let i = 0; i < 4; i++) { await p.click('.btn-proximo:has-text("Próxima")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'portugues' && LB.app.concluidos['letrafalta'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Letra que falta")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Letra que falta")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_letrafalta: ${falhas} falha(s)` : 't_letrafalta: OK');
  process.exit(falhas ? 1 : 0);
})();
