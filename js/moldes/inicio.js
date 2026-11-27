// Molde (HTML do Vue): Tela inicial — mascote com balão, missão do dia em destaque e 3 botões grandes (Português, Matemática, Prêmios).
LB.moldes = LB.moldes || {};
LB.moldes.inicio = `
    <div v-if="tela === 'home'" class="tela-inicio">
      <div class="mascote-saudacao">
        <button class="mascote-botao" :class="{festa: missaoCompleta}" @click="ouvir(fraseMascote)"
                aria-label="Ouvir a mascote" v-html="mascote(missaoCompleta ? 'festa' : 'normal')"></button>
        <div class="balao-mascote">{{ fraseMascote }}</div>
      </div>
      <div class="card card-missao" @click="abrirMissao" tabindex="0">
        <div class="missao-icone">{{ missaoCompleta ? '🏅' : '🚀' }}</div>
        <div class="card-titulo">{{ missaoCompleta ? 'Missão completa!' : 'Missão do dia' }}</div>
        <div class="mini-trilha">
          <span v-for="(p, i) in passosMissao" :key="i" :class="{feito: p.feito}">{{ p.feito ? '✓' : p.emoji }}</span>
        </div>
        <div class="btn-primario btn-gigante" v-if="!missaoCompleta">{{ passosFeitos ? '▶ Continuar' : '▶ Começar' }}</div>
      </div>
      <div class="grade-menu">
        <button class="bloco-menu ler" @click="irPara('portugues')"><span>📝</span>Português</button>
        <button class="bloco-menu brincar" @click="irPara('matematica')"><span>🧮</span>Matemática</button>
        <button class="bloco-menu selos" @click="irPara('premios')"><span>🏆</span>Prêmios</button>
      </div>
    </div>
`;
