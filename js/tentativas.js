// Guarda cada resposta da criança (certa ou errada) para a Área do responsável.
(function () {
  'use strict';
  const CHAVE = 'lb-tentativas';
  const LIMITE = 3000; // só na reserva (localStorage)

  async function registrar(t) {
    const reg = { ...t, data: new Date().toISOString() };
    try {
      const db = LB.banco.db;
      if (db) { await db.tentativas.add(reg); return; }
      const lista = JSON.parse(localStorage.getItem(CHAVE) || '[]');
      lista.push(reg);
      localStorage.setItem(CHAVE, JSON.stringify(lista.slice(-LIMITE)));
    } catch (e) { console.warn(e); }
  }

  async function todas() {
    try {
      const db = LB.banco.db;
      if (db) return await db.tentativas.toArray();
      return JSON.parse(localStorage.getItem(CHAVE) || '[]');
    } catch (e) { console.warn(e); return []; }
  }

  async function apagar() {
    try {
      const db = LB.banco.db;
      if (db) await db.tentativas.clear();
      localStorage.removeItem(CHAVE);
    } catch (e) { console.warn(e); }
  }

  // Troca todas as respostas guardadas por outra lista (usado ao importar uma cópia).
  async function substituir(lista) {
    await apagar();
    const limpas = (lista || []).map(({ n, ...t }) => t);
    try {
      const db = LB.banco.db;
      if (db) { await db.tentativas.bulkAdd(limpas); return; }
      localStorage.setItem(CHAVE, JSON.stringify(limpas.slice(-LIMITE)));
    } catch (e) { console.warn(e); }
  }

  LB.tentativas = { registrar, todas, apagar, substituir };
})();
