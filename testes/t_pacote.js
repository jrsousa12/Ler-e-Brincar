// Teste guardado: brincadeira "Pacotes de contas" (js/pacoteregras.js = escolhas; js/telas/pacote.js = tela).
// Uso: node testes/t_pacote.js
// Rodada = 3 pacotes x 4 questões do banco (mesma habilidade por pacote); 1 estrela por pacote; caderno de erros.
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // REGRAS: 300 rodadas sem caderno, todas coerentes
  const defeitos = await p.evaluate(() => {
    const R = LB.pacoteRegras, d = [];
    const porId = Object.fromEntries(LB.mat.map(i => [i.id, i]));
    for (let i = 0; i < 300; i++) {
      const r = R.sortearRodada(LB.mat, LB.caderno.vazio());
      if (r.length !== 3) d.push('rodada sem 3 pacotes');
      if (new Set(r.map(x => x.habilidade)).size !== r.length) d.push('habilidade repetida na rodada');
      if (r.some((x, k) => k && x.media < r[k - 1].media)) d.push('pacotes fora da ordem de dificuldade');
      r.forEach(pac => {
        if (!pac.titulo || pac.titulo === 'Desafios' || typeof pac.fala !== 'string') d.push('pacote sem nome: ' + pac.habilidade);
        if (pac.perguntas.length !== 4) d.push('pacote sem 4 perguntas');
        if (new Set(pac.perguntas.map(q => q.id)).size !== pac.perguntas.length) d.push('questão repetida no pacote');
        if (pac.perguntas.some((q, k) => k && q.nivel < pac.perguntas[k - 1].nivel)) d.push('pacote fora da ordem de nível');
        pac.perguntas.forEach(q => {
          const orig = porId[q.id];
          if (!orig || orig.habilidadeBNCC !== pac.habilidade) d.push('questão de outra habilidade ' + q.id);
          if (new Set(q.opcoes.map(String)).size !== 3 || !q.opcoes.includes(q.certa)) d.push('opções ruins ' + q.id);
          if (!LB.respostas.ehCorreta(orig, orig.opcoes.indexOf(q.certa))) d.push('certa errada ' + q.id);
          if (q.revisao) d.push('revisão sem caderno ' + q.id);
        });
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'regras: ' + defeitos.join(' | '));

  // CADERNO: questão errada volta no pacote da habilidade dela; habilidade fraca sai mais
  const caderno = await p.evaluate(() => {
    const R = LB.pacoteRegras, alvo = LB.mat.find(i => i.habilidadeBNCC === 'EF02MA08');
    const c = LB.caderno.anotar(LB.caderno.vazio(), alvo, false, '2026-11-01');
    let volta = 0, comoRevisao = 0;
    for (let i = 0; i < 100; i++) {
      const pac = R.sortearRodada(LB.mat, c).find(x => x.habilidade === 'EF02MA08');
      const q = pac && pac.perguntas.find(x => x.id === alvo.id);
      if (q) volta++;
      if (q && q.revisao) comoRevisao++;
    }
    // Fraca: muitos erros de primeira em EF02MA09 (sem questão no caderno)
    const fraco = { itens: {}, hab: { EF02MA09: { certas: 0, erradas: 30 } } };
    let comPeso = 0, semPeso = 0;
    for (let i = 0; i < 300; i++) {
      if (R.sortearRodada(LB.mat, fraco).some(x => x.habilidade === 'EF02MA09')) comPeso++;
      if (R.sortearRodada(LB.mat, LB.caderno.vazio()).some(x => x.habilidade === 'EF02MA09')) semPeso++;
    }
    return { volta, comoRevisao, comPeso, semPeso };
  });
  ok(caderno.volta === 100 && caderno.comoRevisao === 100, 'questão do caderno volta sempre como revisão: ' + caderno.volta + '/' + caderno.comoRevisao);
  ok(caderno.comPeso > caderno.semPeso * 1.5, `habilidade fraca sai mais: ${caderno.comPeso} × ${caderno.semPeso}`);

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');   // Matemática
  await p.click('.bloco-brincadeira:has-text("Pacotes de contas")');
  ok(await p.locator('.brincadeira-pacote').count() === 1, 'abre a brincadeira');
  ok(await p.locator('.titulo-pacote').count() === 1, 'mostra o nome do pacote');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const noCaderno = () => p.evaluate(() => LB.app.noCaderno);
  const e0 = await estrelas(), c0 = await noCaderno();
  const clicar = v => p.locator('.opcoes-pacote button').filter({ hasText: new RegExp('^\\s*' + String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).click();
  const certa = () => p.evaluate(() => LB.app.perguntaPacote.certa);

  const errada = await p.evaluate(() => LB.app.perguntaPacote.opcoes.find(o => o !== LB.app.perguntaPacote.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1, 'acerto da 1ª pergunta');
  ok(await estrelas() === e0, 'no meio do pacote ainda não ganha estrela');
  ok(await noCaderno() === c0 + 1, 'errou antes de acertar: a questão entra no caderno');

  // 11 perguntas restantes, todas de primeira (último pacote termina com Concluir)
  for (let i = 0; i < 11; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  ok(await estrelas() === e0 + 3, 'um pacote completo = 1 estrela; rodada = 3 estrelas: ' + (await estrelas() - e0));
  ok(await noCaderno() === c0 + 1, 'acertos de primeira não põem questão no caderno');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'sem rolagem para o lado no celular');
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'matematica' && LB.app.concluidos['pacote'] === true), 'concluir volta e marca feito');

  // Filtros da lista
  // Fica só na tela de Matemática (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Pacotes de contas")').count() === 0, 'a outra matéria não mostra Pacotes de contas');
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Pacotes de contas")').count() === 1, 'a matéria certa mostra Pacotes de contas');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_pacote: ${falhas} falha(s)` : `t_pacote: OK (fraca: ${caderno.comPeso} × ${caderno.semPeso} sem peso)`);
  process.exit(falhas ? 1 : 0);
})();
