// Teste guardado: brincadeira "Pacotes de contas" (js/pacoteregras.js = contas; js/telas/pacote.js = tela).
// Uso: node testes/t_pacote.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
// Cada rodada = 3 pacotes x 4 perguntas; 1 estrela por pacote completo.
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
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.pacoteRegras.sortearRodada();
      if (r.length !== 3) d.push('rodada sem 3 pacotes');
      r.forEach(pac => {
        if (typeof pac.titulo !== 'string' || typeof pac.fala !== 'string' || !pac.nivel) d.push('pacote sem título, fala ou nível');
        if (!Array.isArray(pac.perguntas) || pac.perguntas.length !== 4) d.push('pacote sem 4 perguntas');
        pac.perguntas.forEach(x => {
          if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel) d.push('pergunta sem enunciado, fala ou nível');
          if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
          if (x.certa < 0 || !Number.isInteger(x.certa)) d.push('certa inválida ' + x.certa);
        });
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("Pacotes de contas")');
  ok(await p.locator('.brincadeira-pacote').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(`.opcoes-pacote button:text-is("${v}")`);
  const certa = () => p.evaluate(() => LB.app.perguntaPacote.certa);

  const errada = await p.evaluate(() => LB.app.perguntaPacote.opcoes.find(o => o !== LB.app.perguntaPacote.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'acerto da 1ª pergunta');
  ok(await estrelas() === e0, 'no meio do pacote ainda não ganha estrela');

  // 11 perguntas restantes (último pacote termina com Concluir)
  for (let i = 0; i < 11; i++) { await p.click('text=Próximo'); await clicar(await certa()); }
  ok(await estrelas() === e0 + 3, 'um pacote completo = 1 estrela; rodada = 3 estrelas: ' + (await estrelas() - e0));
  await p.click('text=Concluir');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos['pacote'] === true), 'concluir volta e marca feito');

  // Filtros da lista
  await p.click('.filtro >> text=Português');
  ok(await p.locator('.bloco-brincadeira:has-text("Pacotes de contas")').count() === 0, 'Português esconde a brincadeira');
  await p.click('.filtro >> text=Matemática');
  ok(await p.locator('.bloco-brincadeira:has-text("Pacotes de contas")').count() === 1, 'Matemática mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_pacote: ${falhas} falha(s)` : 't_pacote: OK');
  process.exit(falhas ? 1 : 0);
})();
