// Nível que se ajusta sozinho (Fase 13): um nível por habilidade da BNCC.
// Olha as últimas 5 respostas de primeira: 4 acertos sobe um nível; 2 erros seguidos desce um.
// Os níveis possíveis de cada habilidade são os que existem no conteúdo (LB.CONTEUDO.activities).
// Estado (no caderno, campo niv): { habilidade: { n: nível, u: 'CCE' } } (u = últimas; C = certa, E = errada).
// Funções puras: recebem o estado e devolvem um novo.
(function () {
  'use strict';
  const JANELA = 5, SOBE_COM = 4, DESCE_COM = 2;
  let faixas = null; // { habilidade: [níveis que existem, em ordem] }

  function faixa(h) {
    if (!faixas) {
      if (!LB.CONTEUDO) return null; // conteúdo ainda não carregado: não guarda a lista vazia
      faixas = {};
      for (const a of LB.CONTEUDO.activities || []) {
        if (!a.habilidadeBNCC) continue;
        const f = faixas[a.habilidadeBNCC] || (faixas[a.habilidadeBNCC] = []);
        if (!f.includes(a.nivel || 1)) f.push(a.nivel || 1);
      }
      Object.values(faixas).forEach(f => f.sort((x, y) => x - y));
    }
    return faixas[h] || null;
  }

  // Nível atual da habilidade (sem dados: o menor que existe; habilidade sem atividades: null).
  function de(niv, h) {
    const f = faixa(h);
    if (!f) return null;
    const d = niv && niv[h];
    return d && f.includes(d.n) ? d.n : f[0];
  }

  function registrar(niv, h, deprimeira) {
    const f = faixa(h);
    if (!f) return { ...niv };
    const atual = de(niv, h), i = f.indexOf(atual);
    const u = (((niv && niv[h] && niv[h].u) || '') + (deprimeira ? 'C' : 'E')).slice(-JANELA);
    const acertos = [...u].filter(x => x === 'C').length;
    let n = atual, fica = u;
    if (acertos >= SOBE_COM && i < f.length - 1) { n = f[i + 1]; fica = ''; }
    else if (u.endsWith('E'.repeat(DESCE_COM)) && i > 0) { n = f[i - 1]; fica = ''; }
    return { ...niv, [h]: { n, u: fica } };
  }

  const subiu = (antes, depois, h) => (de(depois, h) || 0) > (de(antes, h) || 0);

  // Linhas do painel do adulto: só as habilidades já respondidas.
  const painel = niv => Object.keys(niv || {}).filter(faixa).sort().map(h => ({
    habilidade: h, nome: LB.nomeHabilidade ? LB.nomeHabilidade(h) : h, nivel: de(niv, h),
    menor: faixa(h)[0], maior: faixa(h)[faixa(h).length - 1], ultimas: [...niv[h].u].map(x => x === 'C' ? '✔' : '✘').join(' ')
  }));

  const recarregar = () => { faixas = null; }; // para os testes trocarem o conteúdo
  LB.nivel = { de, registrar, subiu, faixa, painel, recarregar, JANELA, SOBE_COM, DESCE_COM };
})();
