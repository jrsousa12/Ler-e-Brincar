# css/ — regras locais
- Ordem no `index.html`: `fontes` → `base` (cores/tamanhos em `:root`) → `componentes` → `crianca` → `responsavel` → `alegre` (visual alegre, Fase 7) → `tema-azul` (formas do tema azul, 23/11) → `tema-creme` (cor Creme, opção em Ajustes; só variáveis) → `silabas`/`brincadeiras` (brincadeiras) → `listas` (grades de cartões) → `acabamento` (Voltar, etiqueta, botões e aviso iguais nas telas da criança; `.sobrio` fica de fora) → `movimento` (animações).
- Cor nova: criar variável em `base.css` (`--cor-<area>`, `-3d` para a sombra sólida, `-suave` para fundos); não espalhar cores soltas.
- Botão "3D": `box-shadow:0 Npx 0 <cor-3d>` e no `:active` `translateY(N-1px)` com sombra de 1px.
- Animação nova vai em `movimento.css` e entra também no bloco `prefers-reduced-motion`. "Reduzir movimento" (Ajustes) já desliga tudo por `componentes.css`.
- Fontes ficam em `vendor/fontes/` (robô do GitHub baixa); nunca usar Google Fonts pela internet.
- Arquivo CSS novo: incluir no `index.html` e no `sw.js` (`ARQUIVOS`) e subir `VERSAO`.
- Cor Creme: `html.tema-creme` troca as variáveis em `css/tema-creme.css`. Cor nova em `base.css` precisa do par no tema creme se for azul.
