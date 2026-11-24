# Diretrizes de Eficiência de Contexto e Tokens

> **IDIOMA — REGRA Nº 1**: responder **sempre e somente em português do Brasil (PT-BR)**, em toda mensagem, do começo ao fim: respostas, resumos, avisos, perguntas, legendas de arquivos, mensagens de commit e comentários de código. Nunca em inglês, mesmo depois de trocar de modelo, de `/clear` ou de ler texto em inglês. Antes de enviar cada resposta, conferir o idioma.

Este projeto prioriza a economia de contexto e tokens. Estas diretrizes são de cumprimento obrigatório.

## 0. Contexto do Projeto

- **Projeto**: Ler-e-Brincar — app para crianças do Ensino Fundamental Anos Iniciais praticarem leitura, matemática e Língua Portuguesa.
- **Stack**: PWA estático com Vue 3 + Dexie (IndexedDB), cópia local em `vendor/`, sem npm, sem backend/login/anúncios. Publicado no GitHub Pages.
- **Usuária**: uma criança de 8 anos, em casa, com dificuldade em LP e Matemática (BNCC 2º/3º ano).
- **Comandos úteis**:
  - Validar conteúdo: `node build/validar.js` (rodar sempre que mexer em `conteudo/`)
  - Testes: `node testes/t_conteudo.js` (regra de resposta certa + validador); `node testes/t_app.js` (abre o app no navegador; `CAPTURAS=pasta` salva fotos); `node testes/t_sorteio.js` (sorteio da ordem das opções); `node testes/t_caderno.js` (caderno de erros e pontos fracos na missão); `node testes/t_backup.js` (cópia de segurança); `node testes/t_silabas.js` (brincadeira Monte a Palavra, `js/telas/silabas.js`); `node testes/t_brincadeiras.js` (Memória e Som e Figura, `js/telas/memoria.js` e `somfigura.js`, palavras de `conteudo/silabas.js`); `node testes/t_mercado.js` (Mercadinho: pagar certinho, troco e dois produtos; contas em `js/mercadoregras.js`, produtos e preços em `conteudo/mercado.js`); `node testes/t_trem.js` (Trem dos números: sequências de 2, 5 e 10; contas em `js/tremregras.js`); `node testes/t_ordem.js` (Ordem dos Fatos: pôr 3 fatos em ordem; sequências em `conteudo/ordem.js`, lote em `build/pedidos/ordem-lote1.js`)
  - Offline: `node testes/t_offline.js` (lista do `sw.js`, manifesto, app sem internet). Ao mudar arquivo do app, aumentar `VERSAO` em `sw.js` e incluir o arquivo novo na lista. Ícones: `node build/icones.js`
  - Arquivo único: `node build/arquivo-unico.js` junta o app num só `.html` (CSS, JS, fontes embutidos; sem service worker) → `build/previas/ler-e-brincar.html`
  - Robô do GitHub (`.github/workflows/verificar.yml`, autorizado 19/11): a cada envio, roda o validador e baixa Vue/Dexie e as fontes para `vendor/` se faltarem (faz commit sozinho: dar `git pull` depois).
  - **Gerar conteúdo** (prévia; `--ver` mostra cada item; `--gravar` acrescenta): peças comuns em `build/pedido.js`; testes `t_gerar_mat`, `t_gerar_lp`, `t_gerar_historia`, `t_gerar_ordem` (ajudante `testes/_gerador.js`). Nunca escrever itens à mão: usar o motor.
    - Matemática: `node build/gerar-mat.js build/pedidos/<arq>.txt`; linha `8 − 3 | 🍬 | enunciado` ou escolha `? enunciado | *certa | errada | errada | explicação | bncc=`; ficha `build/fichas/mat.json`
    - Português: `node build/gerar-lp.js build/pedidos/lp-<lote>.txt`; moldes `troca | frase com [certa]`, `grafia | palavra | emoji`, `palavra | texto | pergunta | certa | tem=nh`, `silabas | ca-va-lo`, `alfabetica | a, b, c`, e de escolha (`inferencia | enunciado | *certa | e | e | explicação`, também interpretacao, leia, sinonimo...); ficha `build/fichas/lp.json` (grupos mas/mais, trocas típicas)
    - **Lote em JSON do dono** (roteiro para a outra IA: `build/roteiros/lote-lp.md`; Matemática: `lote-mat.md`): salvar em `build/pedidos/lp-<lote>.json` → `node build/importar-lp.js <json> [--titulo ...] [--nivel 2]` (confere o roteiro na chegada; fora dele, não grava e faz `<lote>-conferencia.txt` para a outra IA; `--aceitar` importa assim mesmo) → `gerar-lp --gravar` → **ajuste** `node build/ajustar-lp.js lp-A..lp-B` (acha certa comprida/fora do texto e monta `build/revisao/lp-revisao.txt`; NÃO corta) → reescrever a folha (receita `build/revisao/CLAUDE.md`, distratores por série em `build/fichas/distratores.json`) → `--aplicar <folha> --gravar` (confere tamanhos e tipos; anota em `build/revisao/registro.jsonl`). Teste `t_ajustar`. **Histórias**: `node build/ajustar-historia.js` (mesma receita; linha `historia-05#1 | *certa | errada {tipo} | errada {tipo}`; folha `build/revisao/historia-revisao.txt`; `--aplicar <folha> --gravar`)
    - Ordem dos Fatos: `node build/gerar-ordem.js build/pedidos/ordem-<lote>.txt`; linha `Título | 1º fato | 2º | 3º | enunciado=...` (fatos na ordem certa); ficha `build/fichas/ordem.json`. O `ordem-lote1.js` só serviu ao lote 1 (tem trava)
    - Histórias: `node build/gerar-historia.js build/pedidos/historia-<onda>.txt`; `= Título | emoji | nivel=3`, parágrafos, `? pergunta | *certa | ...` e `! inferência`; ficha `build/fichas/historias.json`
  - **Brincadeira nova**: `node build/nova-brincadeira.js <id> "<Nome>" <emoji> <mat|lp>` (prévia) e `--gravar`: cria regras/tela/molde/CSS/teste e liga tudo (index, `sw.js`+VERSAO, `app.js`, botão, `etapas.json`); depois trocar o EXEMPLO em `js/<id>regras.js`. Moldes em `build/modelos/brincadeira.js`. A tela usa o kit de rodada `js/rodada.js` (vai e vem da rodada, estrela, Próximo/Concluir). Testes: `node testes/t_nova_brincadeira.js`, `node testes/t_rodada.js`
  - Gerar Monte a Palavra: `node build/gerar-silabas.js build/pedidos/silabas-<lote>.txt` (prévia; `--ver` lista cada palavra) e `--gravar` → `conteudo/silabas.js`; linha `GA-LI-NHA | 🐔 | dica`; trocas típicas e níveis em `build/fichas/silabas.json`. Teste: `node testes/t_gerar_silabas.js`
  - Desenhos de colorir (Motor 7): montar com a biblioteca de peças `build/pecas/` (lista `build/pecas/PECAS.md`; receita em `build/pecas/CLAUDE.md`); `node build/colorir.js build/pedidos/<lote>.js` (confere + prévia em `build/previas/colorir.png`) e `--gravar`; peça nova: `node build/biblioteca.js`. Exemplo: `build/pedidos/colorir-modelos.js`. Teste: `node testes/t_colorir.js`
    - Molde bom de desenho: `build/pedidos/colorir-lote7.js` (Bézier/retas arredondadas); auxiliares de curva em `build/pedidos/_curvas.js` (inclui `ov`); curvas livres `suave`/`mancha` em `build/desenho.js`
  - **BNCC (Motor 8)**: `node build/bncc.js` (prévia → `build/revisao/bncc.txt`), `--gravar` corrige, `--codigos` lista os usados com o texto oficial. Textos oficiais (PDF MEC 2018) e regras "atividade → código" em `build/fichas/bncc.json`; validador e geradores usam as mesmas regras (`build/bncc-regras.js`). Teste: `node testes/t_bncc.js`
  - Qualidade (avisos, não bloqueia): `node build/conferir.js` (`--tipo codigo` lista um tipo; `--estrito` falha se houver aviso); limites e avisos aceitos em `build/fichas/qualidade.json`. Teste: `node testes/t_conferir.js`
  - Item único (Motor 4): `node build/item.js lp-037` mostra; `-c campos`; `--busca texto`; `campo=texto`, `campo:=json`, `perguntas.0.correta:=1`, `-x campo` alteram só a linha. Nunca ler nem dar `grep` nas linhas de `conteudo/`: usar o motor. Teste: `node testes/t_item.js`
  - Catálogo (Motor 5): `node build/catalogo.js` gera `CATALOGO.md` (o que existe por habilidade/nível, próximos ids livres, arquivos de código). Consultar antes de criar conteúdo ou código; nunca editar à mão; `--conferir` falha se estiver desatualizado. Teste: `node testes/t_catalogo.js`
  - **Conferir tudo (Motor 6)**: `node build/tudo.js` (uma linha por etapa: sintaxe, tamanho, validador, qualidade, catálogo, todos os testes). `--mudados` roda só o ligado aos arquivos alterados; `--rapido` pula o navegador; `--lista` só mostra. Etapas e mapa: `build/fichas/etapas.json` (teste novo entra ali). Rodar antes de cada commit. Teste: `node testes/t_tudo.js`
