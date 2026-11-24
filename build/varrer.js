#!/usr/bin/env node
// Motor 9: varredura do código. Procura problemas de espaços, sintaxe (JSON e CSS), possíveis
// erros, riscos de segurança e sobras (código que ninguém usa: build/varrer-sobras.js).
// Mostra um resumo curto; a lista completa vai para build/previas/varredura.txt (fora do git).
// Uso: node build/varrer.js             -> só mostra
//      node build/varrer.js --corrigir  -> arruma os espaços (não muda o que o código faz)
//      node build/varrer.js --estrito   -> falha se sobrar qualquer aviso
//      node build/varrer.js js/app.js   -> só os arquivos indicados
// Regras: build/varrer-regras.js. Pastas, nomes e avisos aceitos: build/fichas/varrer.json.
// Os códigos "graves" da ficha fazem a varredura falhar sempre (quebram o app).
'use strict';
const fs = require('fs');
const path = require('path');
const { analisar, corrigirEspacos } = require('./varrer-regras');
const { sobras } = require('./varrer-sobras');

const RAIZ = path.join(__dirname, '..');
const FICHA = JSON.parse(fs.readFileSync(path.join(__dirname, 'fichas/varrer.json'), 'utf8'));
const RELATORIO = path.join(RAIZ, 'build/previas/varredura.txt');
const ESPACOS = ['espaco_no_fim', 'tabulacao', 'linhas_em_branco', 'sem_quebra_final', 'quebra_windows'];

const posix = (p) => p.split(path.sep).join('/');
const foraDaLista = (rel, ficha) => ficha.fora.some((f) => rel === f || rel.startsWith(f));

// Lista os arquivos das pastas da ficha (com subpastas) que têm uma das extensões.
function listar(raiz = RAIZ, ficha = FICHA) {
  const saida = [];
  const andar = (rel) => {
    const abs = path.join(raiz, rel);
    if (!fs.existsSync(abs) || foraDaLista(rel + '/', ficha) || foraDaLista(rel, ficha)) return;
    if (fs.statSync(abs).isFile()) {
      if (ficha.extensoes.includes(path.extname(rel))) saida.push(rel);
      return;
    }
    for (const e of fs.readdirSync(abs).sort()) andar(posix(path.join(rel, e)));
  };
  ficha.pastas.forEach(andar);
  return saida;
}

// Um aviso aceito na ficha: pelo código no arquivo todo ou só numa linha ("codigo@12").
// Uma chave terminada em "/" vale para a pasta inteira ("build/": ["codigo_dinamico"]); "*" aceita tudo.
function aceito(rel, a, ficha) {
  const lista = Object.keys(ficha.aceitos).filter((k) => k === rel || (k.endsWith('/') && rel.startsWith(k)))
    .flatMap((k) => ficha.aceitos[k]);
  return lista.includes('*') || lista.includes(a.codigo) || lista.includes(`${a.codigo}@${a.linha}`);
}

// Varre os arquivos e devolve { avisos, corrigidos }. Com corrigir=true, regrava os espaços.
function varrer(arquivos, { raiz = RAIZ, ficha = FICHA, corrigir = false } = {}) {
  const existe = (rel) => fs.existsSync(path.join(raiz, rel)) && fs.statSync(path.join(raiz, rel)).isFile();
  const avisos = [];
  let corrigidos = 0;
  for (const rel of arquivos) {
    const abs = path.join(raiz, rel);
    let texto = fs.readFileSync(abs, 'utf8');
    if (corrigir) {
      const novo = corrigirEspacos(texto);
      if (novo !== texto) { fs.writeFileSync(abs, novo); texto = novo; corrigidos++; }
    }
    for (const a of analisar(rel, texto, existe)) if (!aceito(rel, a, ficha)) avisos.push({ rel, ...a });
  }
  return { avisos, corrigidos };
}

// Sobras (função, variável, classe de CSS e animação sem uso): olha o projeto todo de uma vez.
// O conteúdo (conteudo/) entra só como lugar onde uma classe pode ser usada.
function varrerSobras(arquivos, { raiz = RAIZ, ficha = FICHA } = {}) {
  const ler = (rel) => fs.readFileSync(path.join(raiz, rel), 'utf8');
  const codigo = arquivos.filter((rel) => /\.(js|css|html)$/.test(rel)).map((rel) => ({ rel, texto: ler(rel) }));
  const pasta = path.join(raiz, 'conteudo');
  const extras = fs.existsSync(pasta) ? fs.readdirSync(pasta).map((f) => ler('conteudo/' + f)) : [];
  return sobras(codigo, extras).filter((a) => !aceito(a.rel, a, ficha));
}

// Resumo curto por código: "  3  igualdade_fraca  comparação com == ... (js/a.js:4, ...)".
function resumir(avisos, ficha = FICHA) {
  const por = new Map();
  for (const a of avisos) por.set(a.codigo, [...(por.get(a.codigo) || []), a]);
  return [...por.entries()].sort((x, y) => y[1].length - x[1].length).map(([cod, lista]) => {
    const onde = lista.slice(0, 3).map((a) => `${a.rel}:${a.linha}`).join(', ') + (lista.length > 3 ? ', ...' : '');
    const grave = ficha.graves.includes(cod) ? ' [GRAVE]' : '';
    return `${String(lista.length).padStart(4)}  ${cod}${grave}: ${ficha.nomes[cod] || cod} (${onde})`;
  });
}

function principal(argv) {
  const corrigir = argv.includes('--corrigir');
  const escolhidos = argv.filter((a) => !a.startsWith('--')).map(posix);
  const arquivos = escolhidos.length ? escolhidos : listar();
  const { avisos, corrigidos } = varrer(arquivos, { corrigir });
  if (!escolhidos.length) avisos.push(...varrerSobras(arquivos));
  fs.mkdirSync(path.dirname(RELATORIO), { recursive: true });
  fs.writeFileSync(RELATORIO, avisos.map((a) => `${a.rel}:${a.linha}  ${a.codigo}  ${FICHA.nomes[a.codigo] || ''}${a.nome ? ' (' + a.nome + ')' : ''}`).join('\n') + '\n');

  if (corrigidos) console.log(`Espaços arrumados em ${corrigidos} arquivo(s).`);
  resumir(avisos).forEach((l) => console.log(l));
  const graves = avisos.filter((a) => FICHA.graves.includes(a.codigo));
  const arrumaveis = avisos.filter((a) => ESPACOS.includes(a.codigo)).length;
  if (arrumaveis && !corrigir) console.log(`Dica: ${arrumaveis} de espaços somem com --corrigir.`);
  if (avisos.length) console.log(`Lista completa: ${posix(path.relative(RAIZ, RELATORIO))}`);
  console.log(`${arquivos.length} arquivo(s), ${avisos.length} aviso(s), ${graves.length} grave(s)`);
  return graves.length || (argv.includes('--estrito') && avisos.length) ? 1 : 0;
}

if (require.main === module) process.exit(principal(process.argv.slice(2)));
module.exports = { listar, varrer, varrerSobras, resumir };
