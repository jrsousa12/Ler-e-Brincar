// Molde (HTML do Vue): Brincadeira "Régua". Criado por build/nova-brincadeira.js.
LB.moldes = LB.moldes || {};
LB.moldes.regua = `
    <section v-if="tela === 'regua' && atualRegua" class="brincadeira-silabas brincadeira-regua" aria-label="Brincadeira Régua">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('matematica')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indiceRegua + 1 }} de {{ listaRegua.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualRegua.fala)">🔊 Ouvir</button>
      </div>

      <p class="enunciado-regua">{{ atualRegua.enunciado }}</p>

      <div class="desenho-regua" v-html="desenharRegua(atualRegua.objetos, atualRegua.regua, atualRegua.guias)"></div>

      <div class="opcoes-regua">
        <button v-for="o in perguntaRegua.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba" :data-valor="o"
                :class="{ acertou: estadoRegua === 'correto' && escolhaRegua === o, quase: estadoRegua === 'tentar-novamente' && escolhaRegua === o }"
                @click="escolherRegua(o)">{{ o }}</button>
      </div>

      <div v-if="mensagemRegua" class="feedback-jogo" :class="estadoRegua" role="status">
        <span>{{ mensagemRegua }}</span>
        <template v-if="estadoRegua === 'correto'">
          <button v-if="!ultimoRegua" type="button" class="btn-silaba-3d btn-proximo" @click="seguirRegua">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirRegua">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
