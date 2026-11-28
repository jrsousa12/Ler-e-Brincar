// Teste guardado: brincadeira "Ditado" (js/ditadoregras.js = contas; js/telas/ditado.js = tela).
// Uso: node testes/t_ditado.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
'use strict';
const { novaPagina, abrirApp } = require('./_navegador');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  await abrirApp(p);

  // REGRAS: 300 rodadas, todas coerentes (5 palavras sem repetir, teclado com todas as letras)
  const defeitos = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.ditadoRegras.sortearRodada();
      if (r.length !== 5 || new Set(r.map(x => x.id)).size !== 5) d.push('rodada sem 5 palavras diferentes');
      if (r.some((x, k) => k && r[k - 1].nivel > x.nivel)) d.push('fora de ordem de nível');
      if (r[0].nivel > 2) d.push('começa difícil');
      r.forEach(x => {
        const t = LB.ditadoRegras.teclado(x.palavra).map(l => l.texto);
        const falta = x.palavra.split('').filter(l => { const k = t.indexOf(l); if (k < 0) return true; t.splice(k, 1); return false; });
        if (falta.length) d.push('teclado sem letra de ' + x.palavra);
        if (t.length !== 3) d.push('teclado sem 3 letras de distração em ' + x.palavra);
        if (!x.fala || !x.emoji) d.push('palavra sem fala ou emoji');
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'regras: ' + defeitos.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.ler');
  await p.click('.bloco-brincadeira:has-text("Ditado")');
  ok(await p.locator('.brincadeira-ditado').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const palavra = () => p.evaluate(() => LB.app.atualDitado.palavra);
  // Toca na letra do teclado que falta (sem usar texto: o teclado repete letras).
  const digitar = async (txt) => {
    for (const l of txt) {
      const i = await p.evaluate(l => LB.app.teclasDitado.findIndex(t => t.texto === l), l);
      await p.locator('.teclado-ditado button').nth(i).click();
    }
  };

  // Erro: troca a primeira e a segunda letras. A 1ª letra errada volta; nenhuma estrela
  const w = await palavra();
  if (w[0] !== w[1]) {
    await digitar(w[1] + w[0] + w.slice(2, -1));
    await digitar(w.slice(-1));
    ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
    const certasFicaram = await p.evaluate(() => LB.app.casasDitado.filter(c => c).length);
    ok(certasFicaram === w.length - 2 || w.length < 3, 'letras certas ficam, erradas voltam: ' + certasFicaram);
    await digitar(w[0] + w[1]);
  } else await digitar(w);
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');

  // Devolver e apagar
  await p.click('.btn-proximo:has-text("Próxima")');
  const w2 = await palavra();
  await digitar(w2[0]);
  await p.click('.btn-apagar-ditado');
  ok(await p.evaluate(() => LB.app.casasDitado.every(c => c === null)), 'apagar devolve a letra');
  await digitar(w2);
  for (let i = 0; i < 3; i++) { await p.click('.btn-proximo:has-text("Próxima")'); await digitar(await palavra()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'portugues' && LB.app.concluidos['ditado'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Fica só na tela da sua matéria (js/telas/materias.js)
  await p.evaluate(() => LB.app.irPara('matematica'));
  ok(await p.locator('.bloco-brincadeira:has-text("Ditado")').count() === 0, 'a outra matéria não mostra a brincadeira');
  await p.evaluate(() => LB.app.irPara('portugues'));
  ok(await p.locator('.bloco-brincadeira:has-text("Ditado")').count() === 1, 'a matéria certa mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? `t_ditado: ${falhas} falha(s)` : 't_ditado: OK');
  process.exit(falhas ? 1 : 0);
})();
