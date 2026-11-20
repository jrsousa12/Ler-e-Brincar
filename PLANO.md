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

### Fase 1 — Organizar e publicar (Opus) — feita (19/11, publicada no GitHub Pages pela main)
- Feito (19/11): divisão em arquivos, conteúdo em `conteudo/`, lp-037, colorir-26 a 30, regra de resposta certa da Matemática corrigida, validador + teste.
- Feito: Vue e Dexie em `vendor/` (robô do GitHub); app testado no navegador (`testes/t_app.js`).
- Feito: publicado no GitHub Pages (pela `main`) e conferido: abre e funciona sem internet.
- Anotado para a Fase 3: ícone ⚙️ do cabeçalho quase invisível; alguns desenhos muito simples (ex.: Abelha).
- Dividir o HTML em arquivos pequenos:
  - `index.html` (só a casca), `css/`, `js/telas/` (uma tela por arquivo), `js/banco.js` (Dexie)
  - `conteudo/historias.js`, `lp.js`, `mat.js`, `colorir.js` (um item por linha)
  - `vendor/` (Vue e Dexie guardados)
- Corrigir `lp-037`; acrescentar `colorir-26` a `30`.
- Criar o **validador** (`build/validar.js`): confere ids, 3 opções, resposta certa, contas, sinal `−`.
- Publicar no **GitHub Pages**: o dono ativa uma vez, nas configurações do repositório, com o passo a passo.

### Fase 2 — Offline e instalável (Sonnet) — feita (19/11)
- `manifest.json` + `sw.js`: ícone na tela do tablet/celular e funcionamento sem internet.

### Fase 3 — Visual e UX para a criança (Opus planeja, Sonnet faz) — feita (19/11)
- Decisões (19/11): trava do responsável = conta de adulto (ex.: 7 × 8); voz lê sozinha ao abrir (desligável nos Ajustes); missão com 8 passos.
- Feito (19/11): 3.0 — telas saíram do `index.html` (agora 59 linhas) para `js/moldes/`.
- Feito (19/11): 3.1 voz · 3.2 festa/nova tentativa/tentativas guardadas · 3.3 missão do dia · 3.4 selos de missões e dias seguidos · 3.5 visual (início em blocos, ⚙️ branco, opções maiores, tocar dentro da forma pinta, colorir-26 a 30 redesenhados) · 3.6 área do responsável (trava com conta, progresso, onde errou, imprimir).
- A conferir no uso real (Fase 5): voz do aparelho em pt-BR; impressão no tablet/celular.
- Etapas (uma conversa cada): 3.0 tirar as telas do `index.html` para `js/telas/` · 3.1 🔊 voz (`js/voz.js`) · 3.2 acerto/erro + guardar tentativas (`js/festa.js`, `js/tentativas.js`) · 3.3 missão do dia (`js/missao.js`) · 3.4 selos da missão e dias seguidos · 3.5 visual (botões, ⚙️, desenhos simples) · 3.6 área do responsável + impressão.
- **Missão do dia** na tela inicial: 1 história + 3 de Português + 3 de Matemática + 1 desenho, em sequência guiada, sem menus para escolher.
- 🔊 Botão "ouvir" em textos e perguntas (voz do próprio aparelho, sem internet).
- Botões grandes, pouca leitura nas telas de navegação, ícones claros.
- Acerto: festa (animação + som). Erro: incentivo + explicação, e uma nova tentativa.
- Selos e estrelas ligados à missão do dia.
- **Área do responsável** (com trava simples): progresso, onde errou mais, imprimir desenhos e atividades.

### Fase 4 — Motores, depois onda 3 de conteúdo
- Decisão (19/11): primeiro os motores; opções **sorteadas** a cada vez no app (a certa estava quase sempre no botão do meio).
- Motores: 1 sorteio das opções — feito · 2 gerador de Matemática + ficha de erros típicos — feito · 3 conferidor de qualidade — feito (`build/conferir.js`; 64 avisos no conteúdo atual, a tratar na onda 3) · 4 motor de item único — feito (`build/item.js`) · 5 catálogo do que existe — feito (`build/catalogo.js` → `CATALOGO.md`; mostra só 10 itens de interpretação/inferência em LP: prioridade na onda 3) · 6 comando único de conferência — feito (`build/tudo.js`; `--mudados` escolhe só o necessário).
- Depois, conteúdo (Sonnet), uma conversa cada: mat-071 a 100 — feito (19/11, pedido em `build/pedidos/mat-onda3.txt`) · lp-071 a 100 (incluir inferência) — feito (19/11; 10 de inferência) · historia-31 a 40 — feito (19/11, `build/pedidos/historia-onda3.js`) · colorir-31 a 35 — feito (19/11, `build/pedidos/colorir-onda3.js`: tartaruga, girassol, maçã, pato, trem). **Onda 3 completa; próxima: Fase 5 (uso real).**
- Regras: `original-deepseek/script-gerador-conteudo.md` (ajustado) + validador antes de entrar no app.

