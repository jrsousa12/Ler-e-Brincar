// Guarda o progresso da criança no aparelho (IndexedDB via Dexie; reserva: localStorage).
(function () {
  'use strict';
  let db = null;
  if (typeof Dexie !== 'undefined') {
    try {
      db = new Dexie('LerBrincarDB');
      db.version(1).stores({ estado: 'chave' });
      db.version(2).stores({ estado: 'chave', tentativas: '++n, id, data' });
    } catch (e) { console.warn('Dexie falhou:', e); db = null; }
  }

  async function carregarEstado() {
    try {
      if (db) {
        const r = await db.estado.get('main');
        if (r) return r;
      }
      const ls = localStorage.getItem('lb-estado');
      if (ls) return JSON.parse(ls);
    } catch (e) { console.warn(e); }
    return null;
  }

  // Guarda uma cópia simples: o IndexedDB recusa os objetos "vigiados" do Vue (DataCloneError),
  // e sem a cópia nada era guardado. Se o IndexedDB falhar, guarda no localStorage. Teste: t_ondeparou.
  async function salvarEstado(est) {
    let copia;
    try { copia = JSON.parse(JSON.stringify(est)); } catch (e) { console.warn(e); return; }
    try {
      if (db) { await db.estado.put({ chave: 'main', ...copia }); return; }
    } catch (e) { console.warn(e); }
    try { localStorage.setItem('lb-estado', JSON.stringify(copia)); } catch (e) { console.warn(e); }
  }

  // Pede ao navegador para não apagar os dados quando faltar espaço (Android).
  // Devolve true (guarda garantida), false (negada) ou null (sem suporte).
  async function pedirGuarda(nav) {
    nav = nav || (typeof navigator !== 'undefined' ? navigator : null);
    try {
      const sg = nav && nav.storage;
      if (!sg || !sg.persist) return null;
      if (sg.persisted && await sg.persisted()) return true;
      return !!(await sg.persist());
    } catch (e) { return null; }
  }

  LB.banco = { carregarEstado, salvarEstado, pedirGuarda, db };
})();
