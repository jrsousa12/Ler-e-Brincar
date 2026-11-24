// Importador de Matemática: transforma o lote em JSON enviado pelo dono num pedido do gerar-mat.
// Uso: node build/importar-mat.js <lote.json> [pedido.txt] [--serie 2] [--titulo "Problemas da feira"] [--nivel 2] [--aceitar]
// Cada item do JSON é de um de dois tipos (roteiro: build/roteiros/lote-mat.md):
//   conta:   { conta: "11 - 4", resposta: 7, emoji, enunciado, fraseFinal }
//   escolha: { enunciado, opcoes: [3], correta: índice, explicacao, bncc, emoji?, tiposErradas: [2] }
// Na chegada confere: a conta dá a resposta dita, números do tamanho da série, enunciado com os números
// e a pergunta, frase final com o resultado; nas de escolha, BNCC oficial, explicação com a certa e erradas
// perto da certa e de tipos diferentes. Com problema, não grava e escreve <lote>-conferencia.txt para
// colar na outra IA; --aceitar importa mesmo assim. Depois: node build/gerar-mat.js <pedido.txt> --gravar
'use strict';
const fs = require('fs');
const path = require('path');
const ler = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas', f), 'utf8'));
const ficha = ler('mat.json');
const OFICIAL = ler('bncc.json').oficial;
const LIMITE_ENUNCIADO = ler('qualidade.json').limites.enunciado;
const TIPOS = Object.keys({ ...ficha.nomes_dos_erros, ...ficha.tipos_escolha_extra });
const MAIOR = { 2: 100, 3: 1000 }; // maior número aceito por série
const gerar = require('./gerar-mat.js');
const { simetrica } = require('./ajustar-mat-regras.js');
const { opcao, importarLote } = require('./importar-comum.js');

