# Plano do Ler & Brincar

Decisões do dono (19/11/2026):
- Usuária: **uma criança de 8 anos, em casa**, com dificuldade em Português e Matemática.
- Base: **manter Vue 3 + Dexie**, mas com cópia guardada no app (funcionar sem internet).
- Colorir: manter as duas versões; os desenhos novos do arquivo solto (Robô, Dinossauro, Lua com estrelas, Pinguim, Abelha) viram `colorir-26` a `colorir-30`.
- Originais do DeepSeek guardados em `original-deepseek/` (não editar; só consulta).

## Diagnóstico (o que encontrei)

1. Tudo num arquivo só (`Ler-e-Brincar.html`, 1 103 linhas, 120 KB): difícil de mexer sem gastar muitos tokens.
2. Sem internet, a tela fica **em branco** (Vue e Dexie vêm da internet).
3. Não é instalável nem offline (falta `manifest` e `sw.js`), embora o script diga "offline-first".
4. Conteúdo: 195 itens, quase todos corretos. Erros: `lp-037` tem a opção "cafe" repetida; 11 atividades de Matemática usam `tipo:'multipla'` (o script pede sempre `operacao`).
5. Não há leitura em voz alta: importante para uma criança com dificuldade de leitura.

## Fases (cada uma é uma conversa; `/clear` entre elas)

### Fase 1 — Organizar e publicar (Opus) — em andamento
- Feito (19/11): divisão em arquivos, conteúdo em `conteudo/`, lp-037, colorir-26 a 30, regra de resposta certa da Matemática corrigida, validador + teste.
- Feito: Vue e Dexie em `vendor/` (robô do GitHub); app testado no navegador (`testes/t_app.js`).
- Falta: publicar no GitHub Pages.
- Anotado para a Fase 3: ícone ⚙️ do cabeçalho quase invisível; alguns desenhos muito simples (ex.: Abelha).
- Dividir o HTML em arquivos pequenos:
  - `index.html` (só a casca), `css/`, `js/telas/` (uma tela por arquivo), `js/banco.js` (Dexie)
  - `conteudo/historias.js`, `lp.js`, `mat.js`, `colorir.js` (um item por linha)
  - `vendor/` (Vue e Dexie guardados)
- Corrigir `lp-037`; acrescentar `colorir-26` a `30`.
- Criar o **validador** (`build/validar.js`): confere ids, 3 opções, resposta certa, contas, sinal `−`.
- Publicar no **GitHub Pages**: o dono ativa uma vez, nas configurações do repositório, com o passo a passo.

### Fase 2 — Offline e instalável (Sonnet)
- `manifest.json` + `sw.js`: ícone na tela do tablet/celular e funcionamento sem internet.

### Fase 3 — Visual e UX para a criança (Opus planeja, Sonnet faz)
- **Missão do dia** na tela inicial: 1 história + 3 de Português + 3 de Matemática + 1 desenho, em sequência guiada, sem menus para escolher.
- 🔊 Botão "ouvir" em textos e perguntas (voz do próprio aparelho, sem internet).
- Botões grandes, pouca leitura nas telas de navegação, ícones claros.
- Acerto: festa (animação + som). Erro: incentivo + explicação, e uma nova tentativa.
- Selos e estrelas ligados à missão do dia.
- **Área do responsável** (com trava simples): progresso, onde errou mais, imprimir desenhos e atividades.

### Fase 4 — Onda 3 de conteúdo (Sonnet)
- Gerar com `original-deepseek/script-gerador-conteudo.md` (ajustado) e passar pelo validador antes de entrar no app.

### Fase 5 — Ajustes pelo uso real
- O dono observa a criança usando e anota em `NOTAS.md`; ajustes em tarefas pequenas.
