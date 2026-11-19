// Molde (HTML do Vue): Telas "Ler" (lista) e "História" (leitura e perguntas).
LB.moldes = LB.moldes || {};
LB.moldes.historias = `
    <!-- LER (lista de histórias) -->
    <div v-if="tela === 'ler'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Histórias</h2>
      <div class="card" v-for="h in conteudo.stories" :key="h.id" @click="abrirHistoria(h)" tabindex="0">
        <div class="card-capa" :style="{background: h.corFundo}">{{ h.emoji }}</div>
        <div class="card-titulo">{{ h.titulo }}</div>
        <div class="card-meta" v-if="concluidos[h.id]" style="color:var(--cor-sucesso);font-weight:700">✓ Já leu</div>
      </div>
    </div>

    <!-- HISTÓRIA (leitura) -->
    <div v-if="tela === 'historia' && historiaAtual">
      <button class="btn-voltar" @click="voltar('ler')">← Voltar</button>
      <div class="historia-capa">{{ historiaAtual.emoji }}</div>
      <h2>{{ historiaAtual.titulo }}</h2>
      <button class="btn-ouvir" @click="ouvir(historiaAtual.titulo + '. ' + historiaAtual.texto.join(' '))">🔊 Ouvir a história</button>
      <div class="historia-texto">
        <p v-for="(linha, i) in historiaAtual.texto" :key="i" @click="ouvir(linha)">{{ linha }}</p>
      </div>
      <button class="btn-primario btn-gigante" @click="iniciarPerguntasHistoria" v-if="!mostrandoPerguntas">
        Responder perguntinhas ✓
      </button>
      <div v-if="mostrandoPerguntas">
        <h3 class="mt">Pergunta {{ indicePergunta + 1 }} de {{ historiaAtual.perguntas.length }}</h3>
        <div class="enunciado">
          <button class="btn-ouvir redondo" @click="ouvir(textoPergunta(perguntaAtual))" aria-label="Ouvir a pergunta">🔊</button>
          <strong>{{ perguntaAtual.enunciado }}</strong>
        </div>
        <button v-for="(op, i) in perguntaAtual.opcoes" :key="i" class="opcao"
          :class="rh.classe(i)" :disabled="rh.bloqueada(i)" @click="rh.responder(i)">{{ op }}</button>
        <div v-if="rh.mensagem" class="feedback" :class="rh.acertou ? 'correto' : 'errado'">
          {{ rh.acertou ? '🎉' : '💡' }} {{ rh.mensagem }} <span v-if="rh.terminou">{{ perguntaAtual.explicacao }}</span>
        </div>
        <button v-if="rh.terminou" class="btn-primario btn-gigante mt" @click="proximaPergunta">
          {{ indicePergunta + 1 < historiaAtual.perguntas.length ? 'Próxima →' : 'Concluir ✓' }}
        </button>
      </div>
    </div>
`;
