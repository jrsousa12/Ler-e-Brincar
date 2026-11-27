// Teste guardado: brincadeira "Formas" (js/formasregras.js = regras; js/formasdesenho.js = desenho; js/telas/formas.js = tela).
// Uso: node testes/t_formas.js
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // REGRAS: 300 rodadas sorteadas, todas coerentes
  const defeitos = await p.evaluate(() => {
    const d = [], R = LB.formasRegras;
    for (let i = 0; i < 300; i++) {
      const r = R.sortearRodada();
      if (r.length !== 5) d.push('rodada sem 5 desafios');
      r.forEach(x => {
        if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel || !x.dica || !x.explicacao) d.push('desafio incompleto');
        if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
        if (x.nivel <= 2) {
          if (!R.FORMAS.includes(x.certa) || !x.opcoes.every(o => x.figuras[o] && x.figuras[o].forma === o)) d.push('figuras não batem com as opções');
          if (x.enunciado !== 'Toque no ' + x.certa + '.') d.push('enunciado não pede a certa');
          if (x.nivel === 1 && x.opcoes.some(o => x.figuras[o].giro !== 0 || x.figuras[o].tam !== 1)) d.push('nível 1 com giro ou tamanho');
        } else if (x.nivel === 3) {
          if (x.figura.forma !== x.certa) d.push('nível 3: figura diferente da certa');
        } else {
          if (x.certa !== R.LADOS[x.figura.forma] + ' lados' || x.figura.forma === 'círculo') d.push('nível 4: lados errados');
        }
      });
      if (r.map(x => x.nivel).join() !== '1,2,3,4,4') d.push('níveis fora de ordem');
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'regras: ' + defeitos.join(' | '));

  // DESENHO: cada forma sai no SVG certo
  const desenho = await p.evaluate(() => ['círculo', 'quadrado', 'retângulo', 'triângulo'].map(forma => {
    const s = LB.formasDesenho({ forma, cor: '#fff', tam: 1, giro: 20 });
    return s.includes('<svg') && s.includes('rotate(20') && /<(circle|rect|polygon)/.test(s);
  }));
  ok(desenho.every(Boolean), 'desenho das 4 formas: ' + desenho);

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Formas")');
  ok(await p.locator('.brincadeira-formas').count() === 1, 'abre a brincadeira');
  ok(await p.locator('.opcoes-formas.so-figuras .opcao-forma svg').count() === 3, 'nível 1 mostra 3 figuras para tocar');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.opcoes-formas button[data-valor="${v}"]`);
  const certa = () => p.evaluate(() => LB.app.perguntaFormas.certa);

  const errada = await p.evaluate(() => LB.app.perguntaFormas.opcoes.find(o => o !== LB.app.perguntaFormas.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  await p.click('.btn-proximo:has-text("Próximo")');
  await clicar(await certa());
  await p.click('.btn-proximo:has-text("Próximo")');
  ok(await p.locator('.desenho-formas svg').count() === 1 && await p.locator('.opcoes-formas.so-figuras').count() === 0, 'nível 3 mostra a forma grande e opções em texto');
  await clicar(await certa());
  for (let i = 0; i < 2; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'matematica' && LB.app.concluidos['formas'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Fica só na tela da sua matéria (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Formas")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Formas")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_formas: ${falhas} falha(s)` : 't_formas: OK');
  process.exit(falhas ? 1 : 0);
})();
