// Gera os ícones PNG do app (icones/). Uso: node build/icones.js
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const pasta = path.join(__dirname, '..', 'icones');
// margem: fração livre em volta (a versão "máscara" precisa de mais folga)
const svg = (margem, cantos) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" rx="${cantos}" fill="#6C5CE7"/>
<g transform="translate(256 256) scale(${1 - margem * 2}) translate(-256 -256)">
<path d="M96 150 Q176 120 256 160 Q336 120 416 150 V390 Q336 360 256 400 Q176 360 96 390Z" fill="#fff"/>
<path d="M256 160 V400" stroke="#6C5CE7" stroke-width="10" fill="none"/>
<path d="M150 210 Q200 195 235 215 M150 255 Q200 240 235 260 M277 215 Q312 195 362 210 M277 260 Q312 240 362 255" stroke="#A29BFE" stroke-width="14" stroke-linecap="round" fill="none"/>
<path d="M256 40 l24 52 56 6 -42 38 12 56 -50 -28 -50 28 12 -56 -42 -38 56 -6z" fill="#FFD43B" transform="translate(0 6) scale(.78) translate(70 20)"/>
</g></svg>`;
(async () => {
  fs.mkdirSync(pasta, { recursive: true });
  const b = await chromium.launch();
  const gerar = async (nome, tam, margem, cantos) => {
    const p = await b.newPage({ viewport: { width: tam, height: tam } });
    await p.setContent(`<body style="margin:0;background:transparent">${svg(margem, cantos).replace('width="512" height="512"', `width="${tam}" height="${tam}"`)}</body>`);
    await p.screenshot({ path: path.join(pasta, nome), omitBackground: true });
    await p.close();
  };
  await gerar('icone-192.png', 192, 0.04, 110);
  await gerar('icone-512.png', 512, 0.04, 110);
  await gerar('icone-mascara-512.png', 512, 0.14, 0);   // sem cantos: o aparelho recorta
  await b.close();
  console.log('Ícones gerados em icones/');
})();