### Fase 5 — Ajustes pelo uso real
- O dono observa a criança usando e anota em `NOTAS.md`; ajustes em tarefas pequenas.
- Desenhos mais curvos e harmoniosos (pedido 19/11): piloto de 5 feito (01, 05, 07, 10, 19; gato com 4 patas e árvore refeitos após revisão do dono) + cabeçalho de impressão novo + motor `build/colorir.js` + biblioteca de peças `build/pecas/` (35 peças tiradas dos 5 aprovados; receita em `build/pecas/CLAUDE.md`). Faltam 30, em lotes de 5 (Sonnet), começando pelos que `node build/conferir.js --tipo desenho_simples` aponta. **Lote 2 feito (19/11, `build/pedidos/colorir-lote2.js`): 02, 03, 13, 18, 21. **Lote 3 feito (19/11, `build/pedidos/colorir-lote3.js`): 09, 12, 14, 23, 04. **Lote 4 gravado (19/11, `colorir-lote4.js`): 06, 11, 15, 16, 22; sw v15.** **Lote 5 gravado (19/11, `colorir-lote5.js`): 08, 17, 20, 24, 25; sw v16.** **Lote 6 gravado (20/11, `colorir-lote6.js`, contornos de curva livre com `suave`/`mancha` do kit): 26 a 30; sw v17.** **Lote 7 gravado (20/11, `colorir-lote7.js`, curvas Bézier, retas arredondadas e fórmulas; tartaruga em 3/4): 31 a 35; sw v18. Os 35 desenhos estão refeitos.** **Depois (dono aprovou 20/11): suavizar os lotes 3 a 5 (lotes 1, 2 e 3 já suavizados e gravados em 20/11: `colorir-lote1.js`, `colorir-lote2.js`, `colorir-lote3.js`; sw v21; lote 4 suavizado e gravado em 20/11: `colorir-lote4.js`, sw v22; auxiliares de curva em `build/pedidos/_curvas.js`; lote 5 suavizado e gravado em 20/11: `colorir-lote5.js`, sw v23; suavização dos lotes 1 a 5 concluída); **lote 6 repaginado no estilo do lote 7 e gravado em 20/11 (`colorir-lote6.js`, sw v24): suavização de todos os lotes concluída**, que usam muitas elipses/círculos (plano antes).** peças do lote 4 registradas em 20/11 (`confeito`, `coneSorvete`, `folhaJoaninha` em `build/pecas/natureza.js`; lote 4 regravado, sw v25).

### Fase 6 — Usabilidade trazida do app Ondulatória (decisão 19/11)
- Ideias tiradas do app de ondulatória do dono, adaptadas para criança de 8 anos. Fora: desafio com tempo, PIN, relatório cifrado, vários alunos, tema escuro.
- 1 Caderno de erros (a pergunta errada volta na missão até 2 acertos seguidos de primeira) — feito (19/11, `js/caderno.js`)
- 2 Treino pelos pontos fracos (a missão puxa mais as habilidades com mais erro) — feito (19/11, `js/caderno.js` + `js/missao.js`)
- 3 a 7 — feitos (19/11): cópia de segurança baixar/trazer (`js/backup.js` + `js/telas/backup.js`, teste `t_backup`) · botão "Instalar" e aviso de versão nova com botão "Atualizar" (`js/telas/aparelho.js`, `js/registrar-sw.js`; o `sw.js` agora espera o aviso) · caixa de confirmação própria (`js/telas/confirmar.js`, usada em zerar e trazer cópia) · tela cheia (Área do responsável → "No tablet") · vibrar ao responder e "reduzir movimento" nos Ajustes (`js/festa.js`)
- 8 Evolução no tempo na Área do responsável — feito (19/11, `js/evolucao.js` + cartão "📈 Evolução", teste `t_evolucao`)

### Fase 7 — Visual alegre e fluido (decisão 20/11: coruja como mascote, estilo alegre e colorido)
- 1 Base visual — feito (20/11): paleta viva com uma cor por área (`--cor-ler/brincar/colorir/selos` em `css/base.css`), botões "3D" que afundam (`css/alegre.css`), fontes locais (`css/fontes.css`, arquivos em `vendor/fontes/` baixados pelo robô do GitHub)
- 2 Fluidez — feito (20/11): telas entram deslizando, opções aparecem uma a uma, acerto dá pulinho, erro balança (`css/movimento.css`; "Reduzir movimento" desliga)
- 3 Início com a coruja (mascote que muda de humor) — a fazer
- 4 Perguntas e histórias: barra de progresso, estrela voando até o contador, frase lida destacada — a fazer
- 5 Celebrações: fim da missão e selo novo animados — a fazer
- 6 Tablet (layout largo) e acabamento: capturas de todas as telas para revisão — a fazer
