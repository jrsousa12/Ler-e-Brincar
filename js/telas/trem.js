// Brincadeira "Trem dos números": achar o número que falta na sequência de 2 em 2, 5 em 5 ou 10 em 10 (regras em js/tremregras.js).
LB.usarTrem = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const trensTrem = ref([]);
  const indiceTrem = ref(0);
  const etapaTrem = ref(0);       // qual vagão vazio está sendo respondido
  const escolhaTrem = ref(null);
  const mensagemTrem = ref('');
  const estadoTrem = ref('');     // '', 'correto', 'tentar-novamente'
  const tremAtual = computed(() => trensTrem.value[indiceTrem.value]);
  const perguntaTrem = computed(() => tremAtual.value ? tremAtual.value.faltam[etapaTrem.value] : null);
  const somLigado = () => ctx.ajustes.value.som !== false;

  const fraseTrem = t => 'Conte de ' + t.passo + ' em ' + t.passo + '. ' + (t.faltam.length > 1 ? 'Quais números faltam?' : 'Qual número falta?');

  // Vagão já respondido mostra o número; o vazio mostra "?".
  function vagaoTrem(i) {
    const k = tremAtual.value.faltam.findIndex(f => f.pos === i);
    const respondido = k >= 0 && (k < etapaTrem.value || (k === etapaTrem.value && estadoTrem.value === 'correto'));
    return { numero: tremAtual.value.numeros[i], vazio: k >= 0 && !respondido, ativo: k >= 0 && k === etapaTrem.value && !respondido };
  }

  function carregarTrem() {
    etapaTrem.value = 0; escolhaTrem.value = null; mensagemTrem.value = ''; estadoTrem.value = '';
    ctx.falarSozinho(fraseTrem(tremAtual.value));
  }

  function abrirTrem() {
    trensTrem.value = LB.tremRegras.sortearRodada();
    indiceTrem.value = 0;
    carregarTrem();
    ctx.tela.value = 'trem';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function escolherTrem(valor) {
    if (estadoTrem.value === 'correto') return;
    escolhaTrem.value = valor;
    const q = perguntaTrem.value, t = tremAtual.value;
    if (valor !== q.certa) {
      estadoTrem.value = 'tentar-novamente';
      mensagemTrem.value = 'Não foi o ' + valor + '. Conte de ' + t.passo + ' em ' + t.passo + ' e tente outro!';
      LB.festa.erro(somLigado());
      return;
    }
    estadoTrem.value = 'correto';
    LB.festa.acerto(somLigado());
    if (etapaTrem.value === t.faltam.length - 1) {
      ctx.estrelas.value += 1;
      mensagemTrem.value = 'Isso! O número é ' + q.certa + '! ⭐';
      LB.voz.falar('Muito bem! O número é ' + q.certa + '!');
    } else {
      mensagemTrem.value = 'Isso! Agora falta mais um vagão.';
      LB.voz.falar('Isso! Agora falta mais um vagão.');
    }
  }

  function seguirTrem() {
    if (etapaTrem.value < tremAtual.value.faltam.length - 1) {
      etapaTrem.value += 1; escolhaTrem.value = null; mensagemTrem.value = ''; estadoTrem.value = '';
    } else if (indiceTrem.value < trensTrem.value.length - 1) {
      indiceTrem.value += 1;
      carregarTrem();
    }
  }

  const ultimoDoTrem = computed(() => !!tremAtual.value && indiceTrem.value === trensTrem.value.length - 1 && etapaTrem.value === tremAtual.value.faltam.length - 1);

  function concluirTrem() {
    ctx.marcarConcluido('trem');
    ctx.terminarItem('atividades');
  }

  return {
    trensTrem, indiceTrem, etapaTrem, escolhaTrem, mensagemTrem, estadoTrem, tremAtual, perguntaTrem, ultimoDoTrem,
    fraseTrem, vagaoTrem, abrirTrem, escolherTrem, seguirTrem, concluirTrem
  };
};
