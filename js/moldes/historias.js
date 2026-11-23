// Molde (HTML do Vue): Telas "Ler" (lista) e "História" (leitura e perguntas).
LB.moldes = LB.moldes || {};
LB.moldes.historias = `
    <!-- LER (lista de histórias) -->
    <div v-if="tela === 'ler'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Histórias</h2>
      <div class="grade-cartoes">
        <div class="card" v-for="h in conteudo.stories" :key="h.id" @click="abrirHistoria(h)" tabindex="0">
          <div class="card-capa" :style="{background: h.corFundo}">{{ h.emoji }}</div>
          <div class="card-titulo">{{ h.titulo }}</div>
          <div class="card-meta" v-if="concluidos[h.id]" style="color:var(--cor-sucesso);font-weight:700">✓ Já leu</div>
        </div>
      </div>
    </div>

    <!-- HISTÓRIA (leitura) -->
    <div v-if="tela === 'historia' && historiaAtual">
      <button class="btn-voltar" @click="voltar('ler')">← Voltar</button>
      <div class="historia-capa">{{ historiaAtual.emoji }}</div>
      <h2>{{ historiaAtual.titulo }}</h2>
      <button class="btn-ouvir" @click="ouvirHistoria">🔊 Ouvir a história</button>
      <div class="historia-texto">
        <p v-for="(linha, i) in partes" :key="i" @click="ouvirLinha(i)"><span v-for="f in linha" :key="f.g" class="frase" :class="{lida: f.g === fraseAtiva}">{{ f.t }} </span></p>
      </div>
      <button class="btn-primario btn-gigante" @click="iniciarPerguntasHistoria" v-if="!mostrandoPerguntas">
        Responder perguntinhas ✓
      </button>
      <div v-if="mostrandoPerguntas">
        <div class="etiqueta-linha"><span class="badge-fase">Pergunta {{ indicePergunta + 1 }} de {{ historiaAtual.perguntas.length }}</span></div>
        <div class="barra-progresso" role="progressbar" :aria-valuenow="progressoPerguntas" aria-valuemin="0" aria-valuemax="100"><div class="barra-preenchida" :style="{width: progressoPerguntas + '%'}"></div></div>
        <div class="enunciado">
          <button class="btn-ouvir redondo" @click="ouvir(textoPergunta(perguntaAtual))" aria-label="Ouvir a pergunta">🔊</button>
          <strong>{{ perguntaAtual.enunciado }}</strong>
        </div>
        <button v-for="(op, i) in perguntaAtual.opcoes" :key="i" class="opcao"
          :class="rh.classe(i)" :disabled="rh.bloqueada(i)" @click="rh.responder(i)">{{ op }}</button>
        <div v-if="rh.mensagem" class="feedback" :class="rh.acertou ? 'correto' : 'errado'">
          <span v-if="rh.acertou" class="mascote-mini" v-html="mascote('feliz')"></span><template v-else>💡</template> {{ rh.mensagem }} <span v-if="rh.terminou">{{ perguntaAtual.explicacao }}</span>
        </div>
        <button v-if="rh.terminou" class="btn-primario btn-gigante mt" @click="proximaPergunta">
          {{ indicePergunta + 1 < historiaAtual.perguntas.length ? 'Próxima →' : 'Concluir ✓' }}
        </button>
      </div>
    </div>
`;
