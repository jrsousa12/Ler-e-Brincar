// Molde (HTML do Vue): Tela "Ajustes" (só depois do portão).
LB.moldes = LB.moldes || {};
LB.moldes.ajustes = `
    <!-- AJUSTES (só acessa depois do portão) -->
    <div v-if="tela === 'ajustes'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Ajustes</h2>
      <div class="card" style="cursor:default">
        <div class="card-titulo">Fonte para dislexia</div>
        <div class="card-meta" style="margin-bottom:10px">Usa a fonte Lexend com mais espaçamento</div>
        <button class="btn-secundario" @click="toggleDislexia" :style="ajustes.dislexia ? 'background:var(--cor-primaria);color:#fff;border-color:var(--cor-primaria)' : ''">
          {{ ajustes.dislexia ? '✓ Ativada' : 'Desativada' }}
        </button>
      </div>
      <div class="card" style="cursor:default">
        <div class="card-titulo">Tamanho do texto</div>
        <div class="filtros" style="margin-top:10px;margin-bottom:0">
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'pequeno'}" @click="mudarTamanho('pequeno')">Pequeno</button>
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'medio'}" @click="mudarTamanho('medio')">Médio</button>
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'grande'}" @click="mudarTamanho('grande')">Grande</button>
        </div>
      </div>
      <div class="card" style="cursor:default">
        <div class="card-titulo">Progresso</div>
        <div class="card-meta" style="margin-bottom:10px">Estrelas: {{ estrelas }} · Itens concluídos: {{ totalConcluidos }}</div>
        <button class="btn-secundario" @click="resetarProgresso">🧹 Zerar progresso</button>
      </div>
    </div>
`;