- **Estrutura**: `index.html` (só a casca), `css/`, `js/app.js` (junta tudo) + `js/telas/` (comportamento de cada tela) + `js/moldes/` (HTML de cada tela), `js/respostas.js` (regra única de resposta certa), `js/sorteio.js` (sorteia a ordem dos botões a cada vez; o conteúdo não muda), `js/pergunta.js` (responder com nova tentativa), `js/rodada.js` (kit de rodada das brincadeiras), `js/missao.js`, `js/caderno.js` (caderno de erros: volta na missão até 2 acertos seguidos; pesa habilidades fracas), `js/backup.js` (cópia de segurança), `js/telas/confirmar.js` (caixa "Tem certeza?": usar `ctx.perguntar`, nunca `confirm`), `js/telas/aparelho.js` (instalar, versão nova, tela cheia), `js/voz.js`, `js/festa.js` (confete, som, vibração), `js/tentativas.js`, `conteudo/` (um item por linha; achar com `grep "id:'lp-037'"`), `vendor/` (Vue e Dexie locais).
- **Convenções**: nomes e comentários em português. Esquemas do conteúdo e regras pedagógicas: `original-deepseek/script-gerador-conteudo.md`. `original-deepseek/` é só consulta, não editar.
- **Pendências** (só o que falta; feito vai para `HISTORICO.md`): Fase 9 do `PLANO.md`, nesta ordem: 9.5 enunciados longos de LP (53) · 9.6 figuras na Matemática nível 1 (25) · 9.7 Monte a Palavra, Memória e Som e Figura no kit `rodada.js`. Contínua: Fase 5 (uso real, anotar em `NOTAS.md`). Guardado: voz passos 3 e 4 (ver `PLANO.md`).
- **Ao concluir um item**: movê-lo para `HISTORICO.md` (com a data) e tirá-lo do `PLANO.md` e desta lista, no mesmo commit.
- **Referências visuais**: mascote em `js/mascote.js` (`mascote('normal'|'feliz'|'festa')`; trocar o bicho = refazer só esse arquivo); celebrações em `js/telas/selonovo.js` (teste `t_celebracoes`); tablet em `css/tablet.css`; capturas `node build/capturas.js [tablet]` → `build/previas/capturas-*.png`; regras de CSS em `css/CLAUDE.md`.
- **Voz**: `js/voz.js` (voz natural, frase por frase; escolha da voz nos Ajustes; teste `testes/t_voz.js`).
- **Público**: o dono é professor e não programa; explicar em português simples.

