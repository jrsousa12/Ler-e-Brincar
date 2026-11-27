// Molde (HTML do Vue): Tela "Minhas conquistas" (selos e progresso).
LB.moldes = LB.moldes || {};
LB.moldes.selos = `
    <!-- RECOMPENSAS -->
    <div v-if="tela === 'recompensas'">
      <button class="btn-voltar" @click="irPara('premios')">← Voltar</button>
      <h2>Minhas conquistas</h2>
      <p class="texto-suave">Você tem <strong>{{ estrelas }} ⭐</strong> e completou <strong>{{ totalConcluidos }}</strong> de {{ totalItens }} itens.</p>
      <div class="barra-progresso">
        <div class="barra-preenchida" :style="{width: progressoGeral + '%'}"></div>
      </div>
      <p class="texto-centro texto-suave">{{ progressoGeral }}% concluído</p>
      <div class="placar-missao">
        <div><span>🚀</span><strong>{{ missoesFeitas }}</strong> missões</div>
        <div><span>🔥</span><strong>{{ diasSeguidos }}</strong> dias seguidos</div>
      </div>
      <div class="grid-selos">
        <div class="selo" v-for="s in selos" :key="s.id" :class="{desbloqueado: s.desbloqueado}">
          <span class="emoji">{{ s.emoji }}</span>
          <div class="nome">{{ s.nome }}</div>
        </div>
      </div>
    </div>
`;
