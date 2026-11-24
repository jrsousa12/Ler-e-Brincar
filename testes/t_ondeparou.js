// Teste guardado: continuar de onde parou (js/ondeparou.js). Abre uma história/atividade, recarrega
// a página (como fechar e abrir o app) e confere se voltou à mesma pergunta. Uso: node testes/t_ondeparou.js
'use strict';
const { INDEX, novaPagina } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  const espera = ms => p.waitForTimeout(ms);
  const abrirApp = async () => { await p.waitForSelector('#app .cabecalho-app', { timeout: 5000 }).catch(() => {}); await espera(600); };
  const reabrir = async () => { await espera(500); await p.reload(); await abrirApp(); };   // 500 ms: dá tempo de guardar
  const estado = () => p.evaluate(() => ({
    tela: LB.app.tela, historia: LB.app.historiaAtual && LB.app.historiaAtual.id, perguntas: LB.app.mostrandoPerguntas,
    indice: LB.app.indicePergunta, atividade: LB.app.atividadeAtual && LB.app.atividadeAtual.id, passo: LB.app.passoAtivo
  }));

  let avisos = 0;
  p.on('console', m => { if (m.type() === 'warning' && /clone|IDB|Dexie/i.test(m.text() + '')) avisos++; });
  await p.goto(INDEX);
  await abrirApp();

  // 0) Progresso guardado no aparelho (js/banco.js): estrelas e feitos sobrevivem a fechar e abrir
  await p.evaluate(() => { LB.app.estrelas = 7; LB.app.marcarConcluido('lp-001'); });
  await reabrir();
  ok(await p.evaluate(() => LB.app.estrelas === 7 && !!LB.app.concluidos['lp-001']), 'estrelas e atividades feitas continuam depois de reabrir');

  // 1) História: responde certo a 1ª pergunta e fecha → volta na 2ª pergunta da mesma história
  const hid = await p.evaluate(() => {
    const h = LB.CONTEUDO.stories.find(x => x.perguntas.length >= 2);
    LB.app.abrirHistoria(h);
    LB.app.iniciarPerguntasHistoria();
    return h.id;
  });
  await espera(200);
  await p.evaluate(() => {
    const q = LB.app.perguntaAtual;
    LB.app.rh.responder(q.opcoes.findIndex((_, i) => LB.respostas.ehCorreta(q, i)));
  });
  await reabrir();
  let e = await estado();
  ok(e.tela === 'historia' && e.historia === hid, 'reabre na mesma história (' + e.tela + ', ' + e.historia + ')');
  ok(e.perguntas && e.indice === 1, 'volta na 2ª pergunta, a que faltava (índice ' + e.indice + ')');
  ok(await p.locator('.opcao').count() >= 2, 'as opções da pergunta aparecem');

  // 2) Lendo o texto (antes das perguntas) → volta no texto da história
  await p.evaluate(() => LB.app.abrirHistoria(LB.CONTEUDO.stories[0]));
  await reabrir();
  e = await estado();
  ok(e.tela === 'historia' && !e.perguntas, 'reabre no texto da história, antes das perguntas');

  // 3) Atividade sem responder → volta na mesma atividade
  await p.evaluate(() => LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036')));
  await reabrir();
  e = await estado();
  ok(e.tela === 'atividade' && e.atividade === 'mat-036', 'reabre na mesma atividade');

  // 4) Atividade já respondida → abre no início (não há o que continuar)
  await p.evaluate(() => {
    const a = LB.app.atividadeAtual;
    LB.app.ra.responder(a.opcoes.findIndex((_, i) => LB.respostas.ehCorreta(a, i)));
  });
  await reabrir();
  ok((await estado()).tela === 'home', 'atividade já respondida: reabre no início');

  // 5) Passo da missão: hoje continua na missão; de outro dia, abre fora da missão
  await p.evaluate(() => { LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036')); LB.app.passoAtivo = 2; });
  await reabrir();
  e = await estado();
  ok(e.tela === 'atividade' && e.passo === 2, 'passo da missão de hoje: continua dentro da missão');
  await p.evaluate(async () => {   // finge que foi guardado ontem
    const est = await LB.banco.carregarEstado();
    est.ondeParou.dia = '2000-01-01';
    await LB.banco.salvarEstado(est);
  });
  await p.reload(); await abrirApp();
  e = await estado();
  ok(e.tela === 'atividade' && e.passo === null, 'passo de outro dia: abre a atividade, fora da missão');

  // 6) Saiu para o início → reabre no início
  await p.evaluate(() => LB.app.irPara('home'));
  await reabrir();
  ok((await estado()).tela === 'home', 'saiu para o início: reabre no início');

  ok(avisos === 0, 'o banco do aparelho aceitou guardar (sem aviso de cópia)');
  ok(erros.length === 0, 'sem erros na página: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_ondeparou: ${falhas} falha(s)` : 't_ondeparou: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
