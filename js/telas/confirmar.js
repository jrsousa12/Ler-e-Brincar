// Caixa de confirmação própria (no lugar do confirm do navegador).
// Uso: if (await ctx.perguntar({ titulo, texto, sim, nao })) { ... }
LB.usarConfirmar = function (ctx) {
  'use strict';
  const { ref } = Vue;
  const confirmacao = ref(null); // { titulo, texto, sim, nao } enquanto a caixa está aberta
  let resolver = null;

  function perguntar(opcoes) {
    if (resolver) resolver(false);
    confirmacao.value = { titulo: 'Tem certeza?', sim: 'Sim', nao: 'Cancelar', ...opcoes };
    return new Promise(r => { resolver = r; });
  }
  function responderConfirmacao(sim) {
    confirmacao.value = null;
    const r = resolver;
    resolver = null;
    if (r) r(!!sim);
  }
  ctx.perguntar = perguntar;
  return { confirmacao, responderConfirmacao };
};
