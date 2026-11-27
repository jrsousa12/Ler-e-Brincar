// Molde (HTML do Vue): Brincadeira "Gráfico de barras". Criado por build/nova-brincadeira.js.
LB.moldes = LB.moldes || {};
LB.moldes.grafico = `
    <section v-if="tela === 'grafico' && atualGrafico" class="brincadeira-silabas brincadeira-grafico" aria-label="Brincadeira Gráfico de barras">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('matematica')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indiceGrafico + 1 }} de {{ listaGrafico.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualGrafico.fala)">🔊 Ouvir</button>
      </div>

      <p class="enunciado-grafico">{{ atualGrafico.enunciado }}</p>

      <div class="desenho-grafico" v-html="desenharGrafico(atualGrafico.grafico)"></div>

      <div class="opcoes-grafico">
        <button v-for="o in perguntaGrafico.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba" :data-valor="o"
                :class="{ acertou: estadoGrafico === 'correto' && escolhaGrafico === o, quase: estadoGrafico === 'tentar-novamente' && escolhaGrafico === o }"
                @click="escolherGrafico(o)">{{ o }}</button>
      </div>

      <div v-if="mensagemGrafico" class="feedback-jogo" :class="estadoGrafico" role="status">
        <span>{{ mensagemGrafico }}</span>
        <template v-if="estadoGrafico === 'correto'">
          <button v-if="!ultimoGrafico" type="button" class="btn-silaba-3d btn-proximo" @click="seguirGrafico">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirGrafico">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
