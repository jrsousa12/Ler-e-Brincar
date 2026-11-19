// Molde (HTML do Vue): aviso de versão nova do app (só na tela inicial e na área dos adultos).
LB.moldes = LB.moldes || {};
LB.moldes.versao = `
    <div class="aviso-versao" v-if="versaoNova && (tela === 'home' || tela === 'responsavel')" role="status">
      <span>✨ Tem uma versão nova do app!</span>
      <button class="btn-primario" @click="atualizarApp">Atualizar</button>
    </div>
`;
