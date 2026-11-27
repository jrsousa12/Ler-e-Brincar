// Lista única das telas e tamanhos fotografados (usada por build/capturas.js e build/antes-depois.js).
// Cada tela: nome da foto + o que fazer para chegar nela (roda dentro da página).
'use strict';

const TAMANHOS = {
  celular: { width: 390, height: 844 },
  'celular-escuro': { width: 390, height: 844, escuro: true },
  'tablet-deitado': { width: 1280, height: 800 },
  'tablet-em-pe': { width: 800, height: 1280 },
};

// Tamanhos a mais só do antes/depois: cor Creme, letra grande, sem movimento e impressão
const EXTRAS = {
  'celular-creme': { width: 390, height: 844, classes: 'tema-creme' },
  'celular-letra': { width: 390, height: 844, classes: 'tamanho-grande fonte-dislexia reduzir-movimento' },
  'celular-calmo': { width: 390, height: 844, calmo: true },
  impressao: { width: 794, height: 1123, impressao: true },
};

const TELAS = [
  ['01-inicio', () => LB.app.irPara('home')],
  ['02-missao', () => LB.app.irPara('missao')],
  ['03-ler', () => LB.app.irPara('ler')],
  ['04-historia', () => LB.app.abrirHistoria(LB.CONTEUDO.stories[0])],
  ['05-historia-pergunta', () => { LB.app.abrirHistoria(LB.CONTEUDO.stories[0]); LB.app.iniciarPerguntasHistoria(); }],
  ['06-atividades', () => LB.app.irPara('atividades')],
  ['07-atividade', () => LB.app.abrirAtividade(LB.CONTEUDO.activities.find(a => a.id === 'mat-036'))],
  ['08-silabas', () => LB.app.abrirSilabas()],
  ['09-memoria', () => LB.app.abrirMemoria()],
  ['10-som-figura', () => LB.app.abrirSomFigura()],
  ['11-colorir-lista', () => LB.app.irPara('colorir')],
  ['12-colorir', () => LB.app.abrirColorir(LB.CONTEUDO.colorir[0])],
  ['13-selos', () => LB.app.irPara('recompensas')],
  ['14-responsavel', () => { LB.app.tela = 'responsavel'; }],
];

// Telas a mais do antes/depois: respostas, brincadeiras de matemática e janelas
// (clicar() é posto na página pelo motor; o 3º valor é a tela de onde partir)
const TELAS_EXTRAS = [
  ['15-atividade-respondida', () => { clicar('.opcao', 0); setTimeout(() => clicar('.opcao', 1), 60); }, '07-atividade'],
  ['16-silabas-jogada', () => clicar('.bloco-silaba', 0), '08-silabas'],
  ['17-memoria-jogada', () => { clicar('.carta-memoria', 0); clicar('.carta-memoria', 1); }, '09-memoria'],
  ['18-som-figura-jogada', () => clicar('.carta-figura', 0), '10-som-figura'],
  ['19-mercado', () => LB.app.abrirMercado()],
  ['20-mercado-jogada', () => clicar('.dinheiro', 0), '19-mercado'],
  ['21-trem', () => LB.app.abrirTrem()],
  ['22-trem-jogada', () => clicar('.opcoes-trem .bloco-silaba', 0), '21-trem'],
  ['23-ordem', () => LB.app.abrirOrdem()],
  ['24-ordem-jogada', () => clicar('.btn-frase-ordem', 0), '23-ordem'],
  ['25-pacote', () => LB.app.abrirPacote()],
  ['26-pacote-jogada', () => clicar('.opcoes-pacote .bloco-silaba', 0), '25-pacote'],
  ['27-confirmar', () => { LB.app.irPara('home'); LB.app.confirmacao = { titulo: 'Tem certeza?', texto: 'Apagar tudo?', sim: 'Sim', nao: 'Cancelar' }; }],
  ['28-selo-novo', () => { LB.app.confirmacao = null; LB.app.seloNovo = LB.app.selos[0]; }],
  ['29-portao', () => { LB.app.seloNovo = null; LB.app.abrirPortao(); }],
];

module.exports = { TAMANHOS, EXTRAS, TELAS, TELAS_EXTRAS };
