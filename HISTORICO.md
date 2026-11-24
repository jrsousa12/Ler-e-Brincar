# Histórico do Ler & Brincar

O que já foi feito, para consulta. Pendências e planos ficam em `PLANO.md`.
Regra: ao concluir um item do `PLANO.md`, movê-lo para cá (seção "Concluídos depois de 24/11", com a data) e tirá-lo do `PLANO.md` e do `CLAUDE.md`.

## Concluídos depois de 24/11

- **9.2 Lembrete de cópia de segurança (24/11)**: a Área do responsável mostra "Última cópia há X dias." e, com 7 dias ou mais (ou nunca), "⏰ ... Fazer agora?". Data em `ajustes.ultimaCopia`; frase em `LB.backup.lembrete` (`js/backup.js`); teste em `t_backup`.

## Notas que saíram do CLAUDE.md (24/11)
- Refazer os 30 desenhos antigos no estilo novo, em lotes de 5 (Sonnet), prévia → aprovação do dono → `--gravar` → `tudo.js` → subir `VERSAO` do `sw.js` → atualizar `PLANO.md`. Feitos: lotes 1 a 7 (`colorir-lote2` a `7.js`, piloto em `colorir-modelos.js`); o lote 7 usa Bézier/retas arredondadas (auxiliares no começo do arquivo, bom molde). Suavização dos lotes 1 a 6 concluída; lote 6 refeito em Bézier (`colorir-lote6.js`) (auxiliares em `build/pedidos/_curvas.js`, incluindo `ov`) (curvas livres: `suave`/`mancha` em `build/desenho.js`). Detalhes em `PLANO.md` (Fase 6)
- **Visual (Fase 7, 20/11)**: etapas 1 e 2 feitas (cores por área, botões 3D, animações; fontes Baloo 2 e Lexend já em `vendor/fontes/`, conferidas). Etapa 3 feita (mascote capivara em `js/mascote.js`: `mascote('normal'|'feliz'|'festa')` nos moldes; trocar o bicho = refazer só esse arquivo). Etapa 4 feita (23/11: barra de progresso, estrela voando, frase lida destacada). Etapa 5 feita (23/11: celebrações; `js/telas/selonovo.js`; teste `node testes/t_celebracoes.js`). Etapa 6 feita (23/11: tablet em `css/tablet.css`; capturas de todas as telas: `node build/capturas.js [tablet]` → `build/previas/capturas-*.png`). Fase 7 concluída. Regras de CSS em `css/CLAUDE.md`.
- **Voz (20/11)**: passos 1 e 2 feitos (`js/voz.js` prefere a voz natural e fala frase por frase; Ajustes tem lista para escolher a voz; teste `testes/t_voz.js`).

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
- Motores: 1 sorteio das opções — feito · 2 gerador de Matemática + ficha de erros típicos — feito · 3 conferidor de qualidade — feito (`build/conferir.js`; 64 avisos no conteúdo atual, a tratar na onda 3) · 4 motor de item único — feito (`build/item.js`) · 5 catálogo do que existe — feito (`build/catalogo.js` → `CATALOGO.md`; mostra só 10 itens de interpretação/inferência em LP: prioridade na onda 3) · 6 comando único de conferência — feito (`build/tudo.js`; `--mudados` escolhe só o necessário). · 7 geradores de Português (`build/gerar-lp.js`) e de Histórias (`build/gerar-historia.js`) + escolha no de Matemática, peças comuns em `build/pedido.js` — feito (23/11). Ordem dos Fatos: `build/gerar-ordem.js` — feito (23/11).
- Depois, conteúdo (Sonnet), uma conversa cada: mat-071 a 100 — feito (19/11, pedido em `build/pedidos/mat-onda3.txt`) · lp-071 a 100 (incluir inferência) — feito (19/11; 10 de inferência) · historia-31 a 40 — feito (19/11, `build/pedidos/historia-onda3.js`) · colorir-31 a 35 — feito (19/11, `build/pedidos/colorir-onda3.js`: tartaruga, girassol, maçã, pato, trem). **Onda 3 completa; próxima: Fase 5 (uso real).** Onda 4: historia-42 a 61 — feito (23/11, `build/pedidos/historia-onda4.js`, nível 3, 20 textos longos). Brincadeira nova "Ordem dos Fatos" (23/11): 50 sequências em `conteudo/ordem.js`.
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
- 3 Início com o mascote — feito (20/11): capivara (trocou a coruja, pedido do dono) em `js/mascote.js` (humores normal/feliz/festa); no início com balão de fala (tocar lê a frase), feliz no balão de acerto, em festa na missão completa; animações em `css/movimento.css`
- 4 Perguntas e histórias: barra de progresso, estrela voando até o contador, frase lida destacada — feito (23/11): barra nas perguntas da história; `LB.festa.estrelaVoando` no acerto; `LB.voz.falar(texto, aoFrase)` avisa a frase lida e a história a destaca (`.frase.lida` em `css/alegre.css`)
- 5 Celebrações — feito (23/11): fim da missão com cartão estourando, medalha balançando e 3 estrelas do prêmio surgindo (`js/moldes/missao.js`); janela "Selo novo!" com raios girando, confete, som e voz (`js/telas/selonovo.js` + `js/moldes/selonovo.js`); selos já mostrados ficam em `selosVistos` (vai na cópia de segurança; cópia antiga conta os selos que já tem como vistos). Teste: `testes/t_celebracoes.js`
- 6 Tablet — feito (23/11): `css/tablet.css` (deitado: início em 2 colunas sem rolar, figura da história mais baixa, colorir com cores à esquerda e desenho cabendo na tela; em pé e deitado: brincadeiras maiores). Motor de capturas `node build/capturas.js [tablet|celular]` fotografa 14 telas em celular, tablet em pé e deitado e monta folhas-resumo em `build/previas/capturas-*.png`; teste em `testes/t_app.js`
- Estilo das brincadeiras no app todo (pedido do dono, 23/11; plano aprovado):
  - Etapa 1 — feita (23/11): listas em grade de cartões (`css/listas.css`); Atividades agrupadas por título ("3 de 14", abre a próxima não feita) e 3 blocos de brincadeiras no topo
  - Etapa 2 — feita (23/11, `css/acabamento.css`): acabamento igual nas telas da criança (botões, etiqueta, aviso, Voltar à esquerda); área do responsável fica sóbria
  - Etapa 3 — feita (23/11): cor Creme em `css/tema-creme.css` (só variáveis, modo claro), escolha "Cor do app" em Ajustes (`ajustes.tema`); azul continua padrão

