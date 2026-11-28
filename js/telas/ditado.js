// Brincadeira "Ditado": a voz fala a palavra e a criança monta com letras grandes (regras em js/ditadoregras.js;
// vai e vem da rodada no kit js/rodada.js). Letra no lugar certo fica; as erradas voltam para o teclado.
LB.usarDitado = function (ctx) {
  'use strict';
  const { ref } = Vue;
  const casas = ref([]);
  const teclas = ref([]);

  const r = LB.rodada(ctx, {
    id: 'ditado', habilidade: 'EF02LP01', titulo: 'Ditado',
    sortear: () => LB.ditadoRegras.sortearRodada(),
    frase: d => d.fala,
    aoCarregar: d => { casas.value = Array(d.palavra.length).fill(null); teclas.value = LB.ditadoRegras.teclado(d.palavra); }
  });

  function conferir() {
    if (casas.value.some(c => c === null)) return;
    const palavra = r.atual.value.palavra;
    if (casas.value.map(c => c.texto).join('') === palavra) return r.acertou('Muito bem! Você escreveu ' + palavra + '! ⭐', 'Muito bem! ' + palavra);
    // Fica o que está certo; as letras erradas voltam para o teclado.
    casas.value = casas.value.map((c, i) => {
      if (c.texto === palavra[i]) return c;
      teclas.value.push(c);
      return null;
    });
    r.errou('Quase lá! As letras certas ficaram. Tente as outras!');
  }

  function porLetra(tecla) {
    if (r.estado.value === 'correto') return;
    if (r.estado.value) r.limpar();
    const vazio = casas.value.findIndex(c => c === null);
    if (vazio === -1) return;
    casas.value[vazio] = tecla;
    teclas.value = teclas.value.filter(t => t.id !== tecla.id);
    conferir();
  }

  function tirarLetra(i) {
    if (r.estado.value === 'correto' || !casas.value[i]) return;
    teclas.value.push(casas.value[i]);
    casas.value[i] = null;
    r.limpar();
  }

  function apagarUltima() {
    for (let i = casas.value.length - 1; i >= 0; i--) if (casas.value[i]) return tirarLetra(i);
  }

  return { ...r.exportar('Ditado'), casasDitado: casas, teclasDitado: teclas, porLetraDitado: porLetra, tirarLetraDitado: tirarLetra, apagarDitado: apagarUltima };
};
