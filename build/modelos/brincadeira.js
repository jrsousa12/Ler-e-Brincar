// Moldes dos 5 arquivos de uma brincadeira nova (usados por build/nova-brincadeira.js).
// b = { id: 'relogio', Cap: 'Relogio', nome: 'Relógio', emoji: '🕐', materia: 'mat' | 'lp' }
'use strict';

// Exemplo de conta pronto para rodar; quem cria a brincadeira troca pelo de verdade.
const exemplo = {
  mat: `  // EXEMPLO (troque): soma de dois números; o nível aumenta o tamanho dos números.
  const TETO = [0, 10, 20, 50, 100];
  function desafio(nivel) {
    const a = sortearEntre(1, TETO[nivel] / 2), b = sortearEntre(1, TETO[nivel] - a), certa = a + b;
    return { nivel, enunciado: a + ' + ' + b + ' = ?', fala: 'Quanto é ' + a + ' mais ' + b + '?', certa,
      opcoes: opcoes(certa, [certa + 1, certa - 1, certa + 10, certa - 10].filter(v => v > 0)) };
  }`,
  lp: `  // EXEMPLO (troque): com que letra começa a palavra; o nível muda a lista de palavras.
  const PALAVRAS = [[], ['BOLA', 'CASA', 'DADO'], ['FACA', 'GATO', 'MALA'], ['PATO', 'SAPO', 'VACA'], ['TATU', 'LUVA', 'JACA']];
  const LETRAS = 'BCDFGJLMPSTV'.split('');
  function desafio(nivel) {
    const palavra = unico(PALAVRAS[nivel]), certa = palavra[0];
    return { nivel, enunciado: palavra, fala: 'Com que letra começa ' + palavra.toLowerCase() + '?', certa,
      opcoes: opcoes(certa, embaralhar(LETRAS)) };
  }`
};

const regras = b => `// Regras da brincadeira "${b.nome}": sorteia os desafios e calcula o certo. Sem tela: só contas (testadas em testes/t_${b.id}.js).
// Criado por build/nova-brincadeira.js. Troque o EXEMPLO pelas contas de verdade, mantendo o formato de cada desafio:
// { nivel, enunciado (aparece grande), fala (lida em voz alta), certa, opcoes (3, com a certa) }.
LB.${b.id}Regras = (function () {
  'use strict';
  const sortearEntre = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const unico = lista => lista[Math.floor(Math.random() * lista.length)];
  function embaralhar(lista) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }
  // Três opções: a certa e as duas primeiras erradas da lista (erros comuns primeiro).
  function opcoes(certa, erradas) {
    const erros = [];
    erradas.forEach(v => { if (erros.length < 2 && v !== certa && !erros.includes(v)) erros.push(v); });
    return embaralhar([certa, ...erros]);
  }

${exemplo[b.materia]}

  // Rodada de 5 desafios, do fácil ao difícil.
  const sortearRodada = () => [1, 2, 3, 4, 4].map(desafio);

  return { sortearRodada, desafio, opcoes };
})();
`;

const tela = b => `// Brincadeira "${b.nome}" (regras em js/${b.id}regras.js; vai e vem da rodada no kit js/rodada.js).
// Criado por build/nova-brincadeira.js.
LB.usar${b.Cap} = function (ctx) {
  'use strict';
  const r = LB.rodada(ctx, {
    id: '${b.id}',
    sortear: () => LB.${b.id}Regras.sortearRodada(),
    frase: d => d.fala,
    textos: {
      erro: valor => 'Não foi ' + valor + '. Pense de novo e tente outro!',
      acerto: q => ['Isso! É ' + q.certa + '! ⭐', 'Muito bem! É ' + q.certa + '!']
    }
  });
  return { ...r.exportar('${b.Cap}') };
};
`;

const molde = b => `// Molde (HTML do Vue): Brincadeira "${b.nome}". Criado por build/nova-brincadeira.js.
LB.moldes = LB.moldes || {};
LB.moldes.${b.id} = \`
    <section v-if="tela === '${b.id}' && atual${b.Cap}" class="brincadeira-silabas brincadeira-${b.id}" aria-label="Brincadeira ${b.nome}">
      <button class="btn-voltar" @click="voltar('atividades')">← Voltar</button>
      <div class="topo-jogo">
        <span class="badge-fase">Desafio {{ indice${b.Cap} + 1 }} de {{ lista${b.Cap}.length }}</span>
        <button type="button" class="btn-silaba-3d btn-ouvir-palavra" @click="ouvir(atual${b.Cap}.fala)">🔊 Ouvir</button>
      </div>

      <p class="enunciado-${b.id}">{{ atual${b.Cap}.enunciado }}</p>

      <div class="opcoes-${b.id}">
        <button v-for="o in pergunta${b.Cap}.opcoes" :key="o" type="button" class="btn-silaba-3d bloco-silaba"
                :class="{ acertou: estado${b.Cap} === 'correto' && escolha${b.Cap} === o, quase: estado${b.Cap} === 'tentar-novamente' && escolha${b.Cap} === o }"
                @click="escolher${b.Cap}(o)">{{ o }}</button>
      </div>

      <div v-if="mensagem${b.Cap}" class="feedback-jogo" :class="estado${b.Cap}" role="status">
        <span>{{ mensagem${b.Cap} }}</span>
        <template v-if="estado${b.Cap} === 'correto'">
          <button v-if="!ultimo${b.Cap}" type="button" class="btn-silaba-3d btn-proximo" @click="seguir${b.Cap}">Próximo →</button>
          <button v-else type="button" class="btn-silaba-3d btn-proximo" @click="concluir${b.Cap}">Concluir 🎉</button>
        </template>
      </div>
    </section>
\`;
`;

