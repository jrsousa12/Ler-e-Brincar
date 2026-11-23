// Molde (HTML do Vue): Brincadeira "Mercadinho" (pagar certinho e calcular o troco).
LB.moldes = LB.moldes || {};
LB.moldes.mercado = `
    <section v-if="tela === 'mercado' && compraMercado" class="brincadeira-silabas brincadeira-mercado" aria-label="Brincadeira Mercadinho">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <div class="topo-jogo">
        <span class="badge-fase">Compra {{ indiceMercado + 1 }} de {{ comprasMercado.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(compraMercado.tipo === 'montar' ? 'Pague ' + compraMercado.total + ' reais' : 'Troco de uma nota de ' + compraMercado.pago + ' reais')">🔊 Ouvir</button>
      </div>

      <div class="prateleira">
        <div v-for="p in compraMercado.produtos" :key="p.nome" class="produto">
          <span class="produto-emoji" aria-hidden="true">{{ p.emoji }}</span>
          <span class="produto-nome">{{ p.nome }}</span>
          <span class="etiqueta-preco">R$ {{ p.preco }}</span>
        </div>
      </div>

      <!-- Nível 1: montar o preço com moedas e notas -->
      <template v-if="compraMercado.tipo === 'montar'">
        <p class="dica-texto">Pague <b>R$ {{ compraMercado.total }}</b> com moedas e notas.</p>
        <div class="bandeja" :class="estadoMercado" aria-label="Bandeja de pagamento">
          <button v-for="d in bandejaMercado" :key="d.id" type="button" class="dinheiro" :class="dinheiroDe(d.valor).tipo + ' v' + d.valor"
                  @click="tirarDinheiro(d.id)" :aria-label="'Tirar ' + d.valor + ' reais'">R$ {{ d.valor }}</button>
          <span v-if="!bandejaMercado.length" class="bandeja-vazia">Toque no dinheiro para pagar</span>
        </div>
        <p class="soma-bandeja">Você pôs: <b>R$ {{ somaBandeja }}</b></p>
        <div class="carteira" aria-label="Carteira">
          <button v-for="v in compraMercado.carteira" :key="v" type="button" class="dinheiro" :class="dinheiroDe(v).tipo + ' v' + v"
                  @click="porDinheiro(v)" :aria-label="'Pôr ' + v + ' reais'">R$ {{ v }}</button>
        </div>
      </template>

      <!-- Níveis 2 e 3: total e troco -->
      <template v-else>
        <p class="dica-texto">Você paga com uma nota de <b>R$ {{ compraMercado.pago }}</b>.</p>
        <div class="carteira"><span class="dinheiro nota v10" :class="'v' + compraMercado.pago">R$ {{ compraMercado.pago }}</span></div>
        <p class="pergunta-mercado">{{ perguntaMercado.pergunta }}</p>
        <div class="opcoes-mercado">
          <button v-for="o in perguntaMercado.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba"
                  :class="{ acertou: estadoMercado === 'correto' && escolhaMercado === o, quase: estadoMercado === 'tentar-novamente' && escolhaMercado === o }"
                  @click="escolherMercado(o)">R$ {{ o }}</button>
        </div>
      </template>

      <div v-if="mensagemMercado" class="feedback-jogo" :class="estadoMercado" role="status">
        <span>{{ mensagemMercado }}</span>
        <template v-if="estadoMercado === 'correto'">
          <button v-if="!ultimaDoMercado" type="button" class="btn-silaba-3d btn-proximo" @click="seguirMercado">Próxima →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluirMercado">Concluir 🎉</button>
        </template>
      </div>
    </section>
`;
