// Brincadeira "Trem dos números": achar o número que falta na sequência de 2 em 2, 5 em 5 ou 10 em 10 (regras em js/tremregras.js).
// O vai e vem da rodada (estrela, Próximo, Concluir) fica no kit js/rodada.js.
LB.usarTrem = function (ctx) {
  'use strict';
  const fraseTrem = t => 'Conte de ' + t.passo + ' em ' + t.passo + '. ' + (t.faltam.length > 1 ? 'Quais números faltam?' : 'Qual número falta?');

  const r = LB.rodada(ctx, {
    id: 'trem',
    sortear: () => LB.tremRegras.sortearRodada(),
    etapas: t => t.faltam,
    frase: fraseTrem,
    textos: {
      erro: (valor, t) => 'Não foi o ' + valor + '. Conte de ' + t.passo + ' em ' + t.passo + ' e tente outro!',
      acerto: (q, t, final) => final
        ? ['Isso! O número é ' + q.certa + '! ⭐', 'Muito bem! O número é ' + q.certa + '!']
        : ['Isso! Agora falta mais um vagão.', 'Isso! Agora falta mais um vagão.']
    }
  });

  // Vagão já respondido mostra o número; o vazio mostra "?".
  function vagaoTrem(i) {
    const t = r.atual.value, etapa = r.etapa.value;
    const k = t.faltam.findIndex(f => f.pos === i);
    const respondido = k >= 0 && (k < etapa || (k === etapa && r.estado.value === 'correto'));
    return { numero: t.numeros[i], vazio: k >= 0 && !respondido, ativo: k >= 0 && k === etapa && !respondido };
  }

  return { ...r.exportar('Trem'), trensTrem: r.lista, tremAtual: r.atual, ultimoDoTrem: r.ultimo, fraseTrem, vagaoTrem };
};
