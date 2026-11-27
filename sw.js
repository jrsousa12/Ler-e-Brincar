// Guarda o app no aparelho para funcionar sem internet.
// Ao mudar qualquer arquivo da lista, aumente VERSAO (o teste testes/t_offline.js confere a lista).
'use strict';
const VERSAO = 'lb-v96';
const ARQUIVOS = [
  './', 'index.html', 'manifest.json',
  'css/fontes.css', 'css/base.css', 'css/pecas/cabecalho.css', 'css/pecas/botoes.css', 'css/pecas/cartao.css', 'css/pecas/opcao.css', 'css/pecas/etiquetas.css', 'css/pecas/janelas.css', 'css/pecas/mascote.css', 'css/telas/inicio.css', 'css/telas/missao.css', 'css/telas/historias.css', 'css/telas/listas.css', 'css/telas/colorir.css', 'css/telas/selos.css', 'css/telas/responsavel.css', 'css/telas/silabas.css', 'css/telas/memoria.css', 'css/telas/somfigura.css', 'css/telas/mercado.css', 'css/telas/trem.css', 'css/telas/ordem.css', 'css/telas/pacote.css', 'css/telas/relogio.css', 'css/telas/regua.css', 'css/telas/formas.css', 'css/telas/grafico.css', 'css/tema-creme.css', 'css/escuro.css', 'css/impressao.css', 'css/tablet.css', 'css/movimento.css',
  'vendor/vue.global.prod.js', 'vendor/dexie.min.js',
  'conteudo/historias.js', 'conteudo/lp.js', 'conteudo/mat.js', 'conteudo/colorir.js', 'conteudo/silabas.js', 'conteudo/mercado.js', 'conteudo/ordem.js',
  'js/avisoerro.js', 'js/respostas.js', 'js/sorteio.js', 'js/banco.js', 'js/registrar-sw.js',
  'js/backup.js', 'js/voz.js', 'js/festa.js', 'js/tentativas.js', 'js/evolucao.js', 'js/impressao.js', 'js/caderno.js', 'js/pergunta.js', 'js/missao.js', 'js/mascote.js', 'js/rodada.js', 'js/rolagem.js', 'js/voltar.js', 'js/ondeparou.js',
  'js/telas/responsavel.js', 'js/moldes/missao.js', 'js/moldes/responsavel.js',
  'js/telas/historias.js', 'js/telas/atividades.js', 'js/telas/materias.js', 'js/telas/topo.js', 'js/telas/colorir.js', 'js/telas/silabas.js', 'js/moldes/abas.js', 'js/moldes/silabas.js',
  'js/telas/memoria.js', 'js/telas/somfigura.js', 'js/moldes/memoria.js', 'js/moldes/somfigura.js', 'js/mercadoregras.js', 'js/telas/mercado.js', 'js/moldes/mercado.js', 'js/tremregras.js', 'js/telas/trem.js', 'js/moldes/trem.js',
  'js/ordemregras.js', 'js/telas/ordem.js', 'js/moldes/ordem.js',
  'js/pacoteregras.js', 'js/telas/pacote.js', 'js/moldes/pacote.js',
  'js/relogioregras.js', 'js/relogiodesenho.js', 'js/telas/relogio.js', 'js/moldes/relogio.js',
  'js/reguaregras.js', 'js/reguadesenho.js', 'js/telas/regua.js', 'js/moldes/regua.js',
  'js/formasregras.js', 'js/formasdesenho.js', 'js/telas/formas.js', 'js/moldes/formas.js',
  'js/graficoregras.js', 'js/graficodesenho.js', 'js/telas/grafico.js', 'js/moldes/grafico.js',
  'js/telas/selos.js', 'js/telas/selonovo.js', 'js/telas/ajustes.js', 'js/telas/confirmar.js', 'js/telas/backup.js', 'js/telas/aparelho.js', 'js/app.js',
  'js/moldes/cabecalho.js', 'js/moldes/inicio.js', 'js/moldes/materias.js', 'js/moldes/historias.js', 'js/moldes/atividades.js', 'js/moldes/colorir.js', 'js/moldes/selos.js', 'js/moldes/ajustes.js', 'js/moldes/portao.js',
  'js/moldes/navegacao.js', 'js/moldes/confirmar.js', 'js/moldes/selonovo.js', 'js/moldes/backup.js', 'js/moldes/versao.js',
  'icones/icone-192.png', 'icones/icone-512.png', 'icones/icone-mascara-512.png'
];
// Fontes (vendor/fontes/, baixadas pelo robô do GitHub): guardadas se existirem; se faltarem, o app usa a fonte comum.
const FONTES = ['baloo-2-600', 'baloo-2-700', 'baloo-2-800', 'lexend-400', 'lexend-600', 'lexend-700']
  .map(n => 'vendor/fontes/' + n + '.woff2');

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)
    .then(() => Promise.all(FONTES.map(f => c.add(f).catch(() => null))))));
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

// Arquivos do app: do aparelho primeiro. Fontes: guarda na 1ª vez e reusa depois.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(guardado => {
      if (guardado) return guardado;
      return fetch(e.request).then(resp => {
        const ehFonte = /fonts\.(googleapis|gstatic)\.com|vendor\/fontes\//.test(e.request.url);
        if (ehFonte && resp && (resp.ok || resp.type === 'opaque')) {
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put(e.request, copia));
        }
        return resp;
      }).catch(() => (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
