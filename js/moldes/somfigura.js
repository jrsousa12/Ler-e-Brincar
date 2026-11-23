// Molde (HTML do Vue): Brincadeira "Som e Figura" (ouvir e tocar na figura).
LB.moldes = LB.moldes || {};
LB.moldes.somfigura = `
    <section v-if="tela === 'som-figura' && alvoSom" class="brincadeira-silabas" aria-label="Brincadeira Som e Figura">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
${LB.moldes.abasPalavras}
      <div class="topo-jogo">
        <span class="badge-fase">Rodada {{ indiceSom + 1 }} de {{ rodadasSom.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(alvoSom.palavra)">🔊 Ouvir de novo</button>
      </div>
      <p class="dica-texto">Ouça a palavra e toque na figura certa.</p>
      <div class="grade-figuras">
        <button v-for="op in alvoSom.opcoes" :key="op.palavra" type="button" class="btn-silaba-3d carta-figura"
                :class="{ acertou: estadoSom === 'correto' && escolhaSom === op.palavra, quase: estadoSom === 'tentar-novamente' && escolhaSom === op.palavra }"
                @click="escolherFigura(op)" :aria-label="'Figura ' + op.palavra">
          <span class="carta-emoji" aria-hidden="true">{{ op.emoji }}</span>
          <span v-if="escolhaSom === op.palavra" class="carta-palavra">{{ op.palavra }}</span>
        </button>
      </div>
      <div v-if="mensagemSom" class="feedback-jogo" :class="estadoSom" role="status">
        <span>{{ mensagemSom }}</span>
        <button v-if="estadoSom === 'correto' && indiceSom < rodadasSom.length - 1"
                type="button" class="btn-silaba-3d btn-proximo" @click="proximaSom">Próxima →</button>
        <button v-else-if="estadoSom === 'correto'"
                type="button" class="btn-silaba-3d btn-proximo" @click="concluirSomFigura">Concluir 🎉</button>
      </div>
    </section>
`;
