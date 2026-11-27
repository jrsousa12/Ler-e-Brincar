// Molde (HTML do Vue): Brincadeira "Monte a Palavra" (juntar sílabas).
LB.moldes = LB.moldes || {};
LB.moldes.silabas = `
    <section v-if="tela === 'silabas'" class="brincadeira-silabas" aria-label="Brincadeira Monte a Palavra">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('portugues')">← Voltar</button></teleport>
${LB.moldes.abasPalavras}
      <div class="topo-jogo">
        <span class="badge-fase">Palavra {{ indiceSilabas + 1 }} de {{ palavrasSilabas.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(palavraSilabas.palavra)">🔊 Ouvir palavra</button>
      </div>

      <div class="dica-card" @click="ouvir(palavraSilabas.dica)">
        <div class="dica-emoji" aria-hidden="true">{{ palavraSilabas.emoji }}</div>
        <p class="dica-texto">{{ palavraSilabas.dica }}</p>
      </div>

      <!-- Espaços para montar a palavra -->
      <div class="slots-palavra" :class="estadoSilabas">
        <button v-for="(bloco, idx) in slotsSilabas" :key="'slot-' + idx" type="button"
                class="slot-bloco" :class="{ preenchido: !!bloco }" @click="devolverSilaba(idx)"
                :aria-label="bloco ? 'Sílaba ' + bloco.texto + ', toque para devolver' : 'Espaço ' + (idx + 1) + ' vazio'">
          {{ bloco ? bloco.texto : '•' }}
        </button>
      </div>

      <!-- Banco de sílabas -->
      <div class="banco-silabas">
        <button v-for="bloco in bancoSilabas" :key="bloco.id" type="button"
                class="btn-silaba-3d bloco-silaba" @click="encaixarSilaba(bloco)">{{ bloco.texto }}</button>
      </div>

      <!-- Resposta acolhedora -->
      <div v-if="mensagemSilabas" class="feedback-jogo" :class="estadoSilabas" role="status">
        <span>{{ mensagemSilabas }}</span>
        <button v-if="estadoSilabas === 'correto' && indiceSilabas < palavrasSilabas.length - 1"
                type="button" class="btn-silaba-3d btn-proximo" @click="proximaSilabas">Próxima →</button>
        <button v-else-if="estadoSilabas === 'correto'"
                type="button" class="btn-silaba-3d btn-proximo" @click="concluirSilabas">Concluir 🎉</button>
      </div>
    </section>
`;
