// Molde (HTML do Vue): Barra de navegação de baixo.
LB.moldes = LB.moldes || {};
LB.moldes.navegacao = `
  <nav class="nav-inferior" v-if="!portaoAberto">
    <a @click="irPara('home')" :class="{ativo: tela === 'home'}"><span class="icone">🏠</span>Início</a>
    <a @click="irPara('ler')" :class="{ativo: tela === 'ler' || tela === 'historia'}"><span class="icone">📖</span>Ler</a>
    <a @click="irPara('atividades')" :class="{ativo: tela === 'atividades' || tela === 'atividade'}"><span class="icone">🧮</span>Brincar</a>
    <a @click="irPara('recompensas')" :class="{ativo: tela === 'recompensas'}"><span class="icone">🏆</span>Selos</a>
  </nav>
</div>
`;