> Mantenha esta seção curta. Regras de um domínio vão no `CLAUDE.md` do subdiretório.

---

## 1. Modularização e Limite de Tamanho de Arquivo

- **Limite**: nenhum arquivo de código acima de **300 linhas**; ideal abaixo de **200**.
- **Ação corretiva**: ao ler um arquivo acima do limite, a primeira tarefa é **propor um plano de modularização** antes de qualquer outra edição.
- **Arquivos de dados** (linhas longas, gerados, bancos): o critério é o tamanho, não as linhas. Nunca ler inteiro; localizar com `grep` e ler só o trecho. Se as linhas forem enormes (o `grep` traz tudo), usar o **motor de item único** (seção 8): nunca ler nem dar `grep` nesses arquivos.
- **Exceções toleradas**: nenhuma.
- **Novas funcionalidades**: já nascem em módulos pequenos, uma responsabilidade por arquivo.

## 2. Hierarquia de Contexto (CLAUDE.md)

- **Raiz**: só regras globais, comandos e convenções.
- **Subdiretórios**: um `CLAUDE.md` por pasta-chave, com as regras daquele domínio e suas exceções locais.
- **Concisão**: bullets e cabeçalhos; nada de prosa longa.

## 3. Edição e Leitura de Código

- **Edições cirúrgicas**: editar o trecho, não reescrever o arquivo.
- **Leitura sob demanda**: só os arquivos/trechos da tarefa, com `grep` e intervalos de linhas. O dono pode indicar arquivos com `@nome`.
- **Plano antes do código**: em tarefas complexas, descrever os passos e validar com o dono antes de mexer.
- **Motores para tarefas repetitivas**: se uma tarefa se repete (gerar, converter, conferir ou corrigir em lote), criar um script (motor) que a faça, em vez de refazê-la à mão a cada vez; depois, só rodar o motor e ler o resumo da saída (tipos na seção 8).

