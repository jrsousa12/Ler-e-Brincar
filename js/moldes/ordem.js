// Molde (HTML do Vue): Brincadeira "Ordem dos Fatos" (comportamento em js/telas/ordem.js).
LB.moldes = LB.moldes || {};
LB.moldes.ordem = `
    <section v-if="tela === 'ordem' && atualOrdem" class="brincadeira-silabas brincadeira-ordem" aria-label="Brincadeira Ordem dos Fatos">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indiceOrdem + 1 }} de {{ listaOrdem.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualOrdem.fala)">🔊 Ouvir</button>
      </div>

      <h2 class="titulo-ordem">{{ atualOrdem.titulo }}</h2>
      <p class="enunciado-ordem">{{ atualOrdem.enunciado }}</p>

      <ol class="linha-ordem" aria-label="Linha do tempo">
        <li v-for="i in [0, 1, 2]" :key="i" class="casa-ordem" :class="{ cheia: casaOrdem(i).frase, ativa: casaOrdem(i).ativa }">
          <span class="num-ordem">{{ i + 1 }}º</span>
          <span class="frase-casa">{{ casaOrdem(i).frase || '?' }}</span>
        </li>
      </ol>

      <template v-if="estadoOrdem !== 'correto'">
        <p class="pedido-ordem">{{ perguntaOrdem.pedido }}</p>
        <div class="opcoes-ordem">
          <div v-for="o in perguntaOrdem.opcoes" :key="o" class="opcao-ordem">
            <button type="button" class="btn-frase-ordem" :class="{ quase: estadoOrdem === 'tentar-novamente' && escolhaOrdem === o }"
                    @click="escolherOrdem(o)">{{ o }}</button>
            <button type="button" class="btn-ouvir-frase" :aria-label="'Ouvir: ' + o" @click="ouvir(o)">🔊</button>
          </div>
        </div>
      </template>

      <div v-if="mensagemOrdem" class="feedback-jogo" :class="estadoOrdem" role="status">
        <span>{{ mensagemOrdem }}</span>
        <template v-if="estadoOrdem === 'correto'">
          <button v-if="etapaOrdem === 0" type="button" class="btn-silaba-3d btn-proximo" @click="seguirOrdem">Continuar →</button>
          <button v-else-if="!ultimoOrdem" type="button" class="btn-silaba-3d btn-proximo" @click="seguirOrdem">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirOrdem">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
