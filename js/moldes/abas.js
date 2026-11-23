// Molde (HTML do Vue): abas para trocar entre as brincadeiras de palavras (Monte a Palavra, Memória, Som e Figura).
// Entra no topo de js/moldes/silabas.js, memoria.js e somfigura.js; carregar este arquivo antes deles no index.html.
LB.moldes = LB.moldes || {};
LB.moldes.abasPalavras = `
      <div class="abas-palavras" role="tablist" aria-label="Trocar de brincadeira">
        <button type="button" role="tab" class="aba-palavra" :class="{ ativa: tela === 'silabas' }" :aria-selected="tela === 'silabas'"
                @click="tela !== 'silabas' && abrirSilabas()">🧩 Monte a Palavra</button>
        <button type="button" role="tab" class="aba-palavra" :class="{ ativa: tela === 'memoria' }" :aria-selected="tela === 'memoria'"
                @click="tela !== 'memoria' && abrirMemoria()">🃏 Memória</button>
        <button type="button" role="tab" class="aba-palavra" :class="{ ativa: tela === 'som-figura' }" :aria-selected="tela === 'som-figura'"
                @click="tela !== 'som-figura' && abrirSomFigura()">🔊 Som e Figura</button>
      </div>`;
