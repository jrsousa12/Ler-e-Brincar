// Peças comuns dos motores de ajuste (ajustar-lp, ajustar-mat, ajustar-historia, ajustar-enunciado).
// Cada motor diz o que procurar e o que conferir; aqui fica o que é igual em todos: ler a folha,
// regravar só a linha do item, anotar no registro, o resumo final e a linha de comando.
'use strict';
const fs = require('fs');
const path = require('path');
const escrever = require('./escrever');

// Pasta das folhas e do registro (REVISAO_RAIZ deixa os testes usarem uma pasta de mentira).
const pastaRev = () => process.env.REVISAO_RAIZ || path.join(__dirname, 'revisao');

// Linhas da folha de revisão, sem as vazias e sem os comentários (#).
const lerFolha = (arq) => fs.readFileSync(arq, 'utf8').split('\n').map(t => t.trim()).filter(t => t && !t.startsWith('#'));

// Regrava só a linha do item achado por item.js (mantém a vírgula do fim, se havia).
function regravar(r0) {
  r0.linhas[r0.i] = escrever(r0.item) + (/,\s*$/.test(r0.linhas[r0.i]) ? ',' : '');
  fs.writeFileSync(r0.arquivo, r0.linhas.join('\n'));
}

// Anota no build/revisao/registro.jsonl o que foi gravado, com a data de hoje.
function anotar(registros) {
  if (!registros.length) return;
  const data = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(pastaRev(), { recursive: true });
  fs.appendFileSync(path.join(pastaRev(), 'registro.jsonl'), registros.map(r => JSON.stringify({ data, ...r })).join('\n') + '\n');
}

// Última linha do --aplicar; devolve o código de saída (1 se houve recusado).
function fechar(aceitos, recusados, gravar) {
  console.log(aceitos + ' aceito(s), ' + recusados + ' recusado(s)' + (gravar ? (recusados ? ' · nada gravado: corrija os recusados' : ' · gravado e anotado em build/revisao/registro.jsonl. Agora: node build/validar.js') : ' (prévia; use --gravar)'));
  return recusados ? 1 : 0;
}

// Linha de comando igual em todos: [ids] [--folha arq] ou --aplicar <folha> [--gravar].
function principalAjuste(argv, { folha, aplicar, montarFolha }) {
  const args = [...argv];
  const iF = args.indexOf('--folha');
  const arqFolha = iF >= 0 ? args.splice(iF, 2)[1] : path.join(pastaRev(), folha);
  const iA = args.indexOf('--aplicar');
  if (iA >= 0) { const arq = args[iA + 1]; if (!arq) { console.log('Diga a folha: --aplicar <folha.txt>'); return 1; } return aplicar(arq, args.includes('--gravar')); }
  return montarFolha(args.filter(a => !a.startsWith('--')), arqFolha);
}

module.exports = { pastaRev, lerFolha, regravar, anotar, fechar, principalAjuste };
