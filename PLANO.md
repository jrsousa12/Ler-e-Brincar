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
- **Em paralelo — Fase 5**: anotar em `NOTAS.md` o uso real da criança (onde trava, o que acha chato, o que repete)

### Fase 10 — Limpeza do código (aprovada 24/11; nada muda para a criança; `tudo.js` verde e commit a cada etapa)
2. Código repetido: achar trechos iguais em arquivos diferentes e passar a usar a peça comum (ex.: `rodada.js`).
4. Testes: todo arquivo do app com teste ligado em `etapas.json`; ajudantes repetidos juntos; testes lentos ou repetidos.
5. Documentação: detalhes dos motores do `CLAUDE.md` vão para `build/CLAUDE.md`; `README.md` simples para o dono.
6. Conferência final: `tudo.js` completo (com navegador), offline, arquivo único e capturas.

### Fase 5 — Ajustes pelo uso real (contínua)
- O dono observa a criança usando e anota em `NOTAS.md`; ajustes em tarefas pequenas.
