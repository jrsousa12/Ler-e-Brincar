// Importador de Português: transforma o lote em JSON enviado pelo dono num pedido do gerar-lp,
// já passado pelo motor de ajuste (certa comprida, palavras fora do texto).
// Uso: node build/importar-lp.js <lote.json> [pedido.txt] [--molde interpretacao] [--titulo "Pistas do texto"] [--nivel 2] [--bncc EF15LP03]
// Cada item do JSON: { textoBase?, enunciado, opcoes: [3], correta: índice, explicacao, categoria? }
// Depois: node build/gerar-lp.js <pedido.txt> (prévia) e --gravar.
'use strict';
const fs = require('fs');
const { ajustarLinha } = require('./ajustar-lp');

// Tira o que quebraria a linha do pedido: "|" separa campos, aspas fecham o texto do "Leia:"
const limpar = s => String(s == null ? '' : s).replace(/\s+/g, ' ').replace(/\|/g, '/').trim();
const semAspas = s => limpar(s).replace(/"/g, "'");

function linhaDe(item, op) {
  const { textoBase, enunciado, opcoes, correta, explicacao } = item;
  if (!enunciado || !Array.isArray(opcoes) || opcoes.length !== 3) throw new Error('precisa de enunciado e 3 opções');
  if (!Number.isInteger(correta) || correta < 0 || correta > 2) throw new Error('correta deve ser 0, 1 ou 2');
  if (!explicacao) throw new Error('falta a explicação');
  const enun = (textoBase ? 'Leia: "' + semAspas(textoBase) + '" ' : '') + limpar(enunciado);
  const ops = opcoes.map((o, i) => (i === correta ? '*' : '') + limpar(o));
  const campos = [op.molde, enun, ...ops, limpar(explicacao)];
  if (campos.some(c => /^\*?\w+=/.test(c))) throw new Error('um campo começa com "palavra=" (o gerador leria como chave)');
  const titulo = op.titulo || limpar(item.categoria);
  if (titulo) campos.push('titulo=' + titulo);
  if (op.nivel) campos.push('nivel=' + op.nivel);
  if (op.bncc) campos.push('bncc=' + op.bncc);
  return campos.join(' | ');
}

function opcao(args, nome) {
  const i = args.indexOf('--' + nome);
  return i >= 0 ? args.splice(i, 2)[1] : '';
}

function principal(argv) {
  const args = [...argv];
  const op = { molde: opcao(args, 'molde') || 'interpretacao', titulo: opcao(args, 'titulo'), nivel: opcao(args, 'nivel'), bncc: opcao(args, 'bncc') };
  const [entrada, saida = (entrada || '').replace(/\.json$/, '') + '.txt'] = args.filter(a => !a.startsWith('--'));
  if (!entrada) { console.log('Uso: node build/importar-lp.js <lote.json> [pedido.txt] [--molde interpretacao] [--titulo ...] [--nivel 2] [--bncc ...]'); return 1; }
  const lista = JSON.parse(fs.readFileSync(entrada, 'utf8'));
  const linhas = ['# Importado de ' + entrada + ' por build/importar-lp.js (' + lista.length + ' itens)'];
  const erros = [], mudados = [], pendentes = [];
  lista.forEach((item, n) => {
    const rot = 'item ' + (item.id != null ? item.id : n + 1);
    try {
      const r = ajustarLinha(linhaDe(item, op));
      if (r.mudou) mudados.push(rot + ': "' + r.antes.slice(0, 60) + '" → "' + r.nova + '"');
      if (r.pendente) pendentes.push(rot + ': ' + r.pendente);
      linhas.push(r.linha);
    } catch (e) { erros.push(rot + ': ' + e.message); }
  });
  mudados.forEach(l => console.log('corrigido ' + l));
  pendentes.forEach(l => console.log('PENDENTE ' + l));
  erros.forEach(l => console.log('ERRO ' + l));
  if (erros.length) { console.log(erros.length + ' erro(s): nada foi gravado.'); return 1; }
  fs.writeFileSync(saida, linhas.join('\n') + '\n');
  console.log(lista.length + ' item(ns) → ' + saida + ' · ' + mudados.length + ' corrigido(s), ' + pendentes.length + ' pendente(s). Agora: node build/gerar-lp.js ' + saida);
  return 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { linhaDe };
