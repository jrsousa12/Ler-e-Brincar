// Molde (HTML do Vue): telas "Português", "Matemática" e "Prêmios" (comportamento em js/telas/materias.js).
// Botão de brincadeira nova entra antes do fim da grade da matéria (build/nova-brincadeira.js).
LB.moldes = LB.moldes || {};
LB.moldes.materias = `
    <!-- PORTUGUÊS -->
    <div v-if="tela === 'portugues'">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="irPara('home')">← Voltar</button></teleport>
      <div class="grade-brincadeiras grade-portugues">
        <button type="button" class="bloco-brincadeira ler" @click="irPara('ler')">
          <span class="bloco-emoji" aria-hidden="true">📖</span>Histórias
        </button>
        <button type="button" class="bloco-brincadeira ler" @click="abrirQuestoes('lingua-portuguesa')">
          <span class="bloco-emoji" aria-hidden="true">📝</span>Questões
        </button>
        <button type="button" class="bloco-brincadeira ler" @click="abrirSilabas">
          <span class="bloco-emoji" aria-hidden="true">🧩</span>Monte a Palavra<span v-if="concluidos.silabas" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira ler" @click="abrirMemoria">
          <span class="bloco-emoji" aria-hidden="true">🃏</span>Memória<span v-if="concluidos.memoria" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira ler" @click="abrirSomFigura">
          <span class="bloco-emoji" aria-hidden="true">🔊</span>Som e Figura<span v-if="concluidos['som-figura']" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira ler" @click="abrirOrdem">
          <span class="bloco-emoji" aria-hidden="true">🔢</span>Ordem dos Fatos<span v-if="concluidos['ordem']" class="selo-feito">✓</span>
        </button>
      </div>
    </div>

    <!-- MATEMÁTICA -->
    <div v-if="tela === 'matematica'">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="irPara('home')">← Voltar</button></teleport>
      <div class="grade-brincadeiras grade-matematica">
        <button type="button" class="bloco-brincadeira brincar" @click="abrirQuestoes('matematica')">
          <span class="bloco-emoji" aria-hidden="true">➕</span>Contas
        </button>
        <button type="button" class="bloco-brincadeira brincar" @click="abrirMercado">
          <span class="bloco-emoji" aria-hidden="true">🛒</span>Mercadinho<span v-if="concluidos.mercado" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira brincar" @click="abrirTrem">
          <span class="bloco-emoji" aria-hidden="true">🚂</span>Trem dos números<span v-if="concluidos.trem" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira brincar" @click="abrirPacote">
          <span class="bloco-emoji" aria-hidden="true">📦</span>Pacotes de contas<span v-if="concluidos['pacote']" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira mercado" @click="abrirRelogio">
          <span class="bloco-emoji" aria-hidden="true">🕐</span>Que horas são?<span v-if="concluidos['relogio']" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira mercado" @click="abrirRegua">
          <span class="bloco-emoji" aria-hidden="true">📏</span>Régua<span v-if="concluidos['regua']" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira mercado" @click="abrirFormas">
          <span class="bloco-emoji" aria-hidden="true">🔺</span>Formas<span v-if="concluidos['formas']" class="selo-feito">✓</span>
        </button>
        <button type="button" class="bloco-brincadeira mercado" @click="abrirGrafico">
          <span class="bloco-emoji" aria-hidden="true">📊</span>Gráfico de barras<span v-if="concluidos['grafico']" class="selo-feito">✓</span>
        </button>
      </div>
    </div>

    <!-- PRÊMIOS -->
    <div v-if="tela === 'premios'">
      <teleport to="#slot-voltar"><button class="btn-voltar" @click="irPara('home')">← Voltar</button></teleport>
      <p class="texto-suave">Você tem <strong>{{ estrelas }} ⭐</strong></p>
      <div class="grade-brincadeiras grade-premios">
        <button type="button" class="bloco-brincadeira brincar" @click="irPara('recompensas')">
          <span class="bloco-emoji" aria-hidden="true">🏅</span>Meus selos
        </button>
        <button type="button" class="bloco-brincadeira colorir" @click="irPara('colorir')">
          <span class="bloco-emoji" aria-hidden="true">🎨</span>Colorir
        </button>
      </div>
    </div>
`;
