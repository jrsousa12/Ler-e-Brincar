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

### Fase 13 — Nível que se ajusta sozinho (plano de 28/11, aguardando o "sim" do dono)
Decisões do dono (28/11): olhar as **últimas 5 respostas de primeira** de cada habilidade; **sobe com 4 de 5 acertos, desce com 2 erros seguidos**; **festa só ao subir** (descer é invisível); **painel para o adulto nos Ajustes**.
1. `js/nivel.js` (novo, funções puras): guarda por habilidade `{ nivel, ultimas }` no caderno (vai junto na cópia de segurança). Começa no menor nível que existe naquela habilidade; nunca passa do maior que existe.
2. `js/caderno.js`: `anotar` e `anotarHabilidade` passam a atualizar o nível e avisam quando subiu.
3. `js/missao.js` e `js/pacoteregras.js`: as atividades novas saem do nível atual de cada habilidade (se faltar, o vizinho), em vez do "mais fácil de toda a matéria".
4. Festa ao subir: mascote diz "Você subiu de nível em <tema>!" (peça de `js/telas/selonovo.js`).
5. Painel nos Ajustes: habilidade (nome curto), nível atual e os 5 últimos ✔/✘.
6. Teste guardado `testes/t_nivel.js` (+ `etapas.json`), `sw.js` (VERSAO e arquivo novo), `node build/tudo.js`.
- Fora desta fase: brincadeiras com níveis próprios (trem, gráfico, formas, relógio) continuam como estão; dá para ligar depois.
- Observação: EF35LP03 tem 100 itens só no nível 3 (difícil para ela; o ajuste não consegue descer); ver se Pacotes de contas viram formato de LP após o teste em `NOTAS.md`.
