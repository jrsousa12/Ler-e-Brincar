// Molde (HTML do Vue): caixa de confirmação própria (js/telas/confirmar.js).
LB.moldes = LB.moldes || {};
LB.moldes.confirmar = `
  <div class="caixa-fundo" v-if="confirmacao" @click.self="responderConfirmacao(false)">
    <div class="caixa-confirmar" role="alertdialog" aria-modal="true" aria-labelledby="caixa-titulo">
      <h2 id="caixa-titulo">{{ confirmacao.titulo }}</h2>
      <p>{{ confirmacao.texto }}</p>
      <div class="linha-botoes">
        <button class="btn-secundario" @click="responderConfirmacao(false)">{{ confirmacao.nao }}</button>
        <button class="btn-primario" :class="{perigo: confirmacao.perigo}" @click="responderConfirmacao(true)">{{ confirmacao.sim }}</button>
      </div>
    </div>
  </div>
`;
