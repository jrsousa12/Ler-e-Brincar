// Ajudante comum dos testes que abrem o app no navegador (Playwright, Chromium já instalado).
// novaPagina(): abre o navegador numa tela de celular e guarda os erros da página em "erros".
// abrirApp(p): carrega o index.html e espera o primeiro cartão aparecer.
'use strict';
const path = require('path');
const { chromium } = require('playwright');

const INDEX = 'file://' + path.join(__dirname, '..', 'index.html');

// altura: tela mais baixa para testar rolagem (padrão: celular comum, 390 × 844).
async function novaPagina({ altura = 844 } = {}) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: altura } });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  return { b, p, erros };
}

async function abrirApp(p) {
  await p.goto(INDEX);
  await p.waitForSelector('.card', { timeout: 5000 }).catch(() => {});
}

module.exports = { INDEX, novaPagina, abrirApp };
