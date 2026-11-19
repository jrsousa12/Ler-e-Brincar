// Molde (HTML do Vue): Tela inicial — missão do dia em destaque e 4 botões grandes.
LB.moldes = LB.moldes || {};
LB.moldes.inicio = `
    <div v-if="tela === 'home'">
      <div class="card card-missao" @click="abrirMissao" tabindex="0">
        <div class="missao-icone">{{ missaoCompleta ? '🏅' : '🚀' }}</div>
        <div class="card-titulo">{{ missaoCompleta ? 'Missão completa!' : 'Missão do dia' }}</div>
        <div class="mini-trilha">
          <span v-for="(p, i) in passosMissao" :key="i" :class="{feito: p.feito}">{{ p.feito ? '✓' : p.emoji }}</span>
        </div>
        <div class="btn-primario btn-gigante" v-if="!missaoCompleta">{{ passosFeitos ? '▶ Continuar' : '▶ Começar' }}</div>
      </div>
      <div class="grade-menu">
        <button class="bloco-menu" @click="irPara('ler')"><span>📖</span>Ler</button>
        <button class="bloco-menu" @click="irPara('atividades')"><span>🧮</span>Brincar</button>
        <button class="bloco-menu" @click="irPara('colorir')"><span>🎨</span>Colorir</button>
        <button class="bloco-menu" @click="irPara('recompensas')"><span>🏆</span>Selos</button>
      </div>
    </div>
`;
