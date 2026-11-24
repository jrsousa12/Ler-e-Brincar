// Peças comuns dos importadores de lote em JSON (importar-lp, importar-mat) e da linha de comando.
// Cada importador só diz como virar uma linha do pedido (linhaDe) e o que conferir (conferir);
// o resto é igual: ler o lote, juntar erros e avisos, fazer a folha de conferência ou gravar.
'use strict';
const fs = require('fs');

// Tira "--nome valor" da lista de argumentos e devolve o valor ('' se não veio).
function opcao(args, nome) {
  const i = args.indexOf('--' + nome);
  return i >= 0 ? args.splice(i, 2)[1] || '' : '';
}

// cfg: { motor, entrada, saida, aceitar, linhaDe(item), conferir(item), notaAceitar, depois }
// Devolve o código de saída (0 = gravou; 1 = nada gravado).
function importarLote(cfg) {
  const lista = JSON.parse(fs.readFileSync(cfg.entrada, 'utf8'));
  const linhas = ['# Importado de ' + cfg.entrada + ' por build/' + cfg.motor + ' (' + lista.length + ' itens)'];
  const erros = [], avisos = [];
  lista.forEach((item, n) => {
    const nome = 'Questão ' + (item.id != null ? item.id : n + 1);
    try { linhas.push(cfg.linhaDe(item)); } catch (e) { erros.push(nome + ': ' + e.message); return; }
    const p = cfg.conferir(item);
    if (p.length) avisos.push(nome + ':\n' + p.map(x => '  - ' + x).join('\n'));
  });
  const problemas = [...erros, ...avisos];
  if (problemas.length && !cfg.aceitar) {
    const folha = cfg.entrada.replace(/\.json$/, '') + '-conferencia.txt';
    fs.writeFileSync(folha, 'Corrija só estas questões, sem mudar as outras, e mande o lote inteiro de novo, em JSON, no mesmo formato:\n\n' + problemas.join('\n\n') + '\n');
    console.log(problemas.length + ' questão(ões) fora do roteiro: nada foi gravado. Cole ' + folha + ' na outra IA (ou use --aceitar).');
    return 1;
  }
  if (erros.length) { erros.forEach(l => console.log('ERRO ' + l)); console.log(erros.length + ' erro(s): nada foi gravado.'); return 1; }
  if (avisos.length) console.log(avisos.length + ' questão(ões) fora do roteiro, importadas com --aceitar' + (cfg.notaAceitar || '') + '.');
  fs.writeFileSync(cfg.saida, linhas.join('\n') + '\n');
  console.log(lista.length + ' item(ns) → ' + cfg.saida + '. Agora: ' + cfg.depois);
  return 0;
}

module.exports = { opcao, importarLote };
