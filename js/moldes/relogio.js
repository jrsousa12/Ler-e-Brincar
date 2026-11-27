// Molde (HTML do Vue): Brincadeira "Que horas são?" (ponteiros, digital e quanto tempo passou).
LB.moldes = LB.moldes || {};
LB.moldes.relogio = `
    <section v-if="tela === 'relogio' && atualRelogio" class="brincadeira-silabas brincadeira-relogio" aria-label="Brincadeira Que horas são?">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('matematica')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indiceRelogio + 1 }} de {{ listaRelogio.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualRelogio.fala)">🔊 Ouvir</button>
      </div>

      <p class="enunciado-relogio">{{ atualRelogio.enunciado }}</p>

      <div v-if="atualRelogio.relogios.length" class="relogios-relogio">
        <figure v-for="(rel, i) in atualRelogio.relogios" :key="i" class="relogio-grande">
          <span v-html="desenharRelogio(rel.h, rel.m, atualRelogio.relogios.length > 1 ? 140 : 190)"></span>
          <figcaption v-if="rel.rotulo">{{ rel.rotulo }}</figcaption>
        </figure>
      </div>

      <div class="opcoes-relogio" :class="{ 'com-relogios': atualRelogio.modo === 'relogio' }">
        <button v-for="o in perguntaRelogio.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba" :data-valor="o"
                :class="{ acertou: estadoRelogio === 'correto' && escolhaRelogio === o, quase: estadoRelogio === 'tentar-novamente' && escolhaRelogio === o }"
                :aria-label="atualRelogio.modo === 'relogio' ? 'Relógio mostrando ' + o : o"
                @click="escolherRelogio(o)">
          <span v-if="atualRelogio.modo === 'relogio'" v-html="desenharRelogio(horaDoBotao(o).h, horaDoBotao(o).m, 96)"></span>
          <template v-else>{{ o }}</template>
        </button>
      </div>

      <div v-if="mensagemRelogio" class="feedback-jogo" :class="estadoRelogio" role="status">
        <span>{{ mensagemRelogio }}</span>
        <template v-if="estadoRelogio === 'correto'">
          <button v-if="!ultimoRelogio" type="button" class="btn-silaba-3d btn-proximo" @click="seguirRelogio">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirRelogio">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
