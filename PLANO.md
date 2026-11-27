# Plano do Ler & Brincar

Só o que falta fazer e os planos futuros. O que já foi feito está em `HISTORICO.md`.
Regra: ao concluir um item, movê-lo para `HISTORICO.md` (com a data) e tirá-lo daqui e do `CLAUDE.md`.

## Decisões que valem sempre (19/11/2026)
- Usuária: **uma criança de 8 anos, em casa**, com dificuldade em Português e Matemática.
- Base: **Vue 3 + Dexie**, com cópia guardada no app (funcionar sem internet).
- Originais do DeepSeek em `original-deepseek/` (só consulta, não editar).
- Fase 6: fora do app desafio com tempo, PIN, relatório cifrado, vários alunos, tema escuro.

### Fase 5 — Ajustes pelo uso real (contínua)
- O dono observa a criança usando e anota em `NOTAS.md`; ajustes em tarefas pequenas.

### Reestruturação + Fase 10 — plano aprovado pelo dono em 27/11
Decisões: menu **por matéria**; estilo **o atual, mais caprichado**; expansão **só a Fase 10**. Fazer na ordem (A a D feitas, ver `HISTORICO.md`): nada pendente.

### Fase 11 — Matemática que falta — plano aprovado pelo dono em 27/11 (Sonnet faz, uma etapa por conversa)
Decisões: brincadeiras com desafios sorteados pelo código (não pelo banco); desenhos feitos pelo app (sem imagem); rodada de 5 do fácil ao difícil, no jeito do Trem; cada uma criada com `build/nova-brincadeira.js`; conta certa sempre calculada e com teste guardado; arquivos abaixo de 200 linhas (desenho grande vira peça à parte).
- **11.2 Régua 📏** (EF02MA16): objeto sobre a régua em cm ("quantos centímetros?"); nível alto com o objeto fora do zero; comparar qual é mais comprido.
- **11.3 Formas 🔺** (EF02MA15): círculo, quadrado, retângulo, triângulo em tamanhos e posições diferentes (girados); "toque no triângulo", "quantos lados?".
- **11.4 Gráfico de barras 📊** (EF02MA22): gráfico com figuras; 3 perguntas por gráfico (qual tem mais, quantos, quanto a mais). Só ler (montar as barras, EF02MA23, fica para depois).
- **11.5 Questões no banco** (`gerar-mat` + `bncc`): calendário/dias da semana (EF02MA18), pesado/leve e litro (EF02MA17), sólidos com objetos 🎲⚽🥫🍦 (EF02MA14); nomes curtos em `NOMES` de `js/pacoteregras.js` e regras em `build/fichas/bncc.json`.

### Depois (rascunho de 24/11, não aprovado)
- **Fase 12 — Escrever de verdade** (Opus): Ditado (voz fala, ela monta com teclado de letras grandes); completar a letra que falta.
- **Fase 13 — Nível que se ajusta sozinho** (Opus): sobe/desce o nível por habilidade usando o caderno de erros.
- Observação: EF35LP03 tem 100 itens só no nível 3 (difícil para ela); ver se Pacotes de contas viram formato de LP após o teste em `NOTAS.md`.
