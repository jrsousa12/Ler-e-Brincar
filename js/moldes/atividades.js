// Molde (HTML do Vue): Telas "Atividades" (lista) e "Atividade" (resolver).
LB.moldes = LB.moldes || {};
LB.moldes.atividades = `
    <!-- ATIVIDADES (lista) -->
    <div v-if="tela === 'atividades'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Atividades</h2>
      <div class="filtros">
        <button class="filtro" :class="{ativo: filtroMateria === 'todas'}" @click="filtroMateria = 'todas'">Todas</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'lingua-portuguesa'}" @click="filtroMateria = 'lingua-portuguesa'">Português</button>
        <button class="filtro" :class="{ativo: filtroMateria === 'matematica'}" @click="filtroMateria = 'matematica'">Matemática</button>
      </div>
      <div class="card" v-for="a in atividadesFiltradas" :key="a.id" @click="abrirAtividade(a)" tabindex="0">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            <div class="card-titulo">{{ a.titulo }}</div>
            <div class="card-meta">{{ a.materia === 'matematica' ? '🧮 Matemática' : '📝 Português' }} · Nível {{ a.nivel }}</div>
          </div>
          <div v-if="concluidos[a.id]" style="color:var(--cor-sucesso);font-size:1.4em">✓</div>
        </div>
      </div>
    </div>

    <!-- ATIVIDADE (resolver) -->
    <div v-if="tela === 'atividade' && atividadeAtual">
      <button class="btn-voltar" @click="irPara('atividades')">← Voltar</button>
      <h2>{{ atividadeAtual.titulo }}</h2>
      <p class="texto-suave">Nível {{ atividadeAtual.nivel }} · {{ atividadeAtual.habilidadeBNCC }}</p>
      <p style="font-size:1.1em;margin:var(--space) 0"><strong>{{ atividadeAtual.enunciado }}</strong></p>
      <div v-if="atividadeAtual.apoioVisual" class="apoio-visual">
        <div>{{ atividadeAtual.apoioVisual.esquerda }}</div>
        <div style="margin:8px 0">{{ atividadeAtual.apoioVisual.operador }} {{ atividadeAtual.apoioVisual.direita }}</div>
      </div>
      <button
        v-for="(op, i) in atividadeAtual.opcoes"
        :key="i"
        class="opcao"
        :class="classeOpcaoAtividade(i, op)"
        :disabled="respostaSelecionada !== null"
        @click="responderAtividade(i, op)"
      >{{ op }}</button>
      <div v-if="respostaSelecionada !== null" class="feedback" :class="acertouAtividade ? 'correto' : 'errado'">
        {{ acertouAtividade ? '🎉 Muito bem!' : '💡 Quase!' }} {{ atividadeAtual.explicacao }}
      </div>
      <button v-if="respostaSelecionada !== null" class="btn-primario mt" @click="irPara('atividades')">Continuar</button>
    </div>
`;
