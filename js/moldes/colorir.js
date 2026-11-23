// Molde (HTML do Vue): Telas "Colorir" (lista) e desenho para pintar.
LB.moldes = LB.moldes || {};
LB.moldes.colorir = `
    <!-- COLORIR (lista) -->
    <div v-if="tela === 'colorir'">
      <button class="btn-voltar" @click="irPara('home')">← Voltar</button>
      <h2>Desenhos para colorir</h2>
      <div class="grade-cartoes">
        <div class="card" v-for="c in conteudo.colorir" :key="c.id" @click="abrirColorir(c)" tabindex="0">
          <div class="card-capa" style="background:linear-gradient(135deg,#FFF3E0,#FFE9E1);font-size:3em">{{ c.emoji }}</div>
          <div class="card-titulo">{{ c.titulo }}</div>
          <div class="card-meta" v-if="concluidos[c.id]" style="color:var(--cor-sucesso);font-weight:700">✓ Já pintou</div>
        </div>
      </div>
    </div>

    <!-- COLORIR-ITEM -->
    <div v-if="tela === 'colorir-item' && colorirAtual">
      <button class="btn-voltar" @click="voltar('colorir')">← Voltar</button>
      <h2>{{ colorirAtual.titulo }}</h2>
      <p class="texto-suave">Toque nas formas para pintar</p>
      <div class="paleta">
        <button
          v-for="cor in paletaCores"
          :key="cor"
          class="cor"
          :class="{selecionada: corAtual === cor}"
          :style="{background: cor}"
          @click="corAtual = cor"
          :title="cor"
        ></button>
      </div>
      <div class="svg-colorir" ref="svgRef" @click="pintarForma"></div>
      <div class="linha-botoes mt">
        <button class="btn-secundario" @click="resetarDesenho">🔄 Recomeçar</button>
        <button class="btn-primario" @click="concluirColorir">✓ Pronto!</button>
      </div>
    </div>
`;
