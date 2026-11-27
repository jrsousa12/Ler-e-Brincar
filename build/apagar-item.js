// Apaga itens inteiros de um banco de conteúdo pelo id (sem imprimir o conteúdo).
// Uso: node build/apagar-item.js <banco: colorir|lp|mat|...> id1 id2 ...
const fs = require('fs');
const [banco, ...ids] = process.argv.slice(2);
if (!banco || !ids.length) { console.log('Uso: node build/apagar-item.js <banco> <id>...'); process.exit(1); }
const arq = 'conteudo/' + banco + '.js';
const linhas = fs.readFileSync(arq, 'utf8').split('\n');
const tem = (l, id) => l.startsWith("{id:'" + id + "'");
const sobra = linhas.filter(l => !ids.some(id => tem(l, id)));
// o último item do arquivo não leva vírgula no fim
let ult = -1;
sobra.forEach((l, i) => { if (l.startsWith("{id:'")) ult = i; });
if (ult >= 0) sobra[ult] = sobra[ult].replace(/,\s*$/, '');
fs.writeFileSync(arq, sobra.join('\n'));
console.log('Apagadas ' + (linhas.length - sobra.length) + ' linha(s) de ' + arq);
