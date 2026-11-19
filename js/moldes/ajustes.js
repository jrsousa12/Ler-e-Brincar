// Molde (HTML do Vue): Ajustes (aparece embaixo da Área do responsável).
LB.moldes = LB.moldes || {};
LB.moldes.ajustes = `
    <div v-if="tela === 'responsavel'">
      <h2 class="mt">⚙️ Ajustes</h2>
      <div class="card sem-clique">
        <div class="card-titulo">🔊 Voz</div>
        <p class="card-meta" v-if="!vozDisponivel">Este aparelho não tem voz para leitura.</p>
        <div class="linha-resumo">
          <span>Ler as perguntas sozinho</span>
          <button class="filtro" :class="{ativo: ajustes.vozAuto}" @click="alternar('vozAuto')">{{ ajustes.vozAuto ? '✓ Ligado' : 'Desligado' }}</button>
        </div>
        <div class="filtros" style="margin-top:10px;margin-bottom:0">
          <button class="filtro" :class="{ativo: ajustes.velocidade === 0.75}" @click="mudarVelocidade(0.75)">🐢 Devagar</button>
          <button class="filtro" :class="{ativo: ajustes.velocidade === 0.9}" @click="mudarVelocidade(0.9)">Normal</button>
          <button class="filtro" :class="{ativo: ajustes.velocidade === 1.05}" @click="mudarVelocidade(1.05)">🐇 Rápida</button>
        </div>
      </div>
      <div class="card sem-clique">
        <div class="linha-resumo">
          <span class="card-titulo">🎵 Sons de festa</span>
          <button class="filtro" :class="{ativo: ajustes.som}" @click="alternar('som')">{{ ajustes.som ? '✓ Ligado' : 'Desligado' }}</button>
        </div>
      </div>
      <div class="card sem-clique">
        <div class="card-titulo">Fonte para dislexia</div>
        <div class="card-meta" style="margin-bottom:10px">Usa a fonte Lexend com mais espaçamento</div>
        <button class="filtro" :class="{ativo: ajustes.dislexia}" @click="alternar('dislexia')">{{ ajustes.dislexia ? '✓ Ativada' : 'Desativada' }}</button>
      </div>
      <div class="card sem-clique">
        <div class="card-titulo">Tamanho do texto</div>
        <div class="filtros" style="margin-top:10px;margin-bottom:0">
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'pequeno'}" @click="mudarTamanho('pequeno')">Pequeno</button>
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'medio'}" @click="mudarTamanho('medio')">Médio</button>
          <button class="filtro" :class="{ativo: ajustes.tamanho === 'grande'}" @click="mudarTamanho('grande')">Grande</button>
        </div>
      </div>
      <div class="card sem-clique">
        <div class="card-titulo">Zerar progresso</div>
        <div class="card-meta" style="margin-bottom:10px">Apaga estrelas, selos, missões e respostas.</div>
        <button class="btn-secundario" @click="resetarProgresso">🧹 Zerar progresso</button>
      </div>
    </div>
`;
