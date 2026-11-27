// Teste guardado: brincadeira "Régua" (js/reguaregras.js = contas; js/telas/regua.js = tela).
// Uso: node testes/t_regua.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // CONTAS: 300 rodadas sorteadas, todas coerentes
  const defeitos = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.reguaRegras.sortearRodada();
      if (r.length !== 5) d.push('rodada sem 5 desafios');
      r.forEach(x => {
        if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel) d.push('desafio sem enunciado, fala ou nível');
        if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // CONTAS DA RÉGUA: comprimento certo, objeto fora do zero e o mais comprido
  const conta = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const [n1, n2, n3, n4] = LB.reguaRegras.sortearRodada();
      [n1, n2, n3].forEach(x => { const o = x.objetos[0]; if (x.certa !== (o.fim - o.inicio) + ' cm') d.push('nível ' + x.nivel + ' conta errada'); });
      if (n1.objetos[0].inicio !== 0 || n1.objetos[0].fim > 8 || n2.objetos[0].inicio !== 0) d.push('n1/n2 fora do zero ou grande');
      if (n3.objetos[0].inicio < 1) d.push('n3 começa no zero');
      if (n3.opcoes.includes(n3.objetos[0].fim + ' cm') === false && n3.objetos[0].fim - n3.objetos[0].inicio !== n3.objetos[0].fim) d.push('n3 sem a armadilha do fim');
      const maior = n4.objetos.reduce((a, b) => b.fim > a.fim ? b : a);
      if (!n4.certa.toLowerCase().endsWith(maior.nome) || new Set(n4.objetos.map(o => o.fim)).size !== 3) d.push('n4 mais comprido errado');
      [n1, n2, n3, n4].forEach(x => x.objetos.forEach(o => { if (o.fim > x.regua) d.push('objeto passa da régua'); }));
    }
    if (!/<rect class="reg-objeto"/.test(LB.reguaDesenho([{ nome: 'lápis', inicio: 0, fim: 5, cor: '#fff' }], 10, true))) d.push('desenho sem objeto');
    return [...new Set(d)];
  });
  ok(conta.length === 0, 'régua: ' + conta.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Régua")');
  ok(await p.locator('.brincadeira-regua').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.opcoes-regua button[data-valor="${v}"]`);
  const certa = () => p.evaluate(() => LB.app.perguntaRegua.certa);

  const errada = await p.evaluate(() => LB.app.perguntaRegua.opcoes.find(o => o !== LB.app.perguntaRegua.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  for (let i = 0; i < 4; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'matematica' && LB.app.concluidos['regua'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Fica só na tela da sua matéria (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Régua")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Régua")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_regua: ${falhas} falha(s)` : 't_regua: OK');
  process.exit(falhas ? 1 : 0);
})();
