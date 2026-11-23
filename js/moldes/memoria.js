// Molde (HTML do Vue): Brincadeira "Memória" (par figura + palavra).
LB.moldes = LB.moldes || {};
LB.moldes.memoria = `
    <section v-if="tela === 'memoria'" class="brincadeira-silabas" aria-label="Brincadeira da Memória">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
${LB.moldes.abasPalavras}
      <div class="topo-jogo">
        <span class="badge-fase">Pares: {{ paresMemoria }} de {{ totalParesMemoria }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="embaralharMemoria">↻ Embaralhar</button>
      </div>
      <p class="dica-texto">Ache os pares: a figura e a palavra escrita.</p>
      <div class="grade-memoria">
        <button v-for="c in cartasMemoria" :key="c.uid" type="button" class="carta-memoria"
                :class="{ virada: c.virada || c.achada, achada: c.achada }" @click="virarCarta(c)"
                :aria-label="c.virada || c.achada ? c.palavra : 'Carta virada para baixo'">
          <span v-if="!(c.virada || c.achada)" class="carta-costas" aria-hidden="true">?</span>
          <span v-else-if="c.tipo === 'figura'" class="carta-emoji" aria-hidden="true">{{ c.emoji }}</span>
          <span v-else class="carta-palavra">{{ c.palavra }}</span>
        </button>
      </div>
      <div v-if="memoriaCompleta" class="feedback-jogo correto" role="status">
        <span>Parabéns! Você achou todos os pares! 🎉</span>
        <button type="button" class="btn-silaba-3d btn-proximo" @click="concluirMemoria">Concluir 🎉</button>
      </div>
    </section>
`;
