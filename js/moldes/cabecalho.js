// Molde (HTML do Vue): Cabeçalho do topo (título, ⚙️ dos adultos, estrelas).
LB.moldes = LB.moldes || {};
LB.moldes.cabecalho = `
  <header class="cabecalho-app" v-if="!portaoAberto">
    <h1 @click="irPara('home')" style="cursor:pointer">Ler &amp; Brincar</h1>
    <div style="display:flex;gap:10px;align-items:center">
      <div class="contador-estrelas">⭐ {{ estrelas }}</div>
      <button class="btn-adultos" @click="abrirPortao" title="Ajustes" aria-label="Área dos adultos">⚙️</button>
    </div>
  </header>
`;
