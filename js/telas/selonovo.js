// Selo novo: quando um selo é ganho, mostra uma janela de festa (molde js/moldes/selonovo.js).
// Também festeja quando uma habilidade sobe de nível (ctx.festejarNivel, js/nivel.js); essa não vira selo visto.
// ctx.selosVistos guarda os selos já mostrados (null = ainda não carregado; não mostra nada).
LB.usarSeloNovo = function (ctx, selos) {
  'use strict';
  const { ref, watch } = Vue;
  const seloNovo = ref(null);   // selo na janela agora
  const fila = [];              // selos ganhos esperando a vez
  const ganhos = () => selos.value.filter(s => s.desbloqueado).map(s => s.id);

  // Ao carregar (ou restaurar cópia antiga sem a lista): os selos que já existem contam como vistos.
  ctx.prepararSelos = () => {
    if (!Array.isArray(ctx.selosVistos.value)) ctx.selosVistos.value = ganhos();
  };

  function mostrar() {
    if (seloNovo.value || !fila.length) return;
    seloNovo.value = fila.shift();
    LB.festa.grande(ctx.ajustes.value.som !== false);
    ctx.falarSozinho(seloNovo.value.titulo + ' ' + seloNovo.value.nome);
  }

  ctx.festejarNivel = (habilidade) => {
    fila.push({ id: 'nivel:' + habilidade, nivel: true, emoji: '🚀', titulo: 'Você subiu de nível!', nome: LB.nomeHabilidade(habilidade) });
    setTimeout(mostrar, 900);
  };

  function fecharSeloNovo() {
    const s = seloNovo.value;
    if (!s) return;
    if (!s.nivel && !ctx.selosVistos.value.includes(s.id)) ctx.selosVistos.value = [...ctx.selosVistos.value, s.id];
    seloNovo.value = null;
    if (fila.length) setTimeout(mostrar, 400);
  }

  watch([selos, ctx.selosVistos], () => {
    const vistos = ctx.selosVistos.value;
    if (!Array.isArray(vistos)) return;
    const novos = selos.value.filter(s => s.desbloqueado && !vistos.includes(s.id) &&
      !fila.some(f => f.id === s.id) && seloNovo.value?.id !== s.id);
    if (!novos.length) return;
    fila.push(...novos.map(s => ({ ...s, titulo: 'Selo novo!' })));
    setTimeout(mostrar, 900); // espera a festa do acerto ou da missão passar
  });

  return { seloNovo, fecharSeloNovo };
};
