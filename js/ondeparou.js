// Continuar de onde parou: guarda a história (e a pergunta) ou a atividade aberta e, ao reabrir o app,
// volta direto para ela. Fora dessas telas, não guarda nada. Passo de missão de outro dia não volta
// (a missão mudou); a pergunta abre fora da missão. Teste: testes/t_ondeparou.js
LB.usarOndeParou = function (ctx, historias, atividades) {
  'use strict';
  const { watch } = Vue;
  const hoje = () => new Date().toISOString().slice(0, 10);
  let pronto = false;    // só anota depois de retomar (senão a tela inicial apagaria o que estava guardado)

  // Foto da tela atual: { tipo, id, perguntas, indice, passo, dia } ou null
  function foto() {
    const passo = ctx.passoAtivo.value, dia = hoje();
    if (ctx.tela.value === 'historia' && historias.historiaAtual.value) {
      const h = historias.historiaAtual.value;
      let indice = historias.indicePergunta.value;
      if (historias.rh.terminou && indice + 1 < h.perguntas.length) indice++;   // já respondida: volta na próxima
      return { tipo: 'historia', id: h.id, perguntas: historias.mostrandoPerguntas.value, indice, passo, dia };
    }
    if (ctx.tela.value === 'atividade' && atividades.atividadeAtual.value) {
      if (atividades.ra.terminou) return null;   // já respondida: não há o que continuar
      return { tipo: 'atividade', id: atividades.atividadeAtual.value.id, passo, dia };
    }
    return null;
  }

  watch(foto, f => { if (pronto) ctx.ondeParou.value = f; }, { deep: true });

  // Abre de novo o que estava guardado (chamado uma vez, ao abrir o app).
  function retomar() {
    const o = ctx.ondeParou.value;
    pronto = true;
    if (!o) return false;
    const passo = o.dia === hoje() ? o.passo : null;
    if (o.tipo === 'historia') {
      const h = LB.CONTEUDO.stories.find(x => x.id === o.id);
      if (!h) return (ctx.ondeParou.value = null, false);
      historias.abrirHistoria(h);
      ctx.passoAtivo.value = passo;
      if (o.perguntas) {
        historias.mostrandoPerguntas.value = true;
        historias.indicePergunta.value = Math.min(o.indice || 0, h.perguntas.length - 1);
        historias.rh.zerar();
      }
      return true;
    }
    if (o.tipo === 'atividade') {
      const a = LB.CONTEUDO.activities.find(x => x.id === o.id);
      if (!a) return (ctx.ondeParou.value = null, false);
      atividades.abrirAtividade(a);
      ctx.passoAtivo.value = passo;
      return true;
    }
    return false;
  }

  return { retomar };
};
