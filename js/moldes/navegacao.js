// Molde (HTML do Vue): Barra de navegação de baixo.
LB.moldes = LB.moldes || {};
LB.moldes.navegacao = `
  <nav class="nav-inferior" v-if="!portaoAberto">
    <a @click="irPara('home')" :class="{ativo: area === 'home'}"><span class="icone">🏠</span>Início</a>
    <a @click="irPara('portugues')" :class="{ativo: area === 'portugues'}"><span class="icone">📝</span>Português</a>
    <a @click="irPara('matematica')" :class="{ativo: area === 'matematica'}"><span class="icone">🧮</span>Matemática</a>
    <a @click="irPara('premios')" :class="{ativo: area === 'premios'}"><span class="icone">🏆</span>Prêmios</a>
  </nav>
</div>
`;