// Tira o que quebraria a linha do pedido ("|" separa campos)
const limpar = s => String(s == null ? '' : s).replace(/\s+/g, ' ').replace(/\|/g, '/').trim();
const CONTA = { '+': (a, b) => a + b, '-': (a, b) => a - b, 'x': (a, b) => a * b, '/': (a, b) => a / b };
const lerConta = t => {
  const m = limpar(t).replace(/[−–]/g, '-').replace(/[×X*]/g, 'x').replace(/÷/g, '/').match(/^(\d+)\s*([+\-x/])\s*(\d+)$/);
  return m && { a: +m[1], op: m[2], b: +m[3], r: CONTA[m[2]](+m[1], +m[3]) };
};
const temNumero = (texto, n) => new RegExp('(^|[^\\d])' + n + '([^\\d]|$)').test(texto);
const numero = s => (/^\d+$/.test(limpar(s)) ? +limpar(s) : null);
const sem = s => limpar(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Item → linha do pedido do gerar-mat (lança erro se faltar campo)
function linhaDe(item, op) {
  const extra = [];
  if (op.titulo) extra.push('titulo=' + op.titulo);
  if (op.nivel) extra.push('nivel=' + op.nivel);
  let campos;
  if (item.conta != null) {
    if (!lerConta(item.conta)) throw new Error('conta não entendida: "' + item.conta + '" (use, por exemplo, 11 - 4)');
    if (!limpar(item.emoji)) throw new Error('falta o emoji');
    campos = [limpar(item.conta), limpar(item.emoji), limpar(item.enunciado), limpar(item.fraseFinal)];
  } else {
    const { enunciado, opcoes, correta, explicacao, bncc } = item;
    if (!enunciado || !Array.isArray(opcoes) || opcoes.length !== 3) throw new Error('precisa de enunciado e 3 opções (ou de "conta")');
    if (!Number.isInteger(correta) || correta < 0 || correta > 2) throw new Error('correta deve ser 0, 1 ou 2');
    if (!explicacao) throw new Error('falta a explicação');
    if (!bncc) throw new Error('falta o código "bncc"');
    campos = ['? ' + limpar(enunciado), ...opcoes.map((o, i) => (i === correta ? '*' : '') + limpar(o)), limpar(explicacao), 'bncc=' + limpar(bncc)];
    if (limpar(item.emoji)) campos.push('emoji=' + limpar(item.emoji));
  }
  if (campos.some(c => /^[?*]?\s*\w+=/.test(c) && !/^(bncc|emoji)=/.test(c))) throw new Error('um campo começa com "palavra=" (o gerador leria como chave)');
  const linha = [...campos, ...extra].join(' | ');
  gerar.montar(linha); // o próprio gerador confere a conta (negativo, divisão exata) e a BNCC
  return linha;
}

// Problemas do item pelas regras do roteiro (lista vazia = está bom)
function conferirItem(item, serie) {
  const p = [];
  const maior = MAIOR[serie] || MAIOR[3];
  const enun = limpar(item.enunciado);
  if (!enun) p.push('falta o "enunciado"');
  else {
    if (!enun.endsWith('?')) p.push('o enunciado deve terminar com a pergunta (com "?")');
    if (enun.length > LIMITE_ENUNCIADO) p.push('enunciado com ' + enun.length + ' letras; o máximo é ' + LIMITE_ENUNCIADO);
  }
  if (item.conta != null) {
    const c = lerConta(item.conta);
    if (!c) return p;
    if (item.resposta !== c.r) p.push('a conta ' + limpar(item.conta) + ' dá ' + c.r + ', mas "resposta" diz ' + item.resposta);
    for (const n of [c.a, c.b, c.r]) if (n > maior) { p.push('o número ' + n + ' passa de ' + maior + ' (limite do ' + serie + 'º ano)'); break; }
    for (const n of [c.a, c.b]) if (enun && !temNumero(enun, n)) p.push('o enunciado não traz o número ' + n + ' da conta (escreva com algarismos)');
    if (!temNumero(limpar(item.fraseFinal), c.r)) p.push('a "fraseFinal" deve dizer o resultado ' + c.r);
    return p;
  }
  const ops = item.opcoes.map(limpar), certa = ops[item.correta];
  const erradas = ops.filter((o, i) => i !== item.correta);
  if (new Set(ops.map(sem)).size !== 3) p.push('há opções repetidas');
  if (!/^EF0[1-5]MA\d\d$/.test(limpar(item.bncc)) || !OFICIAL[limpar(item.bncc)]) p.push('"bncc" ' + item.bncc + ' não é um código oficial de Matemática do 1º ao 5º ano');
  if (!sem(item.explicacao).includes(sem(certa))) p.push('a explicação deve dizer a resposta certa (' + certa + ')');
  const nc = numero(certa);
  if (nc !== null) {
    for (const e of erradas) {
      const ne = numero(e);
      if (ne === null) p.push('a certa é um número, então a errada "' + e + '" também deve ser');
      else if (Math.abs(ne - nc) > Math.max(10, nc / 2)) p.push('a errada ' + ne + ' está longe demais da certa ' + nc);
    }
    if (simetrica(nc, erradas.map(numero))) p.push('a certa ' + nc + ' fica no meio, à mesma distância das erradas: dá para acertar sem pensar');
    for (const n of [nc, ...erradas.map(numero)]) if (n > maior) { p.push('o número ' + n + ' passa de ' + maior + ' (limite do ' + serie + 'º ano)'); break; }
  }
  const tipos = item.tiposErradas;
  if (!Array.isArray(tipos) || tipos.length !== 2) p.push('falta "tiposErradas" com os 2 tipos das erradas (' + TIPOS.join(', ') + ')');
  else {
    tipos.filter(t => !TIPOS.includes(t)).forEach(t => p.push('tipo "' + t + '" não existe; use: ' + TIPOS.join(', ')));
    if (tipos[0] === tipos[1]) p.push('as duas erradas são do tipo "' + tipos[0] + '": use tipos diferentes');
  }
  return p;
}

function principal(argv) {
  const args = [...argv];
  const aceitar = args.includes('--aceitar');
  const op = { serie: +opcao(args, 'serie') || 2, titulo: opcao(args, 'titulo'), nivel: opcao(args, 'nivel') };
  const [entrada, saida = (entrada || '').replace(/\.json$/, '') + '.txt'] = args.filter(a => !a.startsWith('--'));
  if (!entrada) { console.log('Uso: node build/importar-mat.js <lote.json> [pedido.txt] [--serie 2] [--titulo ...] [--nivel 2] [--aceitar]'); return 1; }
  return importarLote({
    motor: 'importar-mat.js', entrada, saida, aceitar,
    linhaDe: (item) => linhaDe(item, op),
    conferir: (item) => conferirItem(item, op.serie),
    depois: 'node build/gerar-mat.js ' + saida + ' (prévia) e depois com --gravar',
  });
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { linhaDe, conferirItem };
