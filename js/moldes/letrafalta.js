// Molde (HTML do Vue): Brincadeira "Letra que falta" (escolher a letra que completa a palavra).
LB.moldes = LB.moldes || {};
LB.moldes.letrafalta = `
    <section v-if="tela === 'letrafalta' && atualLetraFalta" class="brincadeira-silabas brincadeira-letrafalta" aria-label="Brincadeira Letra que falta">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('portugues')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Palavra {{ indiceLetraFalta + 1 }} de {{ listaLetraFalta.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualLetraFalta.palavra)">🔊 Ouvir palavra</button>
      </div>

      <div class="dica-card" @click="ouvir(atualLetraFalta.palavra)">
        <div class="dica-emoji" aria-hidden="true">{{ atualLetraFalta.emoji }}</div>
        <p class="dica-texto">Que letra falta?</p>
      </div>

      <div class="slots-palavra" :class="estadoLetraFalta" :aria-label="'Palavra com uma letra faltando'">
        <span v-for="(l, i) in atualLetraFalta.letras" :key="'l' + i" class="slot-bloco slot-letra"
              :class="{ preenchido: l !== '_' || estadoLetraFalta === 'correto' }">{{ l === '_' ? (estadoLetraFalta === 'correto' ? atualLetraFalta.certa : '?') : l }}</span>
      </div>

      <div class="teclado-ditado">
        <button v-for="o in perguntaLetraFalta.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba tecla-letra"
                :class="{ acertou: estadoLetraFalta === 'correto' && escolhaLetraFalta === o, quase: estadoLetraFalta === 'tentar-novamente' && escolhaLetraFalta === o }"
                @click="escolherLetraFalta(o)">{{ o }}</button>
      </div>

      <div v-if="mensagemLetraFalta" class="feedback-jogo" :class="estadoLetraFalta" role="status">
        <span>{{ mensagemLetraFalta }}</span>
        <template v-if="estadoLetraFalta === 'correto'">
          <button v-if="!ultimoLetraFalta" type="button" class="btn-silaba-3d btn-proximo" @click="seguirLetraFalta">Próxima →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirLetraFalta">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
