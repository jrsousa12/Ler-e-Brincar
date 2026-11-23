// Molde (HTML do Vue): Área do responsável — progresso, onde errou mais e impressão.
LB.moldes = LB.moldes || {};
LB.moldes.responsavel = `
    <div v-if="tela === 'responsavel'">
      <button class="btn-voltar sobrio" @click="irPara('home')">← Sair da área dos adultos</button>
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
        <div class="card-titulo">📈 Evolução</div>
        <p class="card-meta">Acerto na 1ª tentativa, semana a semana (últimas 6). Esta semana ela usou o app em {{ evolucao.diasEstaSemana }} dia(s).</p>
        <div class="evo-bloco" v-for="l in evolucao.linhas" :key="l.nome">
          <div class="linha-resumo"><span>{{ l.nome }}</span>
            <span v-if="l.resumo">de {{ l.resumo.de }}% para {{ l.resumo.para }}%</span>
            <span v-else class="card-meta">ainda poucas semanas</span></div>
          <div class="evo-barras">
            <div class="evo-col" v-for="s in l.semanas" :key="s.rotulo"
                 :title="s.taxa === null ? 'sem uso' : s.taxa + '% de ' + s.perguntas + ' perguntas'">
              <div class="evo-num">{{ s.taxa === null ? '–' : s.taxa + '%' }}</div>
              <div class="evo-trilho"><div class="evo-barra" :style="{height: (s.taxa || 0) + '%'}"></div></div>
              <div class="evo-sem">{{ s.rotulo }}</div>
            </div>
          </div>
        </div>
        <div class="linha-erro" v-for="h in evolucao.mudancas.melhoraram" :key="'m' + h.habilidade">
          ✅ <strong>{{ h.habilidade }}</strong> melhorou: {{ h.antes }}% → {{ h.agora }}%
        </div>
        <div class="linha-erro" v-for="h in evolucao.mudancas.pioraram" :key="'p' + h.habilidade">
          ⚠️ <strong>{{ h.habilidade }}</strong> precisa de atenção: {{ h.antes }}% → {{ h.agora }}%
        </div>
        <p class="card-meta">Habilidades: comparo as 2 últimas semanas com as 2 anteriores (só com 5 perguntas ou mais em cada). Semana sem uso aparece como “–”.</p>
      </div>

      <div class="card sem-clique">
        <div class="card-titulo">🔎 Onde errou mais</div>
        <p class="card-meta" v-if="!ondeErrou.length">Nenhum erro registrado até agora.</p>
        <div class="linha-erro" v-for="g in ondeErrou" :key="g.habilidade">
          <div><strong>{{ g.habilidade }}</strong> · {{ g.materia }} — {{ g.erros }} erro(s)</div>
          <div class="card-meta">{{ g.exemplos }}</div>
        </div>
        <p class="card-meta">🔁 No caderno de revisão: {{ noCaderno }} pergunta(s). Elas voltam na missão até ela acertar 2 vezes seguidas de primeira.</p>
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
