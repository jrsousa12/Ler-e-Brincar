// Teste guardado: brincadeira "Ordem dos Fatos" (js/ordemregras.js = contas; js/telas/ordem.js = tela).
// Uso: node testes/t_ordem.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // CONTEÚDO E CONTAS: 300 rodadas sorteadas, todas coerentes
  const defeitos = await p.evaluate(() => {
    const d = [];
    if (LB.ordem.length < 5) d.push('menos de 5 sequências');
    LB.ordem.forEach(s => { if (s.frases.length !== 3 || new Set(s.frases).size !== 3) d.push(s.id + ' sem 3 frases diferentes'); });
    for (let i = 0; i < 300; i++) {
      const r = LB.ordemRegras.sortearRodada();
      if (r.length !== 5 || new Set(r.map(x => x.id)).size !== 5) d.push('rodada sem 5 sequências diferentes');
      r.forEach(x => {
        const [a, b] = x.etapas;
        if (a.certa !== x.frases[0] || a.opcoes.length !== 3 || !a.opcoes.includes(a.certa)) d.push('pergunta 1 ruim ' + x.id);
        if (b.certa !== x.frases[1] || b.opcoes.length !== 2 || b.opcoes.includes(x.frases[0])) d.push('pergunta 2 ruim ' + x.id);
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Ordem dos Fatos")');
  ok(await p.locator('.brincadeira-ordem').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.locator('.btn-frase-ordem', { hasText: v }).first().click();
  const certa = () => p.evaluate(() => LB.app.perguntaOrdem.certa);
  const cheias = () => p.locator('.casa-ordem.cheia').count();

  const errada = await p.evaluate(() => LB.app.perguntaOrdem.opcoes.find(o => o !== LB.app.perguntaOrdem.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await cheias() === 1 && await estrelas() === e0, '1º fato posto, ainda sem estrela');
  await p.click('.btn-proximo:has-text("Continuar")');
  ok(await p.locator('.btn-frase-ordem').count() === 2, '2ª pergunta tem 2 opções');
  await clicar(await certa());
  ok(await cheias() === 3 && await estrelas() === e0 + 1, 'sequência completa: 3 fatos e 1 estrela');
  for (let i = 0; i < 4; i++) {
    await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa());
    await p.click('.btn-proximo:has-text("Continuar")'); await clicar(await certa());
  }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos['ordem'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Filtros da lista
  await p.click('.filtro >> text=Matemática');
  ok(await p.locator('.bloco-brincadeira:has-text("Ordem dos Fatos")').count() === 0, 'Matemática esconde a brincadeira');
  await p.click('.filtro >> text=Português');
  ok(await p.locator('.bloco-brincadeira:has-text("Ordem dos Fatos")').count() === 1, 'Português mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_ordem: ${falhas} falha(s)` : 't_ordem: OK');
  process.exit(falhas ? 1 : 0);
})();
