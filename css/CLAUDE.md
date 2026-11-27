# css/ — regras locais (organização da Etapa A, 27/11)
- Ordem no `index.html` (a ordem decide quem vale quando duas regras empatam):
  1. `fontes` → `base` (variáveis em `:root`, elementos simples, `.linha-botoes`, ajudantes `.mt` etc.)
  2. `pecas/` (uma peça por arquivo): `cabecalho` (topo + barra de baixo), `botoes` (todos os botões, Voltar, filtros, botões 3D das brincadeiras), `cartao`, `opcao` (opção, balão de resposta, apoio visual), `etiquetas` (etiqueta de contagem + abas), `janelas` (trava dos adultos, "Tem certeza?", aviso de versão), `mascote`
  3. `telas/` (um arquivo por tela): inicio, missao, historias, listas, colorir, selos, responsavel, silabas, memoria, somfigura, mercado, trem, ordem, pacote
  4. Por cima, só ajustes: `tema-creme` (cor Creme, só variáveis + poucos ajustes) → `escuro` (modo escuro do aparelho) → `impressao` → `tablet` (só `@media`) → `movimento` (animações, confete e "reduzir movimento")
- **Dono único**: cada seletor fica num só arquivo de base/peças/telas (teste `testes/t_estilos.js`). Mudar a cara de uma peça = mexer só no arquivo dela. Temas, escuro, tablet, movimento e impressão podem repetir seletores.
- Dentro de um arquivo de peça a ordem importa: tamanho → cor → dedo em cima (`@media (hover:hover)`) → apertado (`:active`).
- **Provar que nada mudou** (arrumação sem mudar a tela): `node build/antes-depois.js antes` ANTES de mexer, depois `node build/antes-depois.js depois` (compara fotos e o estilo final de cada elemento, também com dedo em cima, apertando e foco; folhas lado a lado em `build/previas/antes-depois-*.png`).
- Cor nova: criar variável em `base.css` (`--cor-<area>`, `-3d` para a sombra sólida, `-suave` para fundos); não espalhar cores soltas. Se for azul, precisa do par no `tema-creme`.
- Botão "3D": `box-shadow:0 Npx 0 <cor-3d>` e no `:active` `translateY(N-1px)` com sombra de 1px.
- Animação nova vai em `movimento.css` e entra também no bloco `prefers-reduced-motion`. "Reduzir movimento" (Ajustes) já desliga tudo (fim de `movimento.css`).
- Fontes ficam em `vendor/fontes/` (robô do GitHub baixa); nunca usar Google Fonts pela internet.
- Arquivo CSS novo: incluir no `index.html` e no `sw.js` (`ARQUIVOS`) e subir `VERSAO`. Brincadeira nova (`build/nova-brincadeira.js`) já cria `css/telas/<id>.css` e liga tudo.
- Tablet: ajustes de tela larga só em `css/tablet.css`; conferir com `node build/capturas.js tablet` (fotos em `build/previas/`).
- Modo escuro: ajustes em `css/escuro.css`. Fundo claro fixo (`#fff`, `-suave` novo) ou texto em cor `-3d` precisa do par lá; conferir com `node build/capturas.js escuro`.