### Fase 8 — Brincadeiras de Matemática
- Mercadinho — feito (23/11): rodada de 5 compras (2 de pagar certinho com moedas e notas até R$ 10; 2 de troco até R$ 20; 1 com dois produtos: total e troco, até R$ 50), só reais inteiros. `conteudo/mercado.js` (produtos), `js/mercadoregras.js` (contas), `js/telas/mercado.js`, `js/moldes/mercado.js`, `css/mercado.css`; teste `t_mercado`; sw v43. Nível 4 feito (23/11): centavos só de 50 (R$ X,50): pagar certinho com moeda de 50 centavos e troco com nota de 5 ou 10; rodada agora é níveis 1, 2, 3, 4, 4; sw v45.
- Trem dos números — feito (23/11): rodada de 5 trens com 5 vagões; um vagão vazio nos níveis 1 a 3 (de 2 em 2 até 30, de 5 em 5 até 100, de 10 em 10 até 200) e dois vazios, nunca lado a lado, nos dois trens do nível 4 (passos diferentes). Opções erradas: errar o passo ou contar de 1 em 1. `js/tremregras.js` (contas), `js/telas/trem.js`, `js/moldes/trem.js`, `css/trem.css`; teste `t_trem`; sw v44.
- Kit de rodada e motor de brincadeira nova — feito (23/11): `js/rodada.js` (`LB.rodada(ctx, {...})`: sortear, "1 de 5", erro/acerto, estrela no fim de cada desafio, Próximo/Concluir; `exportar('Nome')` dá os nomes do molde); Trem e Mercadinho já usam o kit (Monte a Palavra, Memória e Som e Figura têm outro jeito e ficaram como estavam). Motor `node build/nova-brincadeira.js <id> "<Nome>" <emoji> <mat|lp> [--gravar]` cria regras (com EXEMPLO para trocar), tela, molde, CSS e teste, e liga index, sw.js (+VERSAO), app.js, botão em Atividades e `etapas.json`. Testes `t_rodada`, `t_nova_brincadeira`; sw v47.

### Fase 9 — Melhorias da revisão de 24/11
- 9.1 — feito (24/11): o app pede ao navegador a guarda permanente dos dados (`pedirGuarda` em `js/banco.js`, chamada ao abrir o app); teste `t_banco`; sw v58.
- 9.3 — feito (24/11): aviso amigável de erro com botão "Recomeçar" (`js/avisoerro.js`, sem Vue nem CSS; pega erros soltos e os do Vue via `app.config.errorHandler`; ignora ResizeObserver; o progresso fica guardado); teste `t_avisoerro`; sw v60.
