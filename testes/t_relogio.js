// Teste guardado: brincadeira "Que horas são?" (js/relogioregras.js = contas; js/telas/relogio.js = tela).
// Uso: node testes/t_relogio.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
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
      const r = LB.relogioRegras.sortearRodada();
      if (r.length !== 5) d.push('rodada sem 5 desafios');
      r.forEach(x => {
        if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel) d.push('desafio sem enunciado, fala ou nível');
        if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // CONTAS DO RELÓGIO: níveis, horas certas e erradas típicas
  const conta = await p.evaluate(() => {
    const d = [], R = LB.relogioRegras;
    for (let i = 0; i < 300; i++) {
      const [n1, n2, n3, n4] = R.sortearRodada();
      if (!/^\d+:00$/.test(n1.certa)) d.push('n1 não é hora cheia ' + n1.certa);
      if (!/^\d+:30$/.test(n2.certa)) d.push('n2 não é meia hora ' + n2.certa);
      if (!/^\d+:(00|30)$/.test(n3.certa)) d.push('n3 fora de hora cheia/meia ' + n3.certa);
      const [a, b] = n4.relogios;
      if (n4.certa !== (b.h - a.h === 1 ? '1 hora' : (b.h - a.h) + ' horas') || b.h > 12) d.push('n4 conta errada');
    }
    if (R.trocada(3, 0) !== '12:15' || R.trocada(3, 30) !== '6:15') d.push('hora trocada');
    if (R.dizer(3, 30) !== '3 e meia' || R.dizer(1, 0) !== '1 hora') d.push('dizer');
    if (!/<line class="rel-hora"/.test(LB.relogioDesenho(3, 0, 100))) d.push('desenho sem ponteiro');
    return [...new Set(d)];
  });
  ok(conta.length === 0, 'relógio: ' + conta.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Que horas são?")');
  ok(await p.locator('.brincadeira-relogio').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.opcoes-relogio button[data-valor="${v}"]`);
  const certa = () => p.evaluate(() => LB.app.perguntaRelogio.certa);

  const errada = await p.evaluate(() => LB.app.perguntaRelogio.opcoes.find(o => o !== LB.app.perguntaRelogio.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  for (let i = 0; i < 4; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'matematica' && LB.app.concluidos['relogio'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Fica só na tela da sua matéria (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Que horas são?")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Que horas são?")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_relogio: ${falhas} falha(s)` : 't_relogio: OK');
  process.exit(falhas ? 1 : 0);
})();
