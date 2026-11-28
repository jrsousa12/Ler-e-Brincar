// Molde (HTML do Vue): Brincadeira "Ditado" (ouvir a palavra e montar com letras).
LB.moldes = LB.moldes || {};
LB.moldes.ditado = `
    <section v-if="tela === 'ditado' && atualDitado" class="brincadeira-silabas brincadeira-ditado" aria-label="Brincadeira Ditado">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="voltar('portugues')">← Voltar</button></teleport>
      <div class="topo-jogo">
        <span class="badge-fase">Palavra {{ indiceDitado + 1 }} de {{ listaDitado.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atualDitado.fala)">🔊 Ouvir de novo</button>
      </div>

      <div class="dica-card" @click="ouvir(atualDitado.fala)">
        <div class="dica-emoji" aria-hidden="true">{{ atualDitado.emoji }}</div>
        <p class="dica-texto">Escute e escreva a palavra.</p>
      </div>

      <div class="slots-palavra" :class="estadoDitado">
        <button v-for="(letra, i) in casasDitado" :key="'casa-' + i" type="button" class="slot-bloco slot-letra"
                :class="{ preenchido: !!letra }" @click="tirarLetraDitado(i)"
                :aria-label="letra ? 'Letra ' + letra.texto + ', toque para devolver' : 'Espaço ' + (i + 1) + ' vazio'">{{ letra ? letra.texto : '•' }}</button>
      </div>

      <div class="teclado-ditado">
        <button v-for="t in teclasDitado" :key="t.id" type="button" class="btn-silaba-3d bloco-silaba tecla-letra"
                @click="porLetraDitado(t)">{{ t.texto }}</button>
      </div>
      <button v-if="estadoDitado !== 'correto'" type="button" class="btn-silaba-3d btn-apagar-ditado" @click="apagarDitado">⌫ Apagar</button>

      <div v-if="mensagemDitado" class="feedback-jogo" :class="estadoDitado" role="status">
        <span>{{ mensagemDitado }}</span>
        <template v-if="estadoDitado === 'correto'">
          <button v-if="!ultimoDitado" type="button" class="btn-silaba-3d btn-proximo" @click="seguirDitado">Próxima →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirDitado">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
