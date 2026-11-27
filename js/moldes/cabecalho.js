// Molde (HTML do Vue): Cabeçalho do topo — "← Voltar" (levado para cá pelas telas) + título da tela, estrelas e ⚙️ dos adultos.
LB.moldes = LB.moldes || {};
LB.moldes.cabecalho = `
  <header class="cabecalho-app" :class="{ 'no-inicio': tela === 'home' }" v-if="!portaoAberto">
    <div class="cabecalho-esquerda">
      <span id="slot-voltar"></span>
      <h1 @click="irPara('home')">{{ tituloTela }}</h1>
    </div>
    <div class="cabecalho-direita">
      <div class="contador-estrelas">⭐ {{ estrelas }}</div>
      <button class="btn-adultos" @click="abrirPortao" title="Ajustes" aria-label="Área dos adultos">⚙️</button>
    </div>
  </header>
`;
