// Molde (HTML do Vue): Cabeçalho do topo (título, ⚙️, estrelas).
LB.moldes = LB.moldes || {};
LB.moldes.cabecalho = `
  <header class="cabecalho-app" v-if="!portaoAberto">
    <h1 @click="irPara('home')" style="cursor:pointer">Ler &amp; Brincar</h1>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn-icone" @click="abrirPortao" title="Ajustes" style="background:rgba(255,255,255,.18);color:#fff">⚙️</button>
      <div class="contador-estrelas">⭐ {{ estrelas }}</div>
    </div>
  </header>
`;
