// Guarda o app no aparelho para funcionar sem internet.
// Ao mudar qualquer arquivo da lista, aumente VERSAO (o teste testes/t_offline.js confere a lista).
'use strict';
const VERSAO = 'lb-v16';
const ARQUIVOS = [
  './', 'index.html', 'manifest.json',
  'css/base.css', 'css/componentes.css', 'css/crianca.css', 'css/responsavel.css',
  'vendor/vue.global.prod.js', 'vendor/dexie.min.js',
  'conteudo/historias.js', 'conteudo/lp.js', 'conteudo/mat.js', 'conteudo/colorir.js',
  'js/respostas.js', 'js/sorteio.js', 'js/banco.js', 'js/registrar-sw.js',
  'js/backup.js', 'js/voz.js', 'js/festa.js', 'js/tentativas.js', 'js/evolucao.js', 'js/impressao.js', 'js/caderno.js', 'js/pergunta.js', 'js/missao.js',
  'js/telas/responsavel.js', 'js/moldes/missao.js', 'js/moldes/responsavel.js',
  'js/telas/historias.js', 'js/telas/atividades.js', 'js/telas/colorir.js',
  'js/telas/selos.js', 'js/telas/ajustes.js', 'js/telas/confirmar.js', 'js/telas/backup.js', 'js/telas/aparelho.js', 'js/app.js',
  'js/moldes/cabecalho.js', 'js/moldes/inicio.js', 'js/moldes/historias.js', 'js/moldes/atividades.js', 'js/moldes/colorir.js', 'js/moldes/selos.js', 'js/moldes/ajustes.js', 'js/moldes/portao.js',
  'js/moldes/navegacao.js', 'js/moldes/confirmar.js', 'js/moldes/backup.js', 'js/moldes/versao.js',
  'icones/icone-192.png', 'icones/icone-512.png', 'icones/icone-mascara-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)));
});

// A versão nova espera o aviso do app (botão "Atualizar") para não trocar no meio de uma atividade.
self.addEventListener('message', e => { if (e.data && e.data.tipo === 'ativar') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ns => Promise.all(ns.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Arquivos do app: do aparelho primeiro. Fontes do Google: guarda na 1ª vez e reusa depois.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(guardado => {
      if (guardado) return guardado;
      return fetch(e.request).then(resp => {
        const ehFonte = /fonts\.(googleapis|gstatic)\.com/.test(e.request.url);
        if (ehFonte && resp && (resp.ok || resp.type === 'opaque')) {
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put(e.request, copia));
        }
        return resp;
      }).catch(() => (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
