// Molde (HTML do Vue): Cópia de segurança e instalação (embaixo dos Ajustes, na Área do responsável).
LB.moldes = LB.moldes || {};
LB.moldes.backup = `
    <div v-if="tela === 'responsavel'">
      <div class="card sem-clique">
        <div class="card-titulo">💾 Cópia de segurança</div>
        <div class="card-meta" style="margin-bottom:10px">Guarda estrelas, selos, missões e respostas num arquivo. Serve para trocar de aparelho ou não perder nada.</div>
        <p class="card-meta aviso-copia" :class="{ precisa: lembreteCopia.precisa }" style="margin-bottom:10px">{{ lembreteCopia.precisa ? '⏰ ' : '' }}{{ lembreteCopia.texto }}</p>
        <div class="linha-botoes">
          <button class="btn-secundario" @click="baixarCopia">⬇️ Baixar cópia</button>
          <label class="btn-secundario botao-arquivo">⬆️ Trazer cópia
            <input type="file" accept=".json,application/json" @change="importarCopia" class="esconder-arquivo" />
          </label>
        </div>
        <p class="card-meta" v-if="avisoCopia" style="margin-top:10px">{{ avisoCopia }}</p>
      </div>
      <div class="card sem-clique" v-if="podeInstalar || telaCheiaDisponivel">
        <div class="card-titulo">📱 No tablet</div>
        <div class="linha-botoes">
          <button class="btn-secundario" v-if="podeInstalar" @click="instalar">📲 Instalar o app</button>
          <button class="btn-secundario" v-if="telaCheiaDisponivel" @click="alternarTelaCheia">{{ emTelaCheia ? '↙️ Sair da tela cheia' : '⛶ Tela cheia' }}</button>
        </div>
      </div>
    </div>
`;
