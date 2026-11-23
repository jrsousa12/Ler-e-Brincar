// Teste guardado: gerador de Matemática (build/gerar-mat.js). Uso: node testes/t_gerar_mat.js
// Trabalha numa CÓPIA do conteúdo (CONTEUDO_RAIZ); o conteudo/ real não é tocado.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..');
const g = require(path.join(raiz, 'build/gerar-mat.js'));
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

// 1. Montar: conta, opções com erros típicos, figuras, BNCC, nível
const sub = g.montar('42 - 15 | 🎈');
ok(sub.correta === 27 && sub.enunciado === 'Quanto é 42 − 15?', 'hífen vira sinal de menos e a conta fica certa');
ok(sub.opcoes.includes(33), '42 − 15: erro típico "tirar o menor do maior" (33) entre as opções');
ok(sub.opcoes.length === 3 && new Set(sub.opcoes).size === 3, 'sempre 3 opções diferentes');
ok(sub.nivel === 3 && sub.habilidadeBNCC === 'EF02MA05', 'nível 3 e fato básico');
ok(sub.explicacao.startsWith('42 − 15 = 27. Tire primeiro 10 (fica 32)'), 'explicação por dezenas');
const soma = g.montar('27 + 15 | ⭐');
ok(soma.opcoes.includes(32), '27 + 15: erro típico "esqueceu o vai um" (32)');
const mult = g.montar('3 x 4 | 🍪');
ok(mult.correta === 12 && mult.apoioVisual.esquerda === '🍪🍪🍪🍪 🍪🍪🍪🍪 🍪🍪🍪🍪', 'multiplicação em grupos');
ok(mult.habilidadeBNCC === 'EF03MA03' && mult.nivel >= 2, 'multiplicação: EF03MA03, nível 2 ou mais');
const din = g.montar('10 − 4 | 🪙 | Caio tinha R$ 10 e gastou R$ 4. Quanto sobrou? | Sobraram R$ 6.');
ok(din.habilidadeBNCC === 'EF02MA20' && din.explicacao === '10 − 4 = 6. Sobraram R$ 6.', 'dinheiro: EF02MA20 e frase dada');
ok(g.montar('9 − 2 | 🐟 | Havia 9 peixes e 2 foram embora. Quantos ficaram?').habilidadeBNCC === 'EF02MA07', 'retirar: EF02MA07');
ok(g.montar('6 + 3 | 🐞 | titulo=Joaninhas | nivel=2').titulo === 'Joaninhas', 'chave=valor muda o título');
const esc = g.montar('? Qual número vem depois do 49? | 48 | *50 | 59 | Depois do 49 vem o 50. | bncc=EF02MA05');
ok(esc.tipo === 'multipla' && esc.correta === 1 && esc.opcoes[1] === '50' && esc.titulo === 'Pense e escolha', 'questão de escolha com *');
ok(g.montar('? Uma bala custa 2 reais. Com 5 reais, sobra troco? | *Sim | Não | Falta dinheiro | Sobram 3 reais.').habilidadeBNCC === 'EF02MA20', 'escolha com dinheiro: EF02MA20 sozinho');
for (const ruim of ['? Sem bncc? | *1 | 2 | 3 | x', '? Sem certa | 1 | 2 | 3 | x | bncc=EF02MA05', '? Sem explicação | *1 | 2 | 3 | bncc=EF02MA05', '7 ÷ 2 | 🍎', '3 − 8 | 🍎', 'oito menos três | 🍎', '5 + 2']) {
  let erro = ''; try { g.montar(ruim); } catch (e) { erro = e.message; }
  ok(erro, 'deveria recusar: ' + ruim);
}

// 2. Gravar numa cópia e passar no validador
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-mat-'));
for (const f of fs.readdirSync(path.join(raiz, 'conteudo'))) fs.copyFileSync(path.join(raiz, 'conteudo', f), path.join(tmp, f));
const pedido = path.join(tmp, 'pedido.txt');
fs.writeFileSync(pedido, '# teste\n7 + 5 | 🐸\n12 ÷ 3 | 🍓 | Lia repartiu 12 morangos em 3 pratos. Quantos em cada prato?\n42 − 15 | 🎈\n? Qual número vem antes do 30? | *29 | 31 | 20 | Antes do 30 vem o 29. | bncc=EF02MA05\n');
const env = { ...process.env, CONTEUDO_RAIZ: tmp };
const rodar = (args) => {
  try { return { cod: 0, saida: execFileSync('node', [path.join(raiz, 'build/gerar-mat.js'), ...args], { env }).toString() }; }
  catch (e) { return { cod: e.status, saida: e.stdout.toString() }; }
};
const antes = fs.readFileSync(path.join(tmp, 'mat.js'), 'utf8');
ok(rodar([pedido]).cod === 0 && fs.readFileSync(path.join(tmp, 'mat.js'), 'utf8') === antes, 'sem --gravar não muda nada');
const r = rodar([pedido, '--gravar']);
ok(r.cod === 0 && r.saida.includes('4 atividade(s)'), 'grava 4 atividades');
const depois = fs.readFileSync(path.join(tmp, 'mat.js'), 'utf8');
ok(depois.startsWith(antes.slice(0, antes.lastIndexOf('}') + 1)), 'o conteúdo antigo fica igual');
let v; try { v = execFileSync('node', [path.join(raiz, 'build/validar.js')], { env }).toString(); } catch (e) { v = 'FALHOU ' + e.stdout; }
ok(v.includes('OK'), 'validador aceita o que foi gravado: ' + v.trim().split('\n').pop());
ok(rodar([pedido, '--gravar']).cod === 1, 'gravar de novo recusa (já existe)');
fs.rmSync(tmp, { recursive: true });

console.log(falhas ? `t_gerar_mat: ${falhas} falha(s)` : 't_gerar_mat: OK');
process.exit(falhas ? 1 : 0);
