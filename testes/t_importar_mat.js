// Teste guardado: importador de Matemática (build/importar-mat.js). Uso: node testes/t_importar_mat.js
// Trabalha em pasta temporária; o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');
const im = require(path.join(raiz, 'build/importar-mat.js'));
const g = require(path.join(raiz, 'build/gerar-mat.js'));
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const conta = { id: 1, conta: '11 - 4', resposta: 7, emoji: '🐟', enunciado: 'No aquário havia 11 peixes. Vovô levou 4. Quantos ficaram?', fraseFinal: 'Ficaram 7 peixes.' };
const escolha = { id: 2, enunciado: 'Qual número vem depois do 49?', opcoes: ['48', '50', '59'], correta: 1, explicacao: 'Depois do 49 vem o 50.', bncc: 'EF02MA01', emoji: '🔢', tiposErradas: ['trocou_ideia', 'dez_a_mais'] };
const com = (base, mudar) => Object.assign({}, base, mudar);
const tem = (item, trecho, serie = 2) => im.conferirItem(item, serie).some(p => p.includes(trecho));

// 1. Itens bons: linha certa e nenhum problema
ok(im.linhaDe(conta, {}) === '11 - 4 | 🐟 | No aquário havia 11 peixes. Vovô levou 4. Quantos ficaram? | Ficaram 7 peixes.', 'conta vira linha do gerar-mat');
ok(im.linhaDe(escolha, {}) === '? Qual número vem depois do 49? | 48 | *50 | 59 | Depois do 49 vem o 50. | bncc=EF02MA01 | emoji=🔢', 'escolha vira linha com * e bncc');
ok(im.linhaDe(conta, { titulo: 'Aquário', nivel: '2' }).endsWith('| titulo=Aquário | nivel=2'), '--titulo e --nivel vão para a linha');
ok(im.conferirItem(conta, 2).length === 0 && im.conferirItem(escolha, 2).length === 0, 'itens bons passam sem aviso');
ok(g.montar(im.linhaDe(escolha, {})).correta === 1, 'a linha da escolha é aceita pelo gerador');

// 2. Conta: resposta errada, número grande, enunciado sem número ou sem pergunta, frase sem resultado
ok(tem(com(conta, { resposta: 8 }), 'dá 7'), 'resposta errada da outra IA é pega');
ok(tem(com(conta, { conta: '150 - 40', resposta: 110, enunciado: 'Havia 150 peixes e 40 saíram. Quantos ficaram?', fraseFinal: 'Ficaram 110.' }), 'passa de 100'), 'número acima do 2º ano');
ok(!tem(com(conta, { conta: '150 - 40', resposta: 110, enunciado: 'Havia 150 peixes e 40 saíram. Quantos ficaram?', fraseFinal: 'Ficaram 110.' }), 'passa de', 3), 'no 3º ano vai até 1000');
ok(tem(com(conta, { enunciado: 'No aquário havia onze peixes. Vovô levou 4. Quantos ficaram?' }), 'número 11'), 'número por extenso é pego');
ok(tem(com(conta, { enunciado: 'No aquário havia 11 peixes. Vovô levou 4.' }), 'pergunta'), 'enunciado sem "?"');
ok(tem(com(conta, { fraseFinal: 'Ficaram poucos peixes.' }), 'resultado 7'), 'frase final sem o resultado');

// 3. Escolha: BNCC, explicação, erradas longe, tipos
ok(tem(com(escolha, { bncc: 'EF02LP01' }), 'não é um código'), 'BNCC de Português recusada');
ok(tem(com(escolha, { explicacao: 'Conte para a frente.' }), 'resposta certa'), 'explicação sem a certa');
ok(tem(com(escolha, { opcoes: ['48', '50', '90'] }), 'longe demais'), 'errada absurda');
ok(tem(com(escolha, { opcoes: ['48', '50', 'cinquenta e um'] }), 'também deve ser'), 'errada não numérica');
ok(tem(com(escolha, { opcoes: ['49', '50', '51'] }), 'no meio'), 'certa no meio (49, 50, 51)');
ok(tem(com(escolha, { tiposErradas: ['perto', 'perto'] }), 'tipos diferentes'), 'tipos iguais');
ok(tem(com(escolha, { tiposErradas: ['perto', 'chute'] }), 'não existe'), 'tipo inventado');
ok(tem(com(escolha, { tiposErradas: undefined }), 'falta "tiposErradas"'), 'sem tipos');

// 4. Erros que impedem a linha
for (const [ruim, msg] of [[com(conta, { conta: 'onze menos quatro' }), 'conta em palavras'], [com(conta, { conta: '7 / 2', resposta: 3.5 }), 'divisão não exata'],
  [com(escolha, { correta: 3 }), 'correta fora'], [com(escolha, { bncc: '' }), 'sem bncc'], [com(escolha, { explicacao: 'nivel=3' }), 'campo com "palavra="']]) {
  let erro = ''; try { im.linhaDe(ruim, {}); } catch (e) { erro = e.message; }
  ok(erro, 'deveria recusar: ' + msg);
}

// 5. Pelo comando: lote com problema não grava e faz a conferência; lote bom vira pedido
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-imat-'));
const rodar = (arq, ...a) => { try { return { cod: 0, saida: execFileSync('node', [path.join(raiz, 'build/importar-mat.js'), arq, ...a], { encoding: 'utf8' }) }; } catch (e) { return { cod: e.status, saida: String(e.stdout) }; } };
const ruim = path.join(tmp, 'mat-ruim.json');
fs.writeFileSync(ruim, JSON.stringify([conta, com(escolha, { id: 3, opcoes: ['48', '50', '90'] })]));
let r = rodar(ruim);
ok(r.cod === 1 && fs.existsSync(path.join(tmp, 'mat-ruim-conferencia.txt')) && !fs.existsSync(path.join(tmp, 'mat-ruim.txt')), 'lote com problema: conferência e nada gravado');
ok(fs.readFileSync(path.join(tmp, 'mat-ruim-conferencia.txt'), 'utf8').includes('Questão 3'), 'conferência aponta a questão');
r = rodar(ruim, '--aceitar');
ok(r.cod === 0 && fs.existsSync(path.join(tmp, 'mat-ruim.txt')), '--aceitar importa mesmo assim');
const bom = path.join(tmp, 'mat-bom.json');
fs.writeFileSync(bom, JSON.stringify([conta, escolha]));
r = rodar(bom);
const pedido = fs.readFileSync(path.join(tmp, 'mat-bom.txt'), 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
ok(r.cod === 0 && pedido.length === 2, 'lote bom vira pedido com 2 linhas');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(falhas ? falhas + ' falha(s) no importador de Matemática' : 'Importador de Matemática: tudo certo');
process.exit(falhas ? 1 : 0);
