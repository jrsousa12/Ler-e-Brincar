// Molde (HTML do Vue): Área do responsável — progresso, onde errou mais e impressão.
LB.moldes = LB.moldes || {};
LB.moldes.responsavel = `
    <div v-if="tela === 'responsavel'">
      <button class="btn-voltar" @click="irPara('home')">← Sair da área dos adultos</button>
      <h2>Área do responsável</h2>

      <div class="card sem-clique">
        <div class="card-titulo">📊 Progresso</div>
        <p class="card-meta">⭐ {{ estrelas }} estrelas · 🚀 {{ missoesFeitas }} missões · 🔥 {{ diasSeguidos }} dias seguidos</p>
        <div class="linha-resumo" v-for="a in feitosPorArea" :key="a.nome">
          <span>{{ a.nome }}</span><span>{{ a.feitos }} de {{ a.total }}</span>
        </div>
      </div>

      <div class="card sem-clique">
        <div class="card-titulo">🎯 Acerto na 1ª tentativa</div>
        <div class="linha-resumo" v-for="m in porMateria" :key="m.materia">
          <span>{{ m.nome }}</span>
          <span>{{ m.taxa === null ? 'ainda sem respostas' : m.taxa + '% (' + m.respondidas + ' perguntas)' }}</span>
        </div>
      </div>

      <div class="card sem-clique">
        <div class="card-titulo">🔎 Onde errou mais</div>
        <p class="card-meta" v-if="!ondeErrou.length">Nenhum erro registrado até agora.</p>
        <div class="linha-erro" v-for="g in ondeErrou" :key="g.habilidade">
          <div><strong>{{ g.habilidade }}</strong> · {{ g.materia }} — {{ g.erros }} erro(s)</div>
          <div class="card-meta">{{ g.exemplos }}</div>
        </div>
      </div>

      <div class="card sem-clique">
        <div class="card-titulo">🖨️ Imprimir</div>
        <p class="card-meta">Atividades: primeiro as que ela errou, depois as que ainda não fez.</p>
        <div class="linha-botoes">
          <button class="btn-secundario" @click="imprimirAtividades('lingua-portuguesa')">📝 Português</button>
          <button class="btn-secundario" @click="imprimirAtividades('matematica')">🧮 Matemática</button>
        </div>
        <p class="card-meta mt">Desenho para colorir:</p>
        <div class="linha-botoes">
          <select class="campo-select" v-model="desenhoParaImprimir" aria-label="Desenho para imprimir">
            <option v-for="c in conteudo.colorir" :key="c.id" :value="c.id">{{ c.emoji }} {{ c.titulo }}</option>
          </select>
          <button class="btn-secundario" @click="imprimirDesenho">🖨️ Imprimir</button>
        </div>
      </div>
    </div>
`;