## 4. Higiene de Comandos

- **Silenciar** comandos barulhentos (`-q`, `--silent`) ou filtrar (`| grep -E "(FAIL|PASS|Error)"`).
- **Saída concisa**: nunca despejar logs inteiros no contexto.

## 5. Protocolo de Sessão

- **Mudança de assunto** → lembrar o dono de usar `/clear`.
- **Mesma tarefa, conversa longa** → sugerir `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`).
- Só o dono pode executar `/clear` e `/compact`.
- **Modelo indicado** (acordo com o dono, 19/11/2026): ao receber cada tarefa, dizer em uma linha qual modelo basta e por quê, antes de começar:
  - **Haiku**: trocar texto, valor, cor; dúvida rápida; rodar um comando ou motor pronto.
  - **Sonnet**: criar ou ajustar uma tela/atividade, corrigir erro comum, gerar conteúdo seguindo molde.
  - **Opus**: planejar, decidir estrutura, criar motor novo, erro difícil, mudança em vários arquivos.
  - Se o modelo atual for maior que o necessário, sugerir `/model` para trocar; o dono decide.

## 6. Vigia de Contexto

- **Alertar** quando: um arquivo em edição se aproxima de 300 linhas; a conversa acumula informação repetida; houver releitura desnecessária; a mesma tarefa for feita à mão pela 2ª ou 3ª vez (propor um motor, seção 8).
- **Como**: uma frase com o motivo + a ação (`/compact`, `/clear` ou modularizar).
- **Regra de ouro**: nunca editar arquivo acima do limite sem **perguntar** antes. A decisão é sempre do dono.

## 7. Manutenção deste Arquivo

- Manter abaixo de **200 linhas**; o excedente vai para os `CLAUDE.md` dos subdiretórios.
- Revisar a cada mudança estrutural (nova stack, módulo ou fluxo de build).

## 8. Motores e Automações

Motor = script que faz o trabalho pesado e devolve só um resumo curto. Criar quando a tarefa se repete; propor ao dono antes (plano aprovado), registrar em "Comandos úteis" (seção 0) e manter cada motor pequeno (seção 1). Tipos que valem a pena:

