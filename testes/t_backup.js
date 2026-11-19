// Teste guardado: cópia de segurança do progresso (js/backup.js).
// Uso: node testes/t_backup.js
'use strict';
const path = require('path');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

globalThis.LB = {};
require(path.join(__dirname, '..', 'js/backup.js'));
const B = LB.backup;

const estado = { estrelas: 12, concluidos: { 'lp-001': true }, ajustes: { som: false }, missao: null,
  diasMissao: ['2026-11-19'], caderno: { itens: {}, hab: {} }, lixo: 'não vai' };
const tent = [{ id: 'lp-001', certa: true, data: '2026-11-19T10:00:00Z' }];
const texto = B.gerar(estado, tent, '2026-11-19T12:00:00Z');
const r = B.ler(texto);
ok(r.ok, 'cópia gerada é lida de volta');
ok(r.estado.estrelas === 12 && r.estado.concluidos['lp-001'] && r.estado.diasMissao[0] === '2026-11-19', 'estado volta igual');
ok(r.estado.lixo === undefined, 'campo estranho fica de fora');
ok(r.tentativas.length === 1 && r.tentativas[0].id === 'lp-001', 'respostas voltam');
ok(r.data === '2026-11-19T12:00:00Z', 'data da cópia');
ok(B.nomeArquivo('2026-11-19T12:00:00Z') === 'ler-e-brincar-copia-2026-11-19.json', 'nome do arquivo com a data');

ok(!B.ler('isto não é json').ok, 'texto qualquer é recusado');
ok(!B.ler(JSON.stringify({ app: 'outro', estado: {} })).ok, 'arquivo de outro app é recusado');
ok(!B.ler(JSON.stringify({ app: 'ler-e-brincar', versao: 99, estado: {} })).ok, 'versão mais nova é recusada');
ok(!B.ler(JSON.stringify({ app: 'ler-e-brincar', versao: 1, estado: { estrelas: 'muitas' } })).ok, 'estrelas estragadas são recusadas');
const semTent = B.ler(JSON.stringify({ app: 'ler-e-brincar', versao: 1, estado: { estrelas: 1 } }));
ok(semTent.ok && semTent.tentativas.length === 0, 'cópia sem respostas é aceita');

console.log(falhas ? `t_backup: ${falhas} falha(s)` : 't_backup: OK');
process.exit(falhas ? 1 : 0);
