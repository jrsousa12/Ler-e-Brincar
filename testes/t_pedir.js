// Teste guardado: motor de pedidos para outra IA (build/pedir.js + build/pedir-dados.js). Uso: node testes/t_pedir.js
// Confere: cada tipo monta o texto sem colchete sobrando, escolhe tema/níveis, avisa erros, e os EXEMPLOS
// dos roteiros passam nos geradores (se a outra IA copiar o molde, o motor aceita). Nada real é gravado.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const copia = require('./_gerador');
const raiz = path.join(__dirname, '..');
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('FALHA: ' + msg); } };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-pedir-'));
const pedidos = path.join(tmp, 'pedidos');
fs.mkdirSync(pedidos);
fs.writeFileSync(path.join(pedidos, 'silabas-lote1.txt'), '');
const env = { ...process.env, PREVIAS_RAIZ: tmp, PEDIDOS_RAIZ: pedidos };
const rodar = args => {
  try { return { cod: 0, saida: execFileSync('node', [path.join(raiz, 'build/pedir.js'), ...args], { env }).toString() }; }
  catch (e) { return { cod: e.status, saida: e.stdout.toString() }; }
};
const texto = tipo => fs.readFileSync(path.join(tmp, 'pedido-' + tipo + '.txt'), 'utf8');

// Cada tipo monta o texto, sem colchete sobrando e com a quantidade
for (const tipo of ['lp', 'mat', 'silabas', 'ordem', 'historia', 'ideia']) {
  const r = rodar([tipo, '--qtd', '7']);
  ok(r.cod === 0, tipo + ' roda: ' + r.saida.trim().split('\n')[0]);
  if (r.cod !== 0) continue;
  const t = texto(tipo);
  ok(!/\[[A-ZÀ-Ú][^\]\n]*\]/.test(t), tipo + ': sem colchete sobrando');
  ok(t.includes(' 7 '), tipo + ': pede 7 itens');
  ok(!t.includes('INÍCIO') && !t.includes('Como usar'), tipo + ': só o trecho para colar');
  ok(r.saida.includes('salvar em ') && r.saida.includes('Depois 1:'), tipo + ': diz onde salvar a resposta');
}
ok(texto('silabas').includes('BOLA,'), 'silabas: manda as palavras que já existem');
ok(rodar(['silabas']).saida.includes('silabas-lote2.txt'), 'silabas: próximo lote livre (já existe lote1)');
ok(texto('ordem').includes('- Preparando o café da manhã'), 'ordem: manda os títulos que já existem');
ok(texto('ideia').includes('Mercadinho') && texto('ideia').includes('Monte a Palavra'), 'ideia: lista as brincadeiras do app');
ok(rodar(['ideia', '--materia', 'lp']).cod === 0 && texto('ideia').includes('de Língua Portuguesa'), 'ideia: --materia lp');

// lp/mat: tema e série
const m3 = rodar(['mat', '--serie', '3']);
ok(m3.saida.includes('--serie 3') && texto('mat').includes('3º ano'), 'mat --serie 3 vai para o texto e para o comando');
const lp = rodar(['lp', '--bncc', 'EF15LP03']);
ok(lp.saida.includes('--bncc EF15LP03') && texto('lp').includes('localizar informações'), 'lp --bncc escolhe o tema');
ok(rodar(['lp', '--tema', 'rimas', '--lote', 'teste']).saida.includes('lp-teste.json') && texto('lp').includes('Tema do lote: rimas'), '--tema e --lote');

// Erros
ok(rodar(['xx']).cod === 1, 'tipo desconhecido recusa');
ok(rodar(['mat', '--serie', '4']).cod === 1, 'série 4 recusa');
ok(rodar(['lp', '--bncc', 'EF99LP99']).saida.includes('Erro'), 'código fora da ficha recusa');

// Divisão dos níveis soma a quantidade e dá mais ao nível com menos itens
const D = require('../build/pedir-dados');
const rep = D.repartir(15, { 1: 13, 2: 12, 3: 15 });
ok(rep.reduce((s, x) => s + x.qtd, 0) === 15 && rep[0].nivel === 2, 'repartir: soma 15 e começa pelo nível 2');

// Os exemplos dos roteiros passam nos geradores
const roteiro = arq => fs.readFileSync(path.join(raiz, 'build/roteiros', arq), 'utf8');
const exemplos = {
  'build/gerar-silabas.js': roteiro('lote-silabas.md').split('\n').filter(l => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]+(-[A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)+ \| /.test(l)),
  'build/gerar-ordem.js': roteiro('lote-ordem.md').split('\n').filter(l => /^[A-ZÀ-Ú][^|]* \| .* \| .* \| /.test(l)),
  'build/gerar-historia.js': (roteiro('lote-historia.md').match(/^= [\s\S]*?\n\n/m) || [''])[0].replace(/\[NÍVEL\]/g, '3').trim().split('\n')
};
for (const [motor, linhas] of Object.entries(exemplos)) {
  const c = copia(motor);
  const r = c.rodar([c.pedido(linhas.join('\n') + '\n')]);
  ok(linhas.length >= 2 && r.cod === 0, 'exemplo do roteiro passa em ' + motor + ': ' + r.saida.trim().split('\n').pop());
  c.apagar();
}

fs.rmSync(tmp, { recursive: true });
console.log(falhas ? falhas + ' falha(s)' : 'OK: pedidos para outra IA conferidos');
process.exitCode = falhas ? 1 : 0;