- **Comando único de build**: um script que roda tudo em ordem (montar, versionar, validar, gerar docs), cada etapa com `| tail -2`.
- **Validador/auditor**: confere dados em lote (formato, cálculo, unidades, links) e lista só os erros.
- **Gerador de conteúdo**: cria itens novos (questões, páginas, registros) a partir de dados mínimos, já conferidos.
- **Motor de teoria e de cálculo** (projetos com questões): um motor de cada tipo para todas as áreas + uma ficha de dados por área (erros típicos e ideias erradas comuns). Calibrar = editar a ficha. Receita: `motor-teoria.md` do protocolo-token.
- **Moldes e kit de peças**: partes prontas reaproveitáveis; o novo se monta com elas, nunca recopiando código.
- **Catálogo/índice**: gera um `.md` curto do que já existe (chave + frase), para achar o que reaproveitar sem abrir arquivos grandes.
- **Extrator de dados**: exporta só o pedaço necessário (ex.: JSON de um banco), em vez de ler o arquivo inteiro.
- **Motor de item único** (dados em linhas enormes): mostra um item pelo id (`ID`, `-c campos`), busca por texto (`--busca`), altera (`campo=texto`, `campo:=json`, `-x campo`) trocando só o trecho do item, com teste guardado. Receita: `motor-questao.md` do protocolo-token.
- **Correção em lote**: acha e corrige um mesmo erro em todos os arquivos de uma vez.
- **Gerados automáticos**: versão, tabelas do README, listas; nunca editar à mão (anotar na seção 0).
- **Testes guardados**: todo teste criado numa tarefa vira arquivo permanente (um por assunto, ex.: `testes/t_<assunto>`), nunca descartável. Antes de criar, procurar um teste existente e ampliá-lo; não reescrever testes que já existem.
- **Testes seletivos**: um mapa "arquivo alterado → testes ligados" escolhe só os testes fundamentais da tarefa (incluído ou modificado); teste novo entra no mapa na hora. Suíte completa só no fim da tarefa ou antes de publicar.
- **Ajudantes comuns de teste**: abrir navegador, simular serviço externo etc. num só módulo usado por todos os testes.
- **Revisão em lote**: capturas/relatórios de muitos itens de uma vez, em vez de um por um.
- **Memória do projeto**: listas de ideias e pendências (`IDEIAS.md`, `NOTAS.md`) para não redescobrir decisões. Quando passarem de ~150 linhas, mover o que já foi feito para um arquivo de histórico.
- **Travas e barra**: `.claude/settings.json` + `.claude/hooks/` impedem ler dados enormes direto e mostram o % do contexto usado (receita: `travas-e-barra.md` do protocolo-token).
- **Instalado aqui**: barra de contexto (`.claude/settings.json` + `.claude/hooks/barra-contexto.sh`). Motor de item único: `build/item.js` (lp, mat, historias, colorir, silabas, ordem). Trava de dados (23/11): `.claude/hooks/bloquear-bancos.sh` + `permissions.deny` barram ler `conteudo/colorir.js` e `historias.js` direto.

## 9. Recursos de Apoio (criar quando o projeto pedir)

- **Modelos e exemplos**: esqueletos gerados por comando e uma pasta `exemplos/`; começar copiando, nunca do zero.
- **Cache de consultas externas**: guardar páginas/respostas da internet já consultadas e reusá-las, em vez de buscar de novo.
- **Lista de fontes confiáveis**: arquivo com os sites aceitos; dispensa pesquisar fontes a cada tarefa.
- **Registro do que já foi feito**: arquivo (ex.: `.jsonl`) com os itens já aplicados; não refazer nem reconferir.
- **Guias passo a passo**: receitas curtas em `.md` para cada processo repetido; seguir a receita em vez de redescobrir.
- **Fonte única da verdade**: cada lista (itens, páginas, configurações) num só arquivo, lido por todos os scripts.
- **Relatórios em arquivo**: saída longa vai para um `.md`/`.txt`; na conversa, só o resumo.


## 10. Dicas para o Dono (lembrar quando couber, em uma frase)

- Uma tarefa por conversa; `/clear` ao trocar de assunto.
- Indicar o arquivo com `@nome` quando souber qual é.
- Pedidos diretos ("faça X em Y"); responder "sim"/"não" às perguntas basta.
- Tarefa simples (corrigir um texto, trocar um valor): `/model` com Sonnet ou Haiku; Opus para planos e tarefas difíceis.
- Olhar a barra de contexto embaixo: perto de 50%, `/compact`; ao terminar o assunto, `/clear`.
- Decisões tomadas ficam anotadas (`NOTAS.md`), para não serem perguntadas de novo.

