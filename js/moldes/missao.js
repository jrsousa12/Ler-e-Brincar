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
      <div class="etiqueta-linha"><span class="badge-fase">{{ passosFeitos }} de {{ passosMissao.length }} passos</span></div>
      <div v-if="!missaoCompleta && passosMissao[proximoPasso]" class="card passo-destaque" @click="fazerPasso(proximoPasso)" tabindex="0">
        <div class="passo-emoji">{{ passosMissao[proximoPasso].emoji }}</div>
        <div class="card-titulo">{{ passosMissao[proximoPasso].rotulo }}</div>
        <button class="btn-primario btn-gigante">▶ Vamos!</button>
      </div>
      <div v-if="missaoCompleta" class="missao-completa">
        <div class="mascote-grande" v-html="mascote('festa')"></div>
        <div class="medalha-missao" aria-hidden="true">🏅</div>
        <h3>Missão completa!</h3>
        <div class="estrelas-premio" aria-label="Mais 3 estrelas"><span>⭐</span><span>⭐</span><span>⭐</span></div>
        <p>Você ganhou 3 estrelas extras. Volte amanhã para uma nova missão.</p>
        <button class="btn-secundario" @click="irPara('recompensas')">🏆 Ver meus selos</button>
      </div>
    </div>
`;
