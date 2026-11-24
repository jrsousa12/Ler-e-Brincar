# Revisão de Português (build/ajustar-lp.js)

Receita para reescrever a folha `lp-revisao.txt` (nunca editar `conteudo/` à mão):

- **Não cortar**: a certa fica mais curta com outras palavras e mantém a pista inteira do texto.
- **Pergunta de pista**: a certa usa palavras do texto (no máximo 1 palavra nova).
- **Erradas**: de 0,75 a 1,3 vezes o tamanho da certa nova, mesmo jeito de frase que a certa (se a certa começa com "Porque"/"Para", as erradas também).
- **Distratores**: cada errada com `{tipo}` da série do item (nível 1 = 2º ano; 2 e 3 = 3º ano), tipos diferentes nas duas. Tipos e exemplos: `build/fichas/distratores.json`.
- **Errada nunca pode ser verdade** pelo texto (o tipo `trecho` é verdade, mas não responde à pergunta).
- **Sem absurdos** (lua, neve...): a criança descarta sem ler.
- Se a explicação deixar de combinar, acrescentar `| explicacao=...` na linha.
- Depois: `--aplicar` (prévia) até 0 recusados, `--gravar`, `node build/tudo.js --mudados`, subir `VERSAO` do `sw.js`.
- `registro.jsonl`: histórico do que já foi trocado (antes, depois, tipos). Não editar.
- **Enunciados longos** (`build/ajustar-enunciado.js`, folha `enunciado-revisao.txt`): encurtar o `texto=` com outras palavras; manter as palavras da certa e as opções que vêm do texto; se a pergunta também for longa, mandar `pergunta=` mais curta.
