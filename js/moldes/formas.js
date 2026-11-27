// Molde (HTML do Vue): Brincadeira "Formas". Criado por build/nova-brincadeira.js.
LB.moldes = LB.moldes || {};
LB.moldes.formas = `
    <section v-if="tela === 'formas' && atualFormas" class="brincadeira-silabas brincadeira-formas" aria-label="Brincadeira Formas">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('matematica')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indiceFormas + 1 }} de {{ listaFormas.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualFormas.fala)">🔊 Ouvir</button>
      </div>

      <p class="enunciado-formas">{{ atualFormas.enunciado }}</p>

      <div v-if="atualFormas.figura" class="desenho-formas" v-html="desenharForma(atualFormas.figura)"></div>

      <div class="opcoes-formas" :class="{ 'so-figuras': atualFormas.figuras }">
        <button v-for="o in perguntaFormas.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba" :data-valor="o"
                :class="{ acertou: estadoFormas === 'correto' && escolhaFormas === o, quase: estadoFormas === 'tentar-novamente' && escolhaFormas === o }"
                :aria-label="atualFormas.figuras ? o : null" @click="escolherFormas(o)">
          <span v-if="atualFormas.figuras" class="opcao-forma" v-html="desenharForma(atualFormas.figuras[o])"></span>
          <template v-else>{{ o }}</template>
        </button>
      </div>

      <div v-if="mensagemFormas" class="feedback-jogo" :class="estadoFormas" role="status">
        <span>{{ mensagemFormas }}</span>
        <template v-if="estadoFormas === 'correto'">
          <button v-if="!ultimoFormas" type="button" class="btn-silaba-3d btn-proximo" @click="seguirFormas">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirFormas">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
