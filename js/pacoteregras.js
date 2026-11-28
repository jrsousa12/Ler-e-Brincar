// Regras da brincadeira "Pacotes de contas": monta pacotes com as questões do banco (conteudo/mat.js).
// Pacote = 4 questões da MESMA habilidade da BNCC, da mais fácil à mais difícil.
// Rodada = 3 pacotes de habilidades diferentes. Caderno de erros (js/caderno.js):
//  - a habilidade da 1ª questão a revisar entra primeiro, e até 2 questões do caderno vão no pacote dela;
//  - as outras habilidades são sorteadas com mais chance para as fracas (LB.caderno.peso);
//  - as questões novas saem do nível atual de cada habilidade (js/nivel.js).
// Sem tela: só escolhas (testadas em testes/t_pacote.js).
LB.pacoteRegras = (function () {
  'use strict';
  const TAMANHO_PACOTE = 4;
  const PACOTES_POR_RODADA = 3;
  const REVISAO_POR_PACOTE = 2;
  const OPCAO_LONGA = 8;   // letras: acima disso, os botões ficam um embaixo do outro

  const nomeDe = h => LB.nomeHabilidade ? LB.nomeHabilidade(h, 'Desafios') : 'Desafios'; // js/nomeshab.js
  const nivelDe = i => i.nivel || 1;

  function embaralhar(lista, rnd) {
    const c = [...lista];
    for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
    return c;
  }

  // Pergunta da tela a partir de uma questão do banco (a certa vem da regra única js/respostas.js).
  function pergunta(item, revisao, rnd) {
    const certa = item.opcoes[LB.respostas.indiceCorreto(item)];
    return {
      id: item.id, nivel: nivelDe(item), enunciado: item.enunciado, fala: item.enunciado,
      apoio: item.apoioVisual || null, explicacao: item.explicacao || '', revisao,
      certa, opcoes: embaralhar(item.opcoes, rnd),
      longas: item.opcoes.some(o => String(o).length > OPCAO_LONGA), item
    };
  }

  // Questões por habilidade; só ficam as habilidades com questões para um pacote inteiro.
  function grupos(itens) {
    const g = {};
    itens.forEach(i => { if (i.habilidadeBNCC) (g[i.habilidadeBNCC] = g[i.habilidadeBNCC] || []).push(i); });
    Object.keys(g).forEach(h => { if (g[h].length < TAMANHO_PACOTE) delete g[h]; });
    return g;
  }

  // Sorteio com peso: habilidade fraca (mais erros no caderno) sai mais.
  function sortearComPeso(lista, pesoDe, rnd) {
    const pesos = lista.map(pesoDe);
    let alvo = rnd() * pesos.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lista.length; i++) { alvo -= pesos[i]; if (alvo < 0) return lista[i]; }
    return lista[lista.length - 1];
  }

  function escolherHabilidades(g, caderno, revisar, rnd) {
    const escolhidas = [];
    const primeira = revisar.map(id => Object.keys(g).find(h => g[h].some(i => i.id === id))).find(Boolean);
    if (primeira) escolhidas.push(primeira);
    while (escolhidas.length < PACOTES_POR_RODADA) {
      const livres = Object.keys(g).filter(h => !escolhidas.includes(h));
      if (!livres.length) break;
      escolhidas.push(sortearComPeso(livres, h => LB.caderno.peso(caderno, h), rnd));
    }
    return escolhidas;
  }

  // Novas: primeiro as do nível atual da habilidade (js/nivel.js), depois as dos níveis mais perto.
  function pacote(habilidade, lista, revisar, rnd, alvo) {
    const doCaderno = revisar.map(id => lista.find(i => i.id === id)).filter(Boolean).slice(0, REVISAO_POR_PACOTE);
    const perto = i => alvo ? Math.abs(nivelDe(i) - alvo) : 0;
    const novas = embaralhar(lista.filter(i => !doCaderno.includes(i)), rnd)
      .sort((a, b) => perto(a) - perto(b)).slice(0, TAMANHO_PACOTE - doCaderno.length);
    const escolhidas = [...doCaderno, ...novas].sort((a, b) => nivelDe(a) - nivelDe(b));
    const titulo = nomeDe(habilidade);
    const media = escolhidas.reduce((s, i) => s + nivelDe(i), 0) / escolhidas.length;
    return {
      habilidade, titulo, nivel: Math.round(media), media, fala: 'Pacote ' + titulo + '. Vamos lá!',
      perguntas: escolhidas.map(i => pergunta(i, doCaderno.includes(i), rnd))
    };
  }

  // Rodada: 3 pacotes, do mais fácil ao mais difícil. itens = questões de uma matéria.
  function sortearRodada(itens, caderno, rnd = Math.random) {
    if (!itens || !itens.length) return [];
    const g = grupos(itens);
    const revisar = LB.caderno.paraRevisar(caderno, itens[0].materia);
    return escolherHabilidades(g, caderno, revisar, rnd)
      .map(h => pacote(h, g[h], revisar, rnd, LB.nivel && LB.nivel.de(caderno && caderno.niv, h)))
      .sort((a, b) => a.media - b.media);
  }

  return { sortearRodada, pacote, pergunta, grupos, nomeDe, TAMANHO_PACOTE, PACOTES_POR_RODADA, REVISAO_POR_PACOTE };
})();
