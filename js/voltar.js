// Botão "voltar" do celular/navegador: em vez de fechar o app, faz o mesmo que o "← Voltar" da tela
// (ou fecha a caixa que estiver aberta por cima). Fora do início, deixa uma "marca" no histórico do
// navegador; o voltar do aparelho gasta a marca e o app trata o pedido. No início, voltar sai do app.
// Teste: testes/t_rolagem.js (parte "voltar")
LB.usarVoltarAparelho = function (ctx) {
  'use strict';
  if (!window.history || !history.pushState) return;
  let temMarca = false;
  let saindo = false;    // a marca está sendo tirada por nós (history.back): ignorar esse popstate

  const visivel = el => !!el && el.getClientRects().length > 0;   // vale também para caixas fixas na tela
  const primeiro = sel => [...document.querySelectorAll(sel)].find(visivel);
  // Caixas por cima ("Tem certeza?", selo novo) ou a trava dos adultos aberta
  const caixaAberta = () => primeiro('.caixa-fundo') || primeiro('.portao-parental');
  const precisaMarca = () => ctx.tela.value !== 'home' || !!caixaAberta();

  function acertar() {
    if (saindo) return;
    if (precisaMarca() && !temMarca) { history.pushState({ lb: 'marca' }, ''); temMarca = true; }
    else if (!precisaMarca() && temMarca) { temMarca = false; saindo = true; history.back(); }
  }

  function voltarUmPasso() {
    const caixa = primeiro('.caixa-fundo');
    if (caixa) return caixa.click();                     // clicar no fundo fecha a caixa (responde "não")
    const cancelar = primeiro('.portao-parental .btn-secundario');
    if (cancelar) return cancelar.click();
    const botao = primeiro('.cabecalho-app .btn-voltar') || primeiro('.container .btn-voltar');
    if (botao) return botao.click();
    if (ctx.tela.value !== 'home') ctx.irPara('home');
  }

  window.addEventListener('popstate', () => {
    if (saindo) { saindo = false; return acertar(); }
    temMarca = false;
    voltarUmPasso();
    Vue.nextTick(acertar);
  });
  Vue.watch(ctx.tela, () => Vue.nextTick(acertar));
  // Caixas abrem sem trocar de tela: confere quando a página muda
  new MutationObserver(() => Vue.nextTick(acertar)).observe(document.body, { childList: true, subtree: true });
};
