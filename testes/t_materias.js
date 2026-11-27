// Teste guardado: mapa por matéria (Etapa B, 27/11): Início · Português · Matemática · Prêmios.
// Confere os botões de cada tela, o menu de baixo aceso e o Voltar de cada brincadeira.
// Uso: node testes/t_materias.js
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);
  const espera = ms => p.waitForTimeout(ms);
  const tela = () => p.evaluate(() => LB.app.tela);
  const textos = sel => p.locator(sel).allInnerTexts();
  const aba = () => p.locator('.nav-inferior a.ativo').innerText();

  // Início: 3 botões grandes e menu de baixo com as 4 abas
  const menu = (await textos('.grade-menu .bloco-menu')).join('|');
  ok(/Português/.test(menu) && /Matemática/.test(menu) && /Prêmios/.test(menu) && (await textos('.grade-menu .bloco-menu')).length === 3, 'início com Português, Matemática e Prêmios: ' + menu);
  ok((await textos('.nav-inferior a')).map(t => t.replace(/\s+/g, ' ').trim()).join('|').replace(/[^\wÀ-ú|]/g, '') === 'Início|Português|Matemática|Prêmios', 'menu de baixo com as 4 abas');
  ok(await p.locator('.card-missao').count() === 1, 'missão do dia continua no início');

  // Cada tela da matéria: botões na ordem combinada
  const esperado = {
    portugues: ['Histórias', 'Questões', 'Monte a Palavra', 'Memória', 'Som e Figura', 'Ordem dos Fatos'],
    matematica: ['Contas', 'Mercadinho', 'Trem dos números', 'Pacotes de contas', 'Que horas são?', 'Régua'],
    premios: ['Meus selos', 'Colorir']
  };
  for (const [t, nomes] of Object.entries(esperado)) {
    await p.evaluate(x => LB.app.irPara(x), t); await espera(150);
    const achou = (await textos('.container .bloco-brincadeira')).map(s => s.replace(/[✓\n]/g, ' ').trim());
    ok(nomes.every((n, i) => (achou[i] || '').includes(n)) && achou.length === nomes.length, t + ': ' + achou.join(', '));
    ok((await aba()).includes(nomes === esperado.premios ? 'Prêmios' : t === 'portugues' ? 'Português' : 'Matemática'), t + ': aba de baixo acesa');
  }

  // Questões e Contas: lista só da matéria; Voltar leva à tela da matéria
  for (const [t, mat, botao] of [['portugues', 'lingua-portuguesa', 'Questões'], ['matematica', 'matematica', 'Contas']]) {
    await p.evaluate(x => LB.app.irPara(x), t); await espera(150);
    await p.click(`.bloco-brincadeira:has-text("${botao}")`); await espera(150);
    const cartoes = await p.locator('.cartao-atividade').evaluateAll(els => els.map(e => e.className));
    ok(await tela() === 'atividades' && cartoes.length > 0 && cartoes.every(c => c.includes(mat)), botao + ': só cartões de ' + mat);
    ok(await p.locator('.filtros, .grade-brincadeiras').count() === 0, botao + ': sem filtros nem brincadeiras na lista');
    await p.click('.cabecalho-app .btn-voltar'); await espera(150);
    ok(await tela() === t, botao + ': Voltar leva a ' + t);
  }

  // Atividade aberta de fora (missão, onde parou): Voltar leva à lista da matéria dela
  await p.evaluate(() => { LB.app.irPara('home'); LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.materia === 'matematica')); });
  await espera(150);
  ok((await aba()).includes('Matemática'), 'conta aberta acende a aba Matemática');
  await p.click('.cabecalho-app .btn-voltar'); await espera(150);
  ok(await tela() === 'atividades' && await p.evaluate(() => LB.app.filtroMateria) === 'matematica', 'Voltar da conta leva à lista de Contas');

  // Voltar de cada brincadeira e das listas de prêmios
  const casos = [['abrirSilabas', 'portugues'], ['abrirMemoria', 'portugues'], ['abrirSomFigura', 'portugues'], ['abrirOrdem', 'portugues'],
    ['abrirMercado', 'matematica'], ['abrirTrem', 'matematica'], ['abrirPacote', 'matematica']];
  for (const [abrir, destino] of casos) {
    await p.evaluate(f => { LB.app.irPara('home'); LB.app[f](); }, abrir); await espera(150);
    await p.click('.cabecalho-app .btn-voltar'); await espera(150);
    ok(await tela() === destino, abrir + ': Voltar leva a ' + destino + ' (foi a ' + await tela() + ')');
  }
  for (const [t, destino] of [['ler', 'portugues'], ['colorir', 'premios'], ['recompensas', 'premios'], ['portugues', 'home']]) {
    await p.evaluate(x => LB.app.irPara(x), t); await espera(150);
    await p.click('.cabecalho-app .btn-voltar'); await espera(150);
    ok(await tela() === destino, t + ': Voltar leva a ' + destino);
  }

  ok(erros.length === 0, 'sem erros no console: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_materias: ${falhas} falha(s)` : 't_materias: OK');
  process.exit(falhas ? 1 : 0);
})();
