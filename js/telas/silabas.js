// Brincadeira "Monte a Palavra": tocar nas sílabas na ordem certa para formar a palavra da dica.
// Palavras: conteudo/silabas.js (gerado por build/gerar-silabas.js). O vai e vem da rodada fica no kit js/rodada.js.
LB.usarSilabas = function (ctx) {
  'use strict';
  const { ref } = Vue;
  const POR_RODADA = 5;
  const embaralhar = LB.rodada.embaralhar;
  const slotsSilabas = ref([]);
  const bancoSilabas = ref([]);

  // Sorteia a rodada: primeiro as palavras que ela ainda não acertou; depois ordena por nível.
  function sortearRodada() {
    const lista = embaralhar(LB.silabas || []);
    const feitas = ctx.concluidos.value;
    const novas = lista.filter(p => !feitas[p.id]), velhas = lista.filter(p => feitas[p.id]);
    return [...novas, ...velhas].slice(0, POR_RODADA).sort((a, b) => a.nivel - b.nivel);
  }

  // Cada palavra: casas vazias + banco com as sílabas certas e as extras, embaralhadas.
  function montarPalavra(atual) {
    slotsSilabas.value = Array(atual.silabas.length).fill(null);
    bancoSilabas.value = embaralhar([
      ...atual.silabas.map((texto, i) => ({ id: 'certa-' + i + '-' + texto, texto })),
      ...atual.extras.map((texto, i) => ({ id: 'extra-' + i + '-' + texto, texto }))
    ]);
  }

  const r = LB.rodada(ctx, { id: 'silabas', habilidade: 'EF02LP02', titulo: 'Monte a Palavra', sortear: sortearRodada, frase: p => p.dica, aoCarregar: montarPalavra });

  function conferirPalavra() {
    if (slotsSilabas.value.some(item => item === null)) return;
    const montada = slotsSilabas.value.map(b => b.texto).join('');
    const certa = r.atual.value.palavra;
    if (montada !== certa) return r.errou('Quase lá! Toque em uma sílaba para trocar e tentar de novo.');
    ctx.marcarConcluido(r.atual.value.id);
    r.acertou('Muito bem! Você formou ' + certa + '! ⭐', 'Muito bem! ' + certa);
  }

  function encaixarSilaba(bloco) {
    if (r.estado.value === 'correto') return;
    const vazio = slotsSilabas.value.findIndex(item => item === null);
    if (vazio === -1) return;
    slotsSilabas.value[vazio] = bloco;
    bancoSilabas.value = bancoSilabas.value.filter(b => b.id !== bloco.id);
    LB.voz.falar(bloco.texto);
    conferirPalavra();
  }

  function devolverSilaba(idx) {
    if (r.estado.value === 'correto') return;
    const bloco = slotsSilabas.value[idx];
    if (!bloco) return;
    slotsSilabas.value[idx] = null;
    bancoSilabas.value.push(bloco);
    r.limpar();
  }

  return {
    palavrasSilabas: r.lista, indiceSilabas: r.indice, palavraSilabas: r.atual, mensagemSilabas: r.mensagem, estadoSilabas: r.estado,
    slotsSilabas, bancoSilabas, abrirSilabas: r.abrir, encaixarSilaba, devolverSilaba, proximaSilabas: r.seguir, concluirSilabas: r.concluir
  };
};
