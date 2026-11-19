// Caderno de erros e pontos fracos (ideia do app Ondulatória).
// - Errou (ou não acertou de primeira) → a atividade entra no caderno; sai com 2 acertos seguidos de primeira.
// - Cada habilidade da BNCC guarda certas/erradas de primeira; a missão sorteia mais as fracas.
// Funções puras: recebem o caderno { itens, hab } e devolvem um novo (o Vue percebe a troca).
(function () {
  'use strict';
  const SAIR_COM = 2; // acertos seguidos para sair do caderno
  const vazio = () => ({ itens: {}, hab: {} });

  function anotar(caderno, item, deprimeira, data) {
    const c = { itens: { ...(caderno && caderno.itens) }, hab: { ...(caderno && caderno.hab) } };
    const h = item.habilidadeBNCC;
    if (h) {
      const antes = c.hab[h] || { certas: 0, erradas: 0 };
      c.hab[h] = deprimeira ? { ...antes, certas: antes.certas + 1 } : { ...antes, erradas: antes.erradas + 1 };
    }
    const atual = c.itens[item.id];
    if (!deprimeira) c.itens[item.id] = { materia: item.materia, seguidos: 0, desde: (atual && atual.desde) || data };
    else if (atual) {
      if (atual.seguidos + 1 >= SAIR_COM) delete c.itens[item.id];
      else c.itens[item.id] = { ...atual, seguidos: atual.seguidos + 1 };
    }
    return c;
  }

  // Ids a revisar de uma matéria: quem tem menos acertos seguidos e está há mais tempo vem antes.
  function paraRevisar(caderno, materia) {
    const itens = (caderno && caderno.itens) || {};
    return Object.keys(itens).filter(id => itens[id].materia === materia)
      .sort((a, b) => itens[a].seguidos - itens[b].seguidos || String(itens[a].desde).localeCompare(String(itens[b].desde)));
  }

  // Peso de sorteio da habilidade: 1 (sem erro) até 5 (erra sempre). Começa neutro sem dados.
  function peso(caderno, habilidade) {
    const d = caderno && caderno.hab && caderno.hab[habilidade];
    if (!d) return 1;
    return 1 + 4 * (d.erradas / (d.certas + d.erradas + 2));
  }

  const total = caderno => Object.keys((caderno && caderno.itens) || {}).length;

  LB.caderno = { vazio, anotar, paraRevisar, peso, total, SAIR_COM };
})();
