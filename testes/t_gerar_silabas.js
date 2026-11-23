// Teste guardado: gerador da brincadeira "Monte a Palavra" (build/gerar-silabas.js). Uso: node testes/t_gerar_silabas.js
// Trabalha numa CÓPIA do conteúdo (CONTEUDO_RAIZ); o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');
const g = require(path.join(raiz, 'build/gerar-silabas.js'));
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };
const erroDe = l => { try { g.montar(l); return ''; } catch (e) { return e.message; } };

// 1. Montar: palavra, extras por trocas típicas, nível
const bola = g.montar('bo-la | ⚽ | Redonda e pula.');
ok(bola.palavra === 'BOLA' && bola.silabas.join() === 'BO,LA', 'maiúsculas e sílabas');
ok(bola.extras.join() === 'PO,LO' && bola.nivel === 1, 'BO→PO (surda/sonora), LA→LO (vogal), nível 1');
const gal = g.montar('GA-LI-NHA | 🐔 | Bota ovo.');
ok(gal.extras.includes('CA') && gal.extras.includes('NHO') && gal.nivel === 3, 'dígrafo NH: nível 3');
ok(g.montar('BA-NA-NA | 🍌 | Fruta.').nivel === 2, 'três sílabas simples: nível 2');
ok(g.trocaConsoante('NHA') === 'LHA' && g.trocaConsoante('PRA') === 'BRA', 'troca dígrafo e encontro antes da letra sozinha');
ok(g.trocaVogal('QUEI') === null && g.trocaVogal('CHU') === 'CHO', 'U do QU não conta; vogal dobrada recusada');
ok(g.extras(['A', 'BE', 'LHA']).length === 2, 'palavra começando por vogal ainda ganha 2 extras');
ok(g.montar('BO-LA | ⚽ | Dica. | extras=PA,DA | nivel=2').extras.join() === 'PA,DA', 'extras e nível manuais');
// 2. Erros pegos
ok(/hífen/.test(erroDe('BOLA | ⚽ | Dica.')), 'sem hífen é erro');
ok(/entrega/.test(erroDe('BO-LA | ⚽ | A bola pula.')), 'dica que diz a palavra é erro');
ok(/extra igual/.test(erroDe('BO-LA | ⚽ | Dica. | extras=BO,PA')), 'extra igual à certa é erro');

// 3. Gravar numa cópia e validar
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sil-'));
for (const f of fs.readdirSync(path.join(raiz, 'conteudo'))) fs.copyFileSync(path.join(raiz, 'conteudo', f), path.join(tmp, f));
const pedido = path.join(tmp, 'pedido.txt');
fs.writeFileSync(pedido, '# teste\nXI-CA-RA | ☕ | Usamos para tomar café.\nBO-LA | ⚽ | Repetida.\n');
const env = { ...process.env, CONTEUDO_RAIZ: tmp };
const rodar = (...a) => { try { return execFileSync('node', [path.join(raiz, 'build/gerar-silabas.js'), ...a], { env, encoding: 'utf8' }); } catch (e) { return 'FALHOU ' + e.stdout; } };
ok(/FALHOU[\s\S]*já existe: BOLA/.test(rodar(pedido, '--gravar')), 'palavra repetida não grava');
fs.writeFileSync(pedido, 'XI-CA-RA | ☕ | Usamos para tomar café.\n');
const antes = fs.readFileSync(path.join(tmp, 'silabas.js'), 'utf8');
ok(/prévia/.test(rodar(pedido)) && fs.readFileSync(path.join(tmp, 'silabas.js'), 'utf8') === antes, 'prévia não grava');
ok(/Gravado/.test(rodar(pedido, '--gravar')), 'grava');
const val = (() => { try { return execFileSync('node', [path.join(raiz, 'build/validar.js')], { env, encoding: 'utf8' }); } catch (e) { return 'FALHOU ' + e.stdout; } })();
ok(/OK: nenhum erro/.test(val), 'validador aceita o gravado: ' + val.split('\n').slice(-2).join(' '));
fs.rmSync(tmp, { recursive: true });

console.log(falhas ? `t_gerar_silabas: ${falhas} falha(s)` : 't_gerar_silabas: OK');
process.exit(falhas ? 1 : 0);
