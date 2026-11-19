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
        <div class="card-meta">{{ h.texto.length }} linhas · Nível {{ h.nivel }} · {{ h.anoEscolar }}º ano</div>
        <div class="card-meta" v-if="concluidos[h.id]" style="color:var(--cor-sucesso);font-weight:700">✓ Já leu</div>
      </div>
    </div>

    <!-- HISTÓRIA (leitura) -->
    <div v-if="tela === 'historia' && historiaAtual">
      <button class="btn-voltar" @click="irPara('ler')">← Voltar</button>
      <div class="historia-capa">{{ historiaAtual.emoji }}</div>
      <h2>{{ historiaAtual.titulo }}</h2>
      <p class="texto-suave">{{ historiaAtual.autor }} · {{ historiaAtual.anoEscolar }}º ano · Nível {{ historiaAtual.nivel }}</p>
      <div class="historia-texto">
        <p v-for="(linha, i) in historiaAtual.texto" :key="i">{{ linha }}</p>
      </div>
      <button class="btn-primario" @click="iniciarPerguntasHistoria" v-if="!mostrandoPerguntas">
        Responder perguntinhas ✓
      </button>
      <div v-if="mostrandoPerguntas">
        <h3 class="mt">Pergunta {{ indicePergunta + 1 }} de {{ historiaAtual.perguntas.length }}</h3>
        <p style="font-size:1.05em"><strong>{{ perguntaAtual.enunciado }}</strong></p>
        <button
          v-for="(op, i) in perguntaAtual.opcoes"
          :key="i"
          class="opcao"
          :class="classeOpcao(i)"
          :disabled="respostaSelecionada !== null"
          @click="responder(i)"
        >{{ op }}</button>
        <div v-if="respostaSelecionada !== null" class="feedback" :class="respostaSelecionada === perguntaAtual.correta ? 'correto' : 'errado'">
          {{ respostaSelecionada === perguntaAtual.correta ? '🎉 Muito bem!' : '💡 Quase!' }}
          {{ perguntaAtual.explicacao }}
        </div>
        <button v-if="respostaSelecionada !== null" class="btn-primario mt" @click="proximaPergunta">
          {{ indicePergunta + 1 < historiaAtual.perguntas.length ? 'Próxima →' : 'Concluir' }}
        </button>
      </div>
    </div>
`;
