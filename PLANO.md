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

### Fase 14 — Ideia principal (EF35LP03) mais fácil (aprovada pelo dono em 28/11)
- Feito: `pedir.js --nivel` (texto de cada nível na ficha). Pedidos prontos: `build/previas/pedido-lp-ideia-n1.txt` e `-n2.txt` (20 cada).
- Falta: o dono cola cada pedido na outra IA e salva a resposta em `build/pedidos/lp-ideia-n1.json` e `-n2.json` → importar (`--nivel 1`/`--nivel 2 --bncc EF35LP03`) → `gerar-lp --gravar` → ajuste.

### Depois (ideias, não aprovadas)
- Ligar o nível por habilidade (`js/nivel.js`) às brincadeiras com níveis próprios (trem, gráfico, formas, relógio).
- Ver se Pacotes de contas viram formato de LP após o teste em `NOTAS.md`.
