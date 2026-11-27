// Teste guardado: brincadeira "Gráfico de barras" (js/graficoregras.js = contas; js/telas/grafico.js = tela).
// Uso: node testes/t_grafico.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // CONTAS: 300 rodadas sorteadas, a conta refeita aqui de outro jeito
  const defeitos = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.graficoRegras.sortearRodada();
      if (r.length !== 5) d.push('rodada sem 5 desafios');
      if (r.map(x => x.nivel).join() !== '1,2,3,2,3') d.push('níveis fora de ordem');
      if (r[0].grafico !== r[1].grafico || r[1].grafico !== r[2].grafico || r[3].grafico !== r[4].grafico || r[0].grafico === r[3].grafico) d.push('gráficos mal repartidos');
      r.forEach(x => {
        if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel || !x.dica || !x.explicacao) d.push('desafio incompleto');
        if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
        const v = x.grafico.barras.map(b => b.valor);
        if (new Set(v).size !== 3 || v.some(n => n < 1 || n > 8)) d.push('barras repetidas ou fora de 1 a 8: ' + v);
        const alta = x.grafico.barras.reduce((m, b) => b.valor > m.valor ? b : m);
        const baixa = x.grafico.barras.reduce((m, b) => b.valor < m.valor ? b : m);
        if (x.nivel === 1 && x.certa !== alta.e + ' ' + alta.nome) d.push('nível 1: não é a barra mais alta');
        if (x.nivel === 2) {
          const b = x.grafico.barras.find(b => x.enunciado.includes(b.nome));
          if (!b || x.certa !== b.valor) d.push('nível 2: contagem errada');
          if (x.opcoes.some(o => o < 1)) d.push('nível 2: opção sem sentido');
        }
        if (x.nivel === 3) {
          if (x.certa !== alta.valor - baixa.valor) d.push('nível 3: diferença errada');
          if (!x.enunciado.includes(alta.nome) || !x.enunciado.endsWith('que ' + baixa.nome + '?')) d.push('nível 3: enunciado não pergunta maior − menor');
          if (x.opcoes.some(o => o < 1)) d.push('nível 3: opção sem sentido');
        }
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // DESENHO: cada barra tem tantas figuras quanto o valor
  const desenho = await p.evaluate(() => {
    const g = LB.graficoRegras.desafio(2).grafico, caixa = document.createElement('div');
    caixa.innerHTML = LB.graficoDesenho(g);
    return g.barras.every((b, i) => caixa.querySelectorAll('.gr-barra')[i].querySelectorAll('.gr-figura').length === b.valor);
  });
  ok(desenho, 'desenho: figuras por barra não batem com o valor');

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Gráfico de barras")');
  ok(await p.locator('.brincadeira-grafico').count() === 1, 'abre a brincadeira');
  ok(await p.locator('.desenho-grafico .gr-barra').count() === 3, 'mostra o gráfico com 3 barras');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.opcoes-grafico button[data-valor="${v}"]`);
  const certa = () => p.evaluate(() => LB.app.perguntaGrafico.certa);

  const errada = await p.evaluate(() => LB.app.perguntaGrafico.opcoes.find(o => o !== LB.app.perguntaGrafico.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  for (let i = 0; i < 4; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'matematica' && LB.app.concluidos['grafico'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Fica só na tela da sua matéria (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Gráfico de barras")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Gráfico de barras")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_grafico: ${falhas} falha(s)` : 't_grafico: OK');
  process.exit(falhas ? 1 : 0);
})();
