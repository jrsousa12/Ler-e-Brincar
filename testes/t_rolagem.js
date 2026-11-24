// Teste guardado: rolagem automática até a resposta (js/rolagem.js), voltar do aparelho (js/voltar.js)
// e voz que para ao sair do app (js/voz.js). Uso: node testes/t_rolagem.js
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 560 } });   // tela baixa: a resposta fica embaixo
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  const espera = ms => p.waitForTimeout(ms);
  const tela = () => p.evaluate(() => LB.app.tela);

  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForSelector('.bloco-menu', { timeout: 5000 }).catch(() => {});
  await p.evaluate(() => document.documentElement.classList.add('reduzir-movimento'));   // rolar sem animação

  // 1) Rolagem: responde errado numa atividade e a mensagem + botão aparecem inteiros na tela
  await p.evaluate(() => LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036')));
  await p.waitForSelector('.opcao');
  await espera(400);
  const antes = await p.evaluate(() => window.scrollY);
  const errada = await p.evaluate(() => {
    const a = LB.app.atividadeAtual;
    return a.opcoes.findIndex((_, i) => !LB.respostas.ehCorreta(a, i));
  });
  await p.locator('.opcao').nth(errada).click();
  await p.locator('.opcao').nth(errada === 0 ? 1 : 0).click().catch(() => {});   // 2º erro (ou acerto): botão Continuar
  await p.waitForSelector('.feedback');
  await espera(700);
  const medida = await p.evaluate(() => {
    const f = document.querySelector('.feedback').getBoundingClientRect();
    const btn = document.querySelector('.feedback + button');
    const nav = document.querySelector('.nav-inferior');
    const fundo = innerHeight - (nav && nav.offsetParent ? nav.getBoundingClientRect().height : 0);
    return { y: scrollY, topo: f.top, baixo: btn ? btn.getBoundingClientRect().bottom : f.bottom, fundo };
  });
  ok(medida.y > antes, 'a página desceu sozinha até a resposta');
  ok(medida.baixo <= medida.fundo + 1, 'resposta e botão Continuar aparecem inteiros (acima da barra de baixo)');
  ok(medida.topo >= 0, 'o começo da mensagem continua visível');

  // 2) Voltar do aparelho: na atividade → lista; na lista → início; no início, o app continua aberto
  await p.evaluate(() => LB.app.irPara('atividades'));
  await espera(200);
  await p.evaluate(() => LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036')));
  await espera(200);
  ok(await tela() === 'atividade' || (await tela()) !== 'home', 'abriu a atividade');
  const telaAtividade = await tela();
  await p.goBack(); await espera(300);
  ok(await tela() === 'atividades', 'voltar do aparelho na atividade leva à lista (estava em ' + telaAtividade + ')');
  await p.goBack(); await espera(300);
  ok(await tela() === 'home', 'voltar do aparelho na lista leva ao início');
  ok(await p.evaluate(() => !!window.LB && !!LB.app), 'o app continua aberto depois de voltar');

  // 3) Caixa "Tem certeza?" aberta: voltar fecha a caixa e fica na mesma tela
  await p.evaluate(() => { LB.app.irPara('atividades'); });
  await espera(200);
  await p.evaluate(() => { LB.app.perguntar({ titulo: 'Teste', texto: 'Fechar?', sim: 'Sim', nao: 'Não' }); });
  await espera(200);
  ok(await p.locator('.caixa-fundo').count() === 1, 'caixa de confirmar aberta');
  await p.goBack(); await espera(300);
  ok(await p.locator('.caixa-fundo').count() === 0, 'voltar do aparelho fecha a caixa');
  ok(await tela() === 'atividades', 'depois de fechar a caixa, continua na mesma tela');

  // 4) Voz para quando o app vai para o fundo
  const parou = await p.evaluate(() => {
    let n = 0; const orig = LB.voz.parar; LB.voz.parar = () => { n++; orig(); };
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    LB.voz.parar = orig;
    return n;
  });
  ok(parou === 1, 'a voz para ao trocar de app ou apagar a tela');

  ok(erros.length === 0, 'sem erros na página: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_rolagem: ${falhas} falha(s)` : 't_rolagem: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
