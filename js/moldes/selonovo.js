// Molde (HTML do Vue): janela de festa do selo novo (js/telas/selonovo.js).
LB.moldes = LB.moldes || {};
LB.moldes.selonovo = `
  <div class="caixa-fundo" v-if="seloNovo" @click.self="fecharSeloNovo">
    <div class="caixa-confirmar caixa-selo" role="alertdialog" aria-modal="true" aria-labelledby="selo-titulo">
      <div class="selo-raios" aria-hidden="true"></div>
      <div class="selo-ganho" aria-hidden="true">{{ seloNovo.emoji }}</div>
      <h2 id="selo-titulo">Selo novo!</h2>
      <p class="selo-ganho-nome">{{ seloNovo.nome }}</p>
      <div class="linha-botoes">
        <button class="btn-secundario" @click="ouvir('Selo novo! ' + seloNovo.nome)">🔊 Ouvir</button>
        <button class="btn-primario" @click="fecharSeloNovo">Oba! 🎉</button>
      </div>
    </div>
  </div>
`;
