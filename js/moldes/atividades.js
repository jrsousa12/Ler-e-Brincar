// Molde (HTML do Vue): Telas "Atividades" (lista) e "Atividade" (resolver).
LB.moldes = LB.moldes || {};
LB.moldes.atividades = `
    <!-- ATIVIDADES (lista) -->
    <div v-if="tela === 'atividades'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Atividades</h2>
      <div class="filtros">
        <button class="filtro" :class="{ativo: filtroMateria === 'todas'}" @click="filtroMateria = 'todas'">Todas</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'lingua-portuguesa'}" @click="filtroMateria = 'lingua-portuguesa'">📝 Português</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'matematica'}" @click="filtroMateria = 'matematica'">🧮 Matemática</button>
      </div>
      <div class="card" v-if="filtroMateria !== 'matematica'" @click="abrirSilabas" tabindex="0">
        <div class="card-titulo">🧩 Monte a Palavra</div>
        <div class="card-meta">Junte as sílabas para formar a palavra</div>
        <div class="card-meta" v-if="concluidos.silabas" style="color:var(--cor-sucesso);font-weight:700">✓ Já brincou</div>
      </div>
      <div class="card" v-if="filtroMateria !== 'matematica'" @click="abrirMemoria" tabindex="0">
        <div class="card-titulo">🃏 Memória</div>
        <div class="card-meta">Ache o par: a figura e a palavra</div>
        <div class="card-meta" v-if="concluidos.memoria" style="color:var(--cor-sucesso);font-weight:700">✓ Já brincou</div>
      </div>
      <div class="card" v-if="filtroMateria !== 'matematica'" @click="abrirSomFigura" tabindex="0">
        <div class="card-titulo">🔊 Som e Figura</div>
        <div class="card-meta">Ouça a palavra e toque na figura</div>
        <div class="card-meta" v-if="concluidos['som-figura']" style="color:var(--cor-sucesso);font-weight:700">✓ Já brincou</div>
      </div>
      <div class="card" v-for="a in atividadesFiltradas" :key="a.id" @click="abrirAtividade(a)" tabindex="0">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            <div class="card-titulo">{{ a.materia === 'matematica' ? '🧮' : '📝' }} {{ a.titulo }}</div>
          </div>
          <div v-if="concluidos[a.id]" style="color:var(--cor-sucesso);font-size:1.4em">✓</div>
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
