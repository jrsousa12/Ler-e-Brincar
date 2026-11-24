// Teste guardado: brincadeira "Mercadinho" (js/mercadoregras.js = contas; js/telas/mercado.js = tela).
// Uso: node testes/t_mercado.js
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
      const r = LB.mercadoRegras.sortearRodada();
      if (r.map(c => c.nivel).join('') !== '12344') d.push('ordem dos níveis');
      r.forEach(c => {
        const soma = c.produtos.reduce((s, x) => s + x.preco, 0);
        if (soma !== c.total) d.push('total errado');
        if (c.total > 49 || c.produtos.some(x => x.preco < 1)) d.push('preço fora da faixa');
        const meio = v => !Number.isInteger(v) && Number.isInteger(v * 2);   // termina em ,50
        if (c.nivel === 4 && !meio(c.total)) d.push('nível 4 sem 50 centavos ' + c.total);
        if (c.nivel < 4 && c.produtos.some(x => !Number.isInteger(x.preco))) d.push('centavos antes do nível 4');
        if (c.tipo === 'montar') {
          if (c.nivel === 1 && (c.total > 10 || c.total < 2)) d.push('nível 1 fora de 2 a 10');
          if (c.nivel === 4 && (c.total > 9.5 || c.total < 1.5 || !c.carteira.includes(0.5))) d.push('nível 4 montar ruim');
          return;
        }
        if (c.nivel === 4) {
          const erradas = c.etapas[0].opcoes.filter(o => o !== c.troco);
          if (!erradas.some(meio) || !erradas.some(Number.isInteger)) d.push('opções do troco com centavos entregam a resposta ' + c.etapas[0].opcoes);
        }
        if (c.pago - c.total !== c.troco || c.troco < 1) d.push('troco errado');
        if (!LB.mercado.dinheiro.some(x => x.valor === c.pago && x.tipo === 'nota')) d.push('nota inexistente ' + c.pago);
        if (c.nivel === 3 && c.produtos[0].nome === c.produtos[1].nome) d.push('produto repetido');
        c.etapas.forEach(e => {
          if (new Set(e.opcoes).size !== 3 || !e.opcoes.includes(e.certa) || e.opcoes.some(o => o <= 0)) d.push('opções ruins ' + e.opcoes);
        });
        if (c.etapas[c.etapas.length - 1].certa !== c.troco) d.push('última etapa não é o troco');
        if (c.nivel === 3 && c.etapas[0].certa !== c.total) d.push('1ª etapa não é o total');
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));
  const escrita = await p.evaluate(() => [3.5, 0.5, 1, 12].map(v => LB.mercadoRegras.texto(v) + '/' + LB.mercadoRegras.fala(v)).join(' | '));
  ok(escrita === 'R$ 3,50/3 reais e 50 centavos | R$ 0,50/50 centavos | R$ 1/1 real | R$ 12/12 reais', 'escrita e fala do dinheiro: ' + escrita);

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('text=Mercadinho');
  ok(await p.locator('.brincadeira-mercado').count() === 1, 'abre o Mercadinho');
  const voltar = await p.locator('section.brincadeira-mercado .btn-voltar').boundingBox();
  ok(voltar && voltar.x < 40 && voltar.width < 200, '"Voltar" no canto esquerdo');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();

  // Nível 1: passa do preço (erra), tira, paga certinho
  const c1 = await p.evaluate(() => LB.app.compraMercado.total);
  for (let i = 0; i < c1 - 1; i++) await p.click('.carteira .dinheiro.moeda');
  await p.click('.carteira .dinheiro.v2');   // passa do preço em 1 real
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1, 'passar do preço avisa');
  ok(await estrelas() === e0, 'sem estrela ao passar');
  await p.click('.bandeja .dinheiro >> nth=0');   // tira uma moeda: sobra o valor exato
  ok(await p.evaluate(() => LB.app.somaBandeja) === c1 - 1 + 2 - 1, 'tirar da bandeja desconta');
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'ao tirar até o preço certo, confere: 1 estrela');
  await p.click('text=Próxima');

  // Nível 2: erra uma opção, depois acerta
  ok(await p.evaluate(() => LB.app.compraMercado.nivel) === 2, 'segunda compra é do nível 2');
  const certa2 = await p.evaluate(() => LB.app.perguntaMercado.certa);
  const errada = await p.evaluate(() => LB.app.perguntaMercado.opcoes.find(o => o !== LB.app.perguntaMercado.certa));
  await p.click(`.opcoes-mercado button:text-is("R$ ${errada}")`);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1, 'troco errado pede nova tentativa');
  await p.click(`.opcoes-mercado button:text-is("R$ ${certa2}")`);
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'troco certo');
  await p.click('text=Próxima');

  // Nível 3: duas perguntas (total, depois troco); só a última dá estrela
  ok(await p.evaluate(() => LB.app.compraMercado.nivel) === 3 && await p.locator('.produto').count() === 2, 'nível 3 tem 2 produtos');
  const antes = await estrelas();
  await p.click(`.opcoes-mercado button:text-is("R$ ${await p.evaluate(() => LB.app.perguntaMercado.certa)}")`);
  ok(await estrelas() === antes, 'acertar o total ainda não dá estrela');
  await p.click('text=Próxima');
  await p.click(`.opcoes-mercado button:text-is("R$ ${await p.evaluate(() => LB.app.perguntaMercado.certa)}")`);
  ok(await estrelas() === antes + 1, 'acertar o troco dá estrela');
  await p.click('text=Próxima');

  // Nível 4: pagar R$ X,50 com a moeda de 50 centavos (guloso), depois o troco com centavos
  const c4 = await p.evaluate(() => LB.app.compraMercado);
  ok(c4.nivel === 4 && c4.tipo === 'montar', 'quarta compra: nível 4, pagar certinho');
  const etiqueta = await p.locator('.etiqueta-preco').innerText();
  ok(/^R\$ \d+,50$/.test(etiqueta), 'etiqueta com centavos: ' + etiqueta);
  let resto = c4.total;
  for (const v of [5, 2, 1, 0.5]) while (resto >= v) { await p.click(`.carteira .dinheiro.v${String(v).replace('.', '_')}`); resto -= v; }
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'pagou com centavos');
  ok(await p.locator('.bandeja .dinheiro.moeda.v0_5').count() === 1, 'moeda de 50 centavos na bandeja');
  await p.click('text=Próxima');
  ok(await p.evaluate(() => LB.app.compraMercado.nivel === 4 && LB.app.compraMercado.tipo === 'perguntas'), 'quinta compra: troco com centavos');
  const txt4 = await p.evaluate(() => LB.mercadoRegras.texto(LB.app.perguntaMercado.certa));
  await p.click(`.opcoes-mercado button:text-is("${txt4}")`);
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'troco com centavos certo');
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos.mercado === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Filtros da lista: Mercadinho só em Matemática/Todas
  await p.click('.filtro >> text=Português');
  ok(await p.locator('.bloco-brincadeira:has-text("Mercadinho")').count() === 0, 'Português esconde o Mercadinho');
  await p.click('.filtro >> text=Matemática');
  ok(await p.locator('.bloco-brincadeira:has-text("Mercadinho")').count() === 1 && await p.locator('.bloco-brincadeira.ler').count() === 0, 'Matemática mostra o Mercadinho e nenhuma de leitura');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_mercado: ${falhas} falha(s)` : 't_mercado: OK');
  process.exit(falhas ? 1 : 0);
})();
