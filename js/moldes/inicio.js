// Molde (HTML do Vue): Tela inicial (home).
LB.moldes = LB.moldes || {};
LB.moldes.inicio = `
    <!-- HOME -->
    <div v-if="tela === 'home'">
      <h2>Olá! O que vamos fazer hoje?</h2>
      <div class="card" @click="irPara('ler')" tabindex="0">
        <div class="card-capa" style="background:linear-gradient(135deg,#E8E3FF,#FFE9E1)">📖</div>
        <div class="card-titulo">Ler histórias</div>
        <div class="card-meta">{{ conteudo.stories.length }} histórias curtinhas para descobrir</div>
      </div>
      <div class="card" @click="irPara('atividades')" tabindex="0">
        <div class="card-capa" style="background:linear-gradient(135deg,#E4F8EE,#EDE9FF)">🧮</div>
        <div class="card-titulo">Atividades</div>
        <div class="card-meta">{{ conteudo.activities.length }} desafios de português e matemática</div>
      </div>
      <div class="card" @click="irPara('colorir')" tabindex="0">
        <div class="card-capa" style="background:linear-gradient(135deg,#FFF3E0,#FFE9E1)">🎨</div>
        <div class="card-titulo">Colorir</div>
        <div class="card-meta">{{ conteudo.colorir.length }} desenhos para pintar</div>
      </div>
      <div class="card" @click="irPara('recompensas')" tabindex="0">
        <div class="card-capa" style="background:linear-gradient(135deg,#EDE9FF,#FFF3E0)">🏆</div>
        <div class="card-titulo">Minhas conquistas</div>
        <div class="card-meta">{{ selosDesbloqueados }}/{{ selos.length }} selos conquistados</div>
      </div>
    </div>
`;
