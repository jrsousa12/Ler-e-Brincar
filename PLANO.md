# Plano do Ler & Brincar

Só o que falta fazer e os planos futuros. O que já foi feito está em `HISTORICO.md`.
Regra: ao concluir um item, movê-lo para `HISTORICO.md` (com a data) e tirá-lo daqui e do `CLAUDE.md`.

## Decisões que valem sempre (19/11/2026)
- Usuária: **uma criança de 8 anos, em casa**, com dificuldade em Português e Matemática.
- Base: **Vue 3 + Dexie**, com cópia guardada no app (funcionar sem internet).
- Originais do DeepSeek em `original-deepseek/` (só consulta, não editar).
- Fase 6: fora do app desafio com tempo, PIN, relatório cifrado, vários alunos, tema escuro.

### Fase 9 — Melhorias levantadas na revisão de 24/11 (uma conversa cada; `/clear` entre elas)
Revisão: 24 conferências OK, app offline OK, nenhum arquivo acima de 200 linhas. Foco: proteger o progresso e afinar o conteúdo.
- **Prioridade 1 — não perder o progresso (Sonnet)**
  - 9.1 Pedir guarda permanente dos dados (`navigator.storage.persist()` em `js/banco.js`): o Android pode apagar o IndexedDB quando falta espaço
  - 9.2 Lembrete de cópia de segurança na Área do responsável ("Última cópia há X dias. Fazer agora?"); guardar a data da última cópia (`js/backup.js`, `js/telas/backup.js`)
  - 9.3 Aviso amigável quando o app der erro (em vez de tela parada), com botão "Recomeçar"
- **Prioridade 2 — conteúdo que se acerta sem ler (Sonnet, pelos motores)**
  - 9.4 Histórias: 61 perguntas com a certa bem mais longa que as erradas (`node build/conferir.js --tipo certa_mais_longa`); estender o motor `build/ajustar-lp.js` (ou irmão) às histórias e corrigir em lote
  - 9.5 Português: 53 enunciados longos demais (`--tipo texto_longo`); encurtar pelo motor de ajuste
  - 9.6 Matemática nível 1: 25 contas sem figuras (`--tipo falta_figura`); acrescentar pelo motor de item/gerador
- **Prioridade 3 — arrumação interna (Opus planeja, Sonnet faz)**
  - 9.7 Monte a Palavra, Memória e Som e Figura passam a usar o kit `js/rodada.js` (mesmo jeito do Trem e do Mercadinho)
- **Em paralelo — Fase 5**: criar `NOTAS.md` e anotar o uso real da criança (onde trava, o que acha chato, o que repete)

### Fase 5 — Ajustes pelo uso real (contínua)
- O dono observa a criança usando e anota em `NOTAS.md` (ainda não criado); ajustes em tarefas pequenas.
- A conferir no uso real: voz do aparelho em pt-BR; impressão no tablet/celular.

### Guardado para depois — Voz
- Passo 3: dono ouvir a voz no tablet Android.
- Passo 4: gravar áudios das histórias com a voz do Gemini (só opção gratuita, chave do Google AI Studio, poucos por dia; motor `build/voz.js` + áudios no `sw.js` + `VERSAO`). Claude não oferece voz para apps.
