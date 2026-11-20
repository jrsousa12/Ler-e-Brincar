// Teste guardado: voz (js/voz.js). Uso: node testes/t_voz.js
// Simula um aparelho com várias vozes e confere: escolhe a mais natural em pt-BR,
// corta o texto em frases e troca sinais por palavras.
'use strict';
const path = require('path');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const faladas = [];
const vozes = [
  { name: 'English US', lang: 'en-US', default: true },
  { name: 'Português (Portugal)', lang: 'pt-PT' },
  { name: 'eSpeak Portuguese', lang: 'pt-BR' },
  { name: 'Google português do Brasil', lang: 'pt-BR' },
  { name: 'Português Brasil', lang: 'pt_BR' }
];
globalThis.window = globalThis;
globalThis.speechSynthesis = {
  getVoices: () => vozes, addEventListener() {},
  cancel() { faladas.length = 0; }, speak(u) { faladas.push(u); }
};
globalThis.SpeechSynthesisUtterance = function (t) { this.text = t; };
globalThis.LB = {};
require(path.join(__dirname, '..', 'js/voz.js'));
const voz = LB.voz;

ok(voz.vozEscolhida() === 'Google português do Brasil', 'devia escolher a voz do Google, veio: ' + voz.vozEscolhida());
ok(voz.nota({ name: 'x', lang: 'en-US' }) < 0, 'voz em inglês não pode entrar');
ok(voz.nota({ name: 'Luciana', lang: 'pt-PT' }) < voz.nota({ name: 'Luciana', lang: 'pt-BR' }), 'pt-BR vale mais que pt-PT');

voz.falar('Qual é a cor do céu? 🌤️ Azul. Vermelho! Verde.');
ok(faladas.length === 4, 'devia virar 4 falas, virou ' + faladas.length);
ok(faladas[0].text === 'Qual é a cor do céu?', 'primeira frase errada: ' + (faladas[0] || {}).text);
ok(faladas.every(u => u.voice && u.voice.name.startsWith('Google') && u.lang === 'pt-BR'), 'todas as falas usam a voz escolhida');

voz.falar('Outra coisa.');
ok(faladas.length === 1, 'falar de novo deve parar a fala anterior');

ok(voz.limpar('3 + 4 = 7') === '3 mais 4 é igual a 7', 'sinais viram palavras');
ok(voz.frases('Tem 2,5 kg. Certo?').length === 2, 'vírgula de número não corta a frase');

console.log(falhas ? `t_voz: ${falhas} falha(s)` : 't_voz: OK');
process.exit(falhas ? 1 : 0);
