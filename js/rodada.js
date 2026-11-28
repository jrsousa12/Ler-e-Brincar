// Kit de rodada: a parte que toda brincadeira repete (sortear os desafios, "1 de 5", errar e tentar de novo,
// acertar e ganhar estrela, Próximo e Concluir). Cada brincadeira só diz o que é diferente nela.
// Uso: const r = LB.rodada(ctx, { id: 'trem', sortear: () => [...], frase: d => 'texto lido ao começar',
//        etapas: d => d.faltam,            // perguntas de cada desafio (padrão: o próprio desafio, uma só)
//        habilidade: 'EF02MA19', titulo: 'Que horas são?',   // anota cada resposta (Área do responsável) e pesa a habilidade na missão
//        aoCarregar: d => {},              // limpar o que for só da brincadeira
//        textos: { erro: (valor, d, q) => 'msg', acerto: (q, d, final) => ['msg na tela', 'frase falada'] } });
//      return { ...r.exportar('Trem') }   // abrirTrem, escolherTrem, perguntaTrem, estadoTrem...
// A estrela vem só ao acertar a última pergunta de cada desafio. Teste: testes/t_rodada.js
LB.rodada = function (ctx, cfg) {
  'use strict';
  const { ref, computed } = Vue;
  const lista = ref([]);
  const indice = ref(0);
  const etapa = ref(0);           // pergunta atual dentro do desafio
  const escolha = ref(null);
  const mensagem = ref('');
  const estado = ref('');         // '', 'correto', 'tentar-novamente'
  const etapasDe = d => (cfg.etapas ? cfg.etapas(d) : null) || [d];
  let tentativa = 0;              // erros + acertos da pergunta atual (para o registro de respostas)
  const MATERIAS = { portugues: 'lingua-portuguesa', matematica: 'matematica' };
  const somLigado = () => ctx.ajustes.value.som !== false;

  const atual = computed(() => lista.value[indice.value]);
  const pergunta = computed(() => atual.value ? etapasDe(atual.value)[etapa.value] : null);
  const etapaFinal = () => !!atual.value && etapa.value === etapasDe(atual.value).length - 1;
  const ultimo = computed(() => indice.value === lista.value.length - 1 && etapaFinal());

  function limpar() { escolha.value = null; mensagem.value = ''; estado.value = ''; }

  // Cada resposta vai para o registro; só a 1ª tentativa de cada pergunta pesa a habilidade no caderno.
  function registrar(acertou) {
    if (!cfg.habilidade) return;
    tentativa += 1;
    LB.tentativas.registrar({ id: cfg.id, materia: MATERIAS[(LB.materiaDe || {})[cfg.id]] || 'lingua-portuguesa',
      habilidade: cfg.habilidade, titulo: cfg.titulo || cfg.id, acertou, tentativa });
    if (tentativa === 1 && ctx.anotarHabilidade) ctx.anotarHabilidade(cfg.habilidade, acertou);   // só a 1ª resposta pesa
  }

  function carregar() {
    etapa.value = 0;
    tentativa = 0;
    limpar();
    if (cfg.aoCarregar) cfg.aoCarregar(atual.value);
    if (cfg.frase) ctx.falarSozinho(cfg.frase(atual.value));
  }

  function abrir() {
    const sorteados = cfg.sortear();
    if (!sorteados || !sorteados.length) return;   // sem conteúdo: não abre a tela
    lista.value = sorteados;
    indice.value = 0;
    carregar();
    ctx.tela.value = cfg.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function errou(texto) {
    estado.value = 'tentar-novamente';
    mensagem.value = texto;
    registrar(false);
    LB.festa.erro(somLigado());
  }

  // Acerto: festa, voz e, se for a última pergunta do desafio, 1 estrela.
  function acertou(texto, fala) {
    estado.value = 'correto';
    mensagem.value = texto;
    registrar(true);
    if (etapaFinal()) ctx.estrelas.value += 1;
    LB.festa.acerto(somLigado());
    if (fala) LB.voz.falar(fala);
  }

  // Brincadeira de botões: confere o valor tocado com pergunta.certa.
  function escolher(valor) {
    if (estado.value === 'correto') return;
    escolha.value = valor;
    const q = pergunta.value, d = atual.value;
    if (valor !== q.certa) return errou(cfg.textos.erro(valor, d, q));
    const [texto, fala] = cfg.textos.acerto(q, d, etapaFinal());
    acertou(texto, fala);
  }

  function seguir() {
    if (!etapaFinal()) { etapa.value += 1; tentativa = 0; limpar(); }
    else if (indice.value < lista.value.length - 1) { indice.value += 1; carregar(); }
  }

  function concluir() {
    ctx.marcarConcluido(cfg.id);
    ctx.terminarItem((LB.materiaDe || {})[cfg.id] || 'home');   // volta para a matéria (js/telas/materias.js)
  }

  const kit = { lista, indice, etapa, escolha, mensagem, estado, atual, pergunta, ultimo, abrir, carregar, limpar, errou, acertou, escolher, seguir, concluir };

  // Nomes para o molde, com o nome da brincadeira no fim: exportar('Trem') → indiceTrem, abrirTrem...
  kit.exportar = function (nome) {
    const saida = {};
    ['lista', 'indice', 'etapa', 'escolha', 'mensagem', 'estado', 'atual', 'pergunta', 'ultimo', 'abrir', 'escolher', 'seguir', 'concluir']
      .forEach(k => { saida[k + nome] = kit[k]; });
    return saida;
  };
  return kit;
};

// Embaralha uma cópia da lista (a original não muda). Usado pelas brincadeiras para sortear.
LB.rodada.embaralhar = function (lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};
