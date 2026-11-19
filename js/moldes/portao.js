// Molde (HTML do Vue): Trava dos adultos — uma conta de multiplicar.
LB.moldes = LB.moldes || {};
LB.moldes.portao = `
  <div class="portao-parental" v-if="portaoAberto">
    <h2>Área dos adultos</h2>
    <p class="instrucao">Para entrar, responda a conta:</p>
    <p class="conta-portao">{{ portao.a }} × {{ portao.b }} = ?</p>
    <input class="campo-portao" v-model="portao.resposta" inputmode="numeric" autocomplete="off"
           aria-label="Resposta da conta" @keyup.enter="conferirPortao" />
    <p v-if="portao.erro" class="texto-suave">Resposta errada. Tente esta outra conta.</p>
    <div class="linha-botoes" style="margin-top:var(--space)">
      <button class="btn-secundario" @click="fecharPortao">Cancelar</button>
      <button class="btn-primario" @click="conferirPortao">Entrar</button>
    </div>
  </div>
`;
