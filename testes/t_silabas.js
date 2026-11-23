// Teste guardado: brincadeira "Monte a Palavra" (js/telas/silabas.js) no navegador.
// Uso: node testes/t_silabas.js
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

  await p.click('.bloco-menu.brincar');
  await p.click('text=Monte a Palavra');
  ok(await p.locator('.brincadeira-silabas').count() === 1, 'abre a brincadeira');
  ok(await p.locator('.slot-bloco').count() === 2 && await p.locator('.bloco-silaba').count() === 4, '2 espaços e 4 sílabas');

  const atual = () => p.evaluate(() => ({ s: [...LB.app.palavraSilabas.silabas], n: LB.app.palavrasSilabas.length }));
  const montar = async lista => { for (const s of lista) await p.locator(`.bloco-silaba >> text="${s}"`).first().click(); };
  let { s, n } = await atual();
  ok(n === 5, 'rodada com 5 palavras');
  ok(await p.locator('.slot-bloco').count() === s.length, 'um espaço por sílaba');
  ok(await p.locator('.bloco-silaba').count() === s.length + 2, 'sílabas certas + 2 para confundir');
  const estrelas = await p.evaluate(() => LB.app.estrelas);
  // Erro: monta na ordem ao contrário
  await montar([...s].reverse());
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1, 'ordem errada pede nova tentativa');
  for (let i = 0; i < s.length; i++) await p.click('.slot-bloco >> nth=' + i);
  ok(await p.locator('.bloco-silaba').count() === s.length + 2, 'sílabas voltam ao banco');
  await montar(s);
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'palavra certa');
  ok(await p.evaluate(() => LB.app.estrelas) === estrelas + 1, 'ganha 1 estrela');
  const id1 = await p.evaluate(() => LB.app.palavraSilabas.id);
  ok(await p.evaluate(id => LB.app.concluidos[id] === true, id1), 'palavra acertada fica marcada');

  // Resolve as outras e conclui
  for (let k = 1; k < n; k++) {
    await p.click('text=Próxima');
    ({ s } = await atual());
    await montar(s);
  }
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos.silabas === true), 'concluir volta e marca feito');
  // Nova rodada evita as palavras já acertadas
  await p.click('text=Monte a Palavra');
  ok(await p.evaluate(() => LB.app.palavrasSilabas.every(w => !LB.app.concluidos[w.id])), 'nova rodada traz palavras ainda não acertadas');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_silabas: ${falhas} falha(s)` : 't_silabas: OK');
  process.exit(falhas ? 1 : 0);
})();
