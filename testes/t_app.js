// Teste guardado: abre o app no navegador (Playwright) e confere as telas principais.
// Uso: node testes/t_app.js   (precisa de vendor/vue.global.prod.js e vendor/dexie.min.js)
'use strict';
const path = require('path');
const { novaPagina, abrirApp } = require('./_navegador');
const pasta = process.env.CAPTURAS || '';   // se definido, salva capturas de tela nessa pasta

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const { b, p, erros } = await novaPagina();
  p.on('requestfailed', r => { if (!/^data:|fonts.g|vendor\/fontes\//.test(r.url())) erros.push('não carregou: ' + r.url()); });
  const foto = async (n) => { if (pasta) await p.screenshot({ path: path.join(pasta, n + '.png') }); };

  await abrirApp(p);
  ok(await p.evaluate(() => typeof Vue !== 'undefined' && typeof Dexie !== 'undefined'), 'Vue e Dexie locais');
  ok((await p.locator('.bloco-menu').count()) === 3, 'tela inicial com 3 botões grandes (Português, Matemática, Prêmios)');
  ok((await p.locator('.mini-trilha span').count()) === 8, 'missão do dia com 8 passos na tela inicial');
  ok(await p.evaluate(() => !!(LB.voz && LB.festa && LB.tentativas)), 'voz, festa e tentativas carregados');
  ok(await p.locator('.mascote-saudacao .humor-normal').count() === 1 && (await p.textContent('.balao-mascote')).includes('Começar'),
    'mascote no início com balão de fala');
  await foto('1-inicio');

  // Abre uma história e responde a 1ª pergunta certo
  await p.click('nav >> text=Português');
  await p.click('.bloco-brincadeira:has-text("Histórias")');
  await p.locator('.card').first().click();
  await foto('2-historia');
  await p.getByRole('button', { name: /pergunta|responder|vamos/i }).first().click().catch(() => ok(false, 'botão de ir às perguntas'));
  ok((await p.locator('.opcao').count()) >= 3, 'história mostra a 1ª pergunta com opções');
  // Atividade mat-036 (8 maçãs ÷ 4 = 2): o valor 2 está na posição 0
  await p.evaluate(() => {
    const vm = LB.app;
    vm.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036'));
  });
  await p.waitForSelector('.opcao');
  // As opções são sorteadas (js/sorteio.js): achar o botão pela resposta, não pela posição
  const posCerta = () => p.evaluate(() => { const a = LB.app.atividadeAtual; return a.opcoes.findIndex((_, i) => LB.respostas.ehCorreta(a, i)); });
  let c = await posCerta();
  ok(await p.evaluate(() => String(LB.app.atividadeAtual.opcoes.find((_, i) => LB.respostas.ehCorreta(LB.app.atividadeAtual, i)))) === '2', 'mat-036: 2 é a certa');
  await p.locator('.opcao').nth(c).click();
  ok(await p.locator('.opcao').nth(c).evaluate(e => e.classList.contains('correta')), 'mat-036: tocar no 2 marca certa');
  ok(await p.locator('.feedback .mascote-mini .humor-feliz').count() === 1, 'acerto: mascote feliz no balão');
  await foto('3-atividade');

  // Nova tentativa: 1º erro apaga a opção e deixa tentar; 2º erro mostra a certa
  await p.evaluate(() => LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036')));
  c = await posCerta();
  const [e1, e2] = [0, 1, 2].filter(i => i !== c);
  await p.locator('.opcao').nth(e1).click();
  ok(await p.locator('.opcao').nth(e1).evaluate(e => e.classList.contains('errada')), '1º erro marca a opção');
  ok(await p.locator('.opcao').nth(e2).isEnabled(), '1º erro: ainda pode tentar');
  await p.locator('.opcao').nth(e2).click();
  ok(await p.locator('.opcao').nth(c).evaluate(e => e.classList.contains('correta')), '2º erro: mostra a certa');
  ok((await p.textContent('.feedback')).length > 20, '2º erro: mostra a explicação');
  ok(await p.evaluate(() => { const c = LB.app.caderno; return c.itens['mat-036'] && c.itens['mat-036'].seguidos === 0 && c.hab[LB.app.atividadeAtual.habilidadeBNCC].erradas === 1; }),
    'caderno de erros: atividade errada entra uma vez só');

  // Missão: faz o 2º passo (Português) e volta para a trilha com 1 passo feito
  await p.evaluate(() => LB.app.irPara('home'));
  await p.click('.card-missao');
  ok(await p.locator('.trilha .passo').count() === 8, 'trilha da missão com 8 passos');
  await p.evaluate(() => LB.app.fazerPasso(1));
  await p.waitForSelector('.opcao');
  const certa = await p.evaluate(() => { const a = LB.app.atividadeAtual; return a.opcoes.findIndex((_, i) => LB.respostas.ehCorreta(a, i)); });
  await p.locator('.opcao').nth(certa).click();
  await p.click('text=Continuar →');
  ok(await p.evaluate(() => LB.app.tela === 'missao' && LB.app.passosFeitos === 1), 'missão: passo feito volta para a trilha');
  await foto('5-missao');
  const missaoAntes = await p.evaluate(() => JSON.stringify(LB.app.missao));
  ok(await p.evaluate(() => { const m = LB.app.missao; LB.app.missao = { ...m, feitos: m.feitos.map(() => true) }; return LB.app.missaoCompleta; })
    && await p.locator('.mascote-grande .humor-festa').count() === 1, 'missão completa: mascote em festa');
  await foto('5b-missao-completa');
  await p.evaluate(() => LB.app.irPara('home'));
  ok(await p.locator('.mascote-saudacao .humor-festa').count() === 1, 'início: mascote em festa com a missão completa');
  await foto('1b-inicio-festa');
  await p.evaluate((m) => { LB.app.missao = JSON.parse(m); }, missaoAntes);

  // Colorir: abre o desenho 30 (novo) e pinta
  await p.evaluate(() => {
    const vm = LB.app;
    vm.abrirColorir(LB.CONTEUDO.colorir.find(c => c.id === 'colorir-30'));
  });
  await p.waitForTimeout(300);
  ok((await p.locator('svg path:not(.solto)').count()) > 8, 'colorir-30 (Abelha) desenhado');
  await foto('4-colorir');

  // Conquistas (selos) pela barra de baixo: Prêmios → Meus selos
  await p.click('nav >> text=Prêmios');
  await p.click('.bloco-brincadeira:has-text("Meus selos")');
  ok((await p.locator('.selo').count()) > 0, 'tela de conquistas mostra os selos');
  // Portão dos adultos abre pelo ⚙️
  await p.click('button[title=Ajustes]');
  ok(await p.locator('.portao-parental').isVisible(), 'portão dos adultos abre');
  await p.fill('.campo-portao', '1');
  await p.click('.portao-parental .btn-primario');
  ok(await p.locator('.portao-parental').isVisible(), 'conta errada não abre a área dos adultos');
  const conta2 = await p.evaluate(() => LB.app.portao.a * LB.app.portao.b);
  await p.fill('.campo-portao', String(conta2));
  await p.click('.portao-parental .btn-primario');
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => LB.app.tela === 'responsavel'), 'conta certa abre a área do responsável');
  ok((await p.locator('.linha-erro').count()) > 0, 'área do responsável lista onde errou');
  const folha = await p.evaluate(() => LB.impressao.atividades(LB.CONTEUDO.activities.slice(0, 2), 'Teste'));
  ok(folha.includes('Nome:') && folha.includes('print-questao'), 'folha de atividades para imprimir');
  await foto('6-responsavel');
  // Escolher voz: aparelho de teste pode não ter vozes; então só confere que a tela e o botão existem
  ok((await p.locator('text=Toque numa voz para ouvir e escolher').count()) === 1, 'ajustes mostra a escolha de voz');
  ok((await p.locator('button.filtro:has-text("Automática"), p.card-meta:has-text("Nenhuma voz")').count()) >= 1, 'escolha de voz tem Automática ou aviso de sem voz');

  // Fase 6: cópia de segurança, caixa de confirmação própria, ajustes de movimento
  ok(await p.locator('text=Cópia de segurança').isVisible(), 'área do responsável mostra a cópia de segurança');
  const copia = await p.evaluate(async () => LB.backup.gerar(LB.app.estadoAtual(), await LB.tentativas.todas()));
  const estrelasAntes = await p.evaluate(() => LB.app.estrelas);
  await p.evaluate(() => { LB.app.estrelas = 999; });
  const trocou = p.evaluate(t => LB.app.importarTexto(t), copia);
  await p.waitForSelector('.caixa-confirmar');
  ok(await p.locator('.caixa-confirmar').isVisible(), 'importar pede confirmação na caixa própria');
  await p.click('.caixa-confirmar .btn-primario');
  ok(await trocou, 'importar devolve sim depois de confirmar');
  ok(await p.evaluate(() => LB.app.estrelas) === estrelasAntes, 'importar traz as estrelas da cópia');
  ok(!(await p.evaluate(() => LB.app.importarTexto('lixo'))) && /não é uma cópia/.test(await p.evaluate(() => LB.app.avisoCopia)), 'arquivo errado avisa sem mexer');
  let perguntou = false;
  p.once('dialog', d => { perguntou = true; d.dismiss(); });
  await p.click('text=🧹 Zerar progresso');
  ok(!perguntou && await p.locator('.caixa-confirmar').isVisible(), 'zerar usa a caixa própria (sem confirm do navegador)');
  await p.click('.caixa-confirmar .btn-secundario');
  ok(await p.locator('.caixa-confirmar').count() === 0 && await p.evaluate(() => LB.app.estrelas) === estrelasAntes, 'cancelar não zera');
  await foto('7-confirmar');
  await p.click('text=🧘 Reduzir movimento >> xpath=.. >> button');
  ok(await p.evaluate(() => document.documentElement.classList.contains('reduzir-movimento') && LB.festa.config.reduzirMovimento), 'reduzir movimento liga a classe e tira o confete');
  await p.evaluate(() => { document.querySelectorAll('.confete').forEach(c => c.remove()); LB.festa.acerto(false); });
  ok(await p.locator('.confete').count() === 0, 'sem confete com movimento reduzido');
  // Cor do app: Creme troca o fundo e fica guardada; Azul volta
  await p.click('button.filtro:has-text("Creme")');
  ok(await p.evaluate(() => document.documentElement.classList.contains('tema-creme') && LB.app.ajustes.tema === 'creme'
    && getComputedStyle(document.body).backgroundColor === 'rgb(255, 248, 238)'), 'cor Creme troca o fundo');
  await foto('8-creme');
  await p.click('button.filtro:has-text("Azul")');
  ok(await p.evaluate(() => !document.documentElement.classList.contains('tema-creme')), 'cor Azul volta');
  await p.evaluate(() => window.dispatchEvent(new Event('lb-versao-nova')));
  ok(await p.locator('.aviso-versao').isVisible(), 'aviso de versão nova aparece');

  // Tablet deitado (css/tablet.css): início em duas colunas, os 4 botões à vista sem rolar
  await p.setViewportSize({ width: 1280, height: 800 });
  await p.evaluate(() => LB.app.irPara('home'));
  ok(await p.evaluate(() => { const b = [...document.querySelectorAll('.bloco-menu')].pop().getBoundingClientRect(); return b.bottom < innerHeight - 60; }),
    'tablet deitado: os 4 botões do início aparecem sem rolar');
  await p.evaluate(() => LB.app.abrirColorir(LB.CONTEUDO.colorir[0]));
  await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.querySelector('.svg-colorir svg').getBoundingClientRect().bottom < innerHeight - 60), 'tablet deitado: desenho de colorir cabe na tela');

  ok(erros.length === 0, 'erros no navegador: ' + erros.join(' | '));
  await b.close();
  console.log(falhas ? `t_app: ${falhas} falha(s)` : 't_app: OK');
  process.exit(falhas ? 1 : 0);
})();
