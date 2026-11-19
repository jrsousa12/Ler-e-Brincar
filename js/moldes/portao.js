// Molde (HTML do Vue): Portão dos adultos (setas + deslizar).
LB.moldes = LB.moldes || {};
LB.moldes.portao = `
  <div class="portao-parental" v-if="portaoAberto">
    <h2>Área dos adultos</h2>
    <p class="instrucao">Para entrar, clique nas setas na ordem indicada e depois deslize o dedo (ou mouse) para a direita na área tracejada.</p>
    <div class="sequencia-setas">
      <button
        v-for="(s, i) in portao.setas"
        :key="i"
        class="seta"
        :class="{feita: i < portao.indice, atual: i === portao.indice}"
        @click="clicarSeta(i)"
      >{{ s }}</button>
    </div>
    <div
      class="area-gesto"
      @mousedown="iniciarGesto"
      @mouseup="terminarGesto"
      @touchstart.prevent="iniciarGestoTouch"
      @touchend.prevent="terminarGestoTouch"
    >
      <span v-if="portao.indice < portao.setas.length">Primeiro complete as setas</span>
      <span v-else-if="!portao.gestoOk">👉 Deslize para a direita aqui</span>
      <span v-else>✅ Liberado!</span>
    </div>
    <button class="btn-secundario" style="margin-top:var(--space)" @click="fecharPortao">Cancelar</button>
  </div>

`;
