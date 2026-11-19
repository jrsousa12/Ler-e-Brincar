// Cópia de segurança do progresso: monta o arquivo para baixar e confere o arquivo importado.
// Funções puras (testadas em testes/t_backup.js); a tela fica em js/telas/backup.js.
(function () {
  'use strict';
  const MARCA = 'ler-e-brincar';
  const VERSAO = 1;
  const CAMPOS = ['estrelas', 'concluidos', 'ajustes', 'missao', 'diasMissao', 'caderno'];

  function gerar(estado, tentativas, agora) {
    const est = {};
    CAMPOS.forEach(c => { if (estado[c] !== undefined) est[c] = estado[c]; });
    return JSON.stringify({ app: MARCA, versao: VERSAO, data: agora || new Date().toISOString(),
      estado: est, tentativas: tentativas || [] });
  }

  // Devolve { ok, estado, tentativas, data } ou { ok: false, erro } com a frase para o adulto.
  function ler(texto) {
    let d;
    try { d = JSON.parse(texto); } catch (e) { return { ok: false, erro: 'O arquivo não é uma cópia do Ler & Brincar.' }; }
    if (!d || d.app !== MARCA || typeof d.estado !== 'object' || !d.estado) {
      return { ok: false, erro: 'O arquivo não é uma cópia do Ler & Brincar.' };
    }
    if (d.versao > VERSAO) return { ok: false, erro: 'Esta cópia é de uma versão mais nova do app. Atualize o app primeiro.' };
    const e = d.estado;
    if (e.estrelas !== undefined && typeof e.estrelas !== 'number') return { ok: false, erro: 'A cópia está estragada (estrelas).' };
    const estado = {};
    CAMPOS.forEach(c => { if (e[c] !== undefined) estado[c] = e[c]; });
    const tentativas = Array.isArray(d.tentativas) ? d.tentativas.filter(t => t && typeof t === 'object') : [];
    return { ok: true, estado, tentativas, data: d.data || '' };
  }

  const nomeArquivo = (agora) => 'ler-e-brincar-copia-' + (agora || new Date().toISOString()).slice(0, 10) + '.json';

  LB.backup = { gerar, ler, nomeArquivo, CAMPOS };
})();
