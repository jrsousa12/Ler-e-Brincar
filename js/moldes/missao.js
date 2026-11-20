// Molde (HTML do Vue): Missão do dia — trilha de 8 passos e o próximo passo.
LB.moldes = LB.moldes || {};
LB.moldes.missao = `
    <div v-if="tela === 'missao'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>🚀 Missão do dia</h2>
      <div class="trilha">
        <div v-for="(p, i) in passosMissao" :key="i" class="passo"
             :class="{feito: p.feito, atual: i === proximoPasso}">{{ p.feito ? '✓' : p.emoji }}</div>
      </div>
      <p class="texto-centro texto-suave">{{ passosFeitos }} de {{ passosMissao.length }}</p>
      <div v-if="!missaoCompleta && passosMissao[proximoPasso]" class="card passo-destaque" @click="fazerPasso(proximoPasso)" tabindex="0">
        <div class="passo-emoji">{{ passosMissao[proximoPasso].emoji }}</div>
        <div class="card-titulo">{{ passosMissao[proximoPasso].rotulo }}</div>
        <button class="btn-primario btn-gigante">▶ Vamos!</button>
      </div>
      <div v-if="missaoCompleta" class="missao-completa">
        <div class="coruja-grande" v-html="coruja('festa')"></div>
        <h3>Missão completa!</h3>
        <p>Você ganhou 3 estrelas extras. Volte amanhã para uma nova missão.</p>
        <button class="btn-secundario" @click="irPara('recompensas')">🏆 Ver meus selos</button>
      </div>
    </div>
`;
