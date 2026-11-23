// Molde (HTML do Vue): Brincadeira "Trem dos números" (achar o número que falta na sequência).
LB.moldes = LB.moldes || {};
LB.moldes.trem = `
    <section v-if="tela === 'trem' && tremAtual" class="brincadeira-silabas brincadeira-trem" aria-label="Brincadeira Trem dos números">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <div class="topo-jogo">
        <span class="badge-fase">Trem {{ indiceTrem + 1 }} de {{ trensTrem.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(fraseTrem(tremAtual))">🔊 Ouvir</button>
      </div>

      <p class="dica-texto">Conte de <b>{{ tremAtual.passo }} em {{ tremAtual.passo }}</b>. {{ tremAtual.faltam.length > 1 ? 'Quais números faltam?' : 'Qual número falta?' }}</p>

      <div class="trem" aria-label="Trem com vagões numerados">
        <span class="locomotiva" aria-hidden="true">🚂</span>
        <div v-for="(n, i) in tremAtual.numeros" :key="i" class="vagao"
             :class="{ vazio: vagaoTrem(i).vazio, ativo: vagaoTrem(i).ativo, certo: !vagaoTrem(i).vazio && tremAtual.faltam.some(f => f.pos === i) }">
          {{ vagaoTrem(i).vazio ? '?' : n }}
        </div>
      </div>

      <div class="opcoes-trem">
        <button v-for="o in perguntaTrem.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba"
                :class="{ acertou: estadoTrem === 'correto' && escolhaTrem === o, quase: estadoTrem === 'tentar-novamente' && escolhaTrem === o }"
                @click="escolherTrem(o)">{{ o }}</button>
      </div>

      <div v-if="mensagemTrem" class="feedback-jogo" :class="estadoTrem" role="status">
        <span>{{ mensagemTrem }}</span>
        <template v-if="estadoTrem === 'correto'">
          <button v-if="!ultimoDoTrem" type="button" class="btn-silaba-3d btn-proximo" @click="seguirTrem">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirTrem">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
