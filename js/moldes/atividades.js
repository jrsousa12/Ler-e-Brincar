// Molde (HTML do Vue): Telas "Atividades" (lista) e "Atividade" (resolver).
LB.moldes = LB.moldes || {};
LB.moldes.atividades = `
    <!-- ATIVIDADES (lista) -->
    <div v-if="tela === 'atividades'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Brincar</h2>
      <div class="filtros">
        <button class="filtro" :class="{ativo: filtroMateria === 'todas'}" @click="filtroMateria = 'todas'">Todas</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'lingua-portuguesa'}" @click="filtroMateria = 'lingua-portuguesa'">📝 Português</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'matematica'}" @click="filtroMateria = 'matematica'">🧮 Matemática</button>
      </div>
      <h3 class="titulo-secao">Brincadeiras</h3>
      <div class="grade-brincadeiras">
        <template v-if="filtroMateria !== 'matematica'">
          <button type="button" class="bloco-brincadeira ler" @click="abrirSilabas">
            <span class="bloco-emoji" aria-hidden="true">🧩</span>Monte a Palavra<span v-if="concluidos.silabas" class="selo-feito">✓</span>
          </button>
          <button type="button" class="bloco-brincadeira colorir" @click="abrirMemoria">
            <span class="bloco-emoji" aria-hidden="true">🃏</span>Memória<span v-if="concluidos.memoria" class="selo-feito">✓</span>
          </button>
          <button type="button" class="bloco-brincadeira brincar" @click="abrirSomFigura">
            <span class="bloco-emoji" aria-hidden="true">🔊</span>Som e Figura<span v-if="concluidos['som-figura']" class="selo-feito">✓</span>
          </button>
        </template>
        <button v-if="filtroMateria !== 'lingua-portuguesa'" type="button" class="bloco-brincadeira mercado" @click="abrirMercado">
          <span class="bloco-emoji" aria-hidden="true">🛒</span>Mercadinho<span v-if="concluidos.mercado" class="selo-feito">✓</span>
        </button>
        <button v-if="filtroMateria !== 'lingua-portuguesa'" type="button" class="bloco-brincadeira mercado" @click="abrirTrem">
          <span class="bloco-emoji" aria-hidden="true">🚂</span>Trem dos números<span v-if="concluidos.trem" class="selo-feito">✓</span>
        </button>
        <button v-if="filtroMateria !== 'matematica'" type="button" class="bloco-brincadeira ler" @click="abrirOrdem">
          <span class="bloco-emoji" aria-hidden="true">🔢</span>Ordem dos Fatos<span v-if="concluidos['ordem']" class="selo-feito">✓</span>
        </button>
      </div>
      <h3 class="titulo-secao">Atividades</h3>
      <div class="grade-cartoes">
        <div class="card cartao-atividade" :class="g.materia" v-for="g in gruposAtividades" :key="g.chave" @click="abrirGrupo(g)" tabindex="0">
          <div class="cartao-emoji" aria-hidden="true">{{ g.materia === 'matematica' ? '🧮' : '📝' }}</div>
          <div class="card-titulo">{{ g.titulo }}</div>
          <div class="card-meta" v-if="g.itens.length > 1">{{ g.feitos }} de {{ g.itens.length }}</div>
          <div class="selo-feito" v-if="g.feitos === g.itens.length">✓</div>
        </div>
      </div>
    </div>

    <!-- ATIVIDADE (resolver) -->
    <div v-if="tela === 'atividade' && atividadeAtual">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <h2>{{ atividadeAtual.materia === 'matematica' ? '🧮' : '📝' }} {{ atividadeAtual.titulo }}</h2>
      <div class="enunciado">
        <button class="btn-ouvir redondo" @click="ouvir(textoPergunta(atividadeAtual))" aria-label="Ouvir a pergunta">🔊</button>
        <strong>{{ atividadeAtual.enunciado }}</strong>
      </div>
      <div v-if="atividadeAtual.apoioVisual" class="apoio-visual">
        <div>{{ atividadeAtual.apoioVisual.esquerda }}</div>
        <div style="margin:8px 0">{{ atividadeAtual.apoioVisual.operador }} {{ atividadeAtual.apoioVisual.direita }}</div>
      </div>
      <button v-for="(op, i) in atividadeAtual.opcoes" :key="i" class="opcao"
        :class="ra.classe(i)" :disabled="ra.bloqueada(i)" @click="ra.responder(i)">{{ op }}</button>
      <div v-if="ra.mensagem" class="feedback" :class="ra.acertou ? 'correto' : 'errado'">
        <span v-if="ra.acertou" class="mascote-mini" v-html="mascote('feliz')"></span><template v-else>💡</template> {{ ra.mensagem }} <span v-if="ra.terminou">{{ atividadeAtual.explicacao }}</span>
      </div>
      <button v-if="ra.terminou" class="btn-primario btn-gigante mt" @click="concluirAtividade">Continuar →</button>
    </div>
`;