const css = b => `/* Brincadeira "${b.nome}" (js/moldes/${b.id}.js). Cores de base.css. Criado por build/nova-brincadeira.js. */
.enunciado-${b.id}{text-align:center;font-size:2.2rem;font-weight:800;letter-spacing:.04em;margin:10px 0 18px;color:var(--cor-texto)}
.opcoes-${b.id}{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.opcoes-${b.id} .bloco-silaba{min-width:84px;font-size:1.8rem}
`;

// Teste: contas coerentes em 300 rodadas + rodada inteira na tela (erra, acerta, 5 estrelas, Concluir, filtro).
const teste = b => {
  const outra = b.materia === 'mat' ? 'Português' : 'Matemática', mesma = b.materia === 'mat' ? 'Matemática' : 'Português';
  return `// Teste guardado: brincadeira "${b.nome}" (js/${b.id}regras.js = contas; js/telas/${b.id}.js = tela).
// Uso: node testes/t_${b.id}.js   (criado por build/nova-brincadeira.js; amplie ao mudar as contas)
'use strict';
const path = require('path');
const { chromium } = require('playwright');
const raiz = path.join(__dirname, '..');

(async () => {
  let falhas = 0;
  const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});

  // CONTAS: 300 rodadas sorteadas, todas coerentes
  const defeitos = await p.evaluate(() => {
    const d = [];
    for (let i = 0; i < 300; i++) {
      const r = LB.${b.id}Regras.sortearRodada();
      if (r.length !== 5) d.push('rodada sem 5 desafios');
      r.forEach(x => {
        if (typeof x.enunciado !== 'string' || typeof x.fala !== 'string' || !x.nivel) d.push('desafio sem enunciado, fala ou nível');
        if (!Array.isArray(x.opcoes) || new Set(x.opcoes).size !== 3 || !x.opcoes.includes(x.certa)) d.push('opções ruins ' + x.opcoes);
      });
    }
    return [...new Set(d)];
  });
  ok(defeitos.length === 0, 'contas: ' + defeitos.join(' | '));

  // TELA: abre pela lista de brincadeiras
  await p.click('.bloco-menu.brincar');
  await p.click('.bloco-brincadeira:has-text("${b.nome}")');
  ok(await p.locator('.brincadeira-${b.id}').count() === 1, 'abre a brincadeira');
  const estrelas = () => p.evaluate(() => LB.app.estrelas);
  const e0 = await estrelas();
  const clicar = v => p.click(\`.opcoes-${b.id} button:text-is("\${v}")\`);
  const certa = () => p.evaluate(() => LB.app.pergunta${b.Cap}.certa);

  const errada = await p.evaluate(() => LB.app.pergunta${b.Cap}.opcoes.find(o => o !== LB.app.pergunta${b.Cap}.certa));
  await clicar(errada);
  ok(await p.locator('.feedback-jogo.tentar-novamente').count() === 1 && await estrelas() === e0, 'erro pede nova tentativa, sem estrela');
  await clicar(await certa());
  ok(await p.locator('.feedback-jogo.correto').count() === 1 && await estrelas() === e0 + 1, 'acerto: 1 estrela');
  for (let i = 0; i < 4; i++) { await p.click('.btn-proximo:has-text("Próximo")'); await clicar(await certa()); }
  await p.click('.btn-proximo:has-text("Concluir")');
  ok(await p.evaluate(() => LB.app.tela === 'atividades' && LB.app.concluidos['${b.id}'] === true), 'concluir volta e marca feito');
  ok(await estrelas() === e0 + 5, 'rodada rende 5 estrelas: ' + (await estrelas() - e0));

  // Filtros da lista
  await p.click('.filtro >> text=${outra}');
  ok(await p.locator('.bloco-brincadeira:has-text("${b.nome}")').count() === 0, '${outra} esconde a brincadeira');
  await p.click('.filtro >> text=${mesma}');
  ok(await p.locator('.bloco-brincadeira:has-text("${b.nome}")').count() === 1, '${mesma} mostra a brincadeira');
  ok(erros.length === 0, 'sem erros: ' + erros.join(' | '));

  await b.close();
  console.log(falhas ? \`t_${b.id}: \${falhas} falha(s)\` : 't_${b.id}: OK');
  process.exit(falhas ? 1 : 0);
})();
`;
};

module.exports = { regras, tela, molde, css, teste };
