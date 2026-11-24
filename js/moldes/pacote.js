// Molde (HTML do Vue): Brincadeira "Pacotes de contas". Criado por build/nova-brincadeira.js.
LB.moldes = LB.moldes || {};
LB.moldes.pacote = `
    <section v-if="tela === 'pacote' && atualPacote" class="brincadeira-silabas brincadeira-pacote" aria-label="Brincadeira Pacotes de contas">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <div class="topo-jogo">
        <span class="badge-fase">Pacote {{ indicePacote + 1 }} de {{ listaPacote.length }} · Pergunta {{ etapaPacote + 1 }} de {{ atualPacote.perguntas.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(perguntaPacote.fala)">🔊 Ouvir</button>
      </div>

      <h2 class="titulo-pacote">📦 {{ atualPacote.titulo }}</h2>
      <p v-if="perguntaPacote.revisao" class="revisao-pacote">🔁 Revisão: você errou esta antes</p>

      <p class="enunciado-pacote">{{ perguntaPacote.enunciado }}</p>
      <p v-if="perguntaPacote.apoio" class="apoio-pacote" aria-hidden="true">
        {{ perguntaPacote.apoio.esquerda }} <b>{{ perguntaPacote.apoio.operador }}</b> {{ perguntaPacote.apoio.direita }}
      </p>

      <div class="opcoes-pacote" :class="{ longas: perguntaPacote.longas }">
        <button v-for="o in perguntaPacote.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba"
                :class="{ acertou: estadoPacote === 'correto' && escolhaPacote === o, quase: estadoPacote === 'tentar-novamente' && escolhaPacote === o }"
                @click="escolherPacote(o)">{{ o }}</button>
      </div>

      <div v-if="mensagemPacote" class="feedback-jogo" :class="estadoPacote" role="status">
        <span>{{ mensagemPacote }}</span>
        <template v-if="estadoPacote === 'correto'">
          <button v-if="!ultimoPacote" type="button" class="btn-silaba-3d btn-proximo" @click="seguirPacote">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirPacote">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
