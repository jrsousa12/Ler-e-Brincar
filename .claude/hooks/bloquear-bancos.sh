#!/bin/bash
# Trava: impede ler os dados de linhas enormes com cat/grep/sed etc. (gasta muitos tokens).
# Usar o motor de item único: node build/item.js <id> | --busca texto
PADRAO='conteudo/(colorir|historias)\.js|conteudo/\*|conteudo/? *$'
cmd=$(jq -r '.tool_input.command // ""')
if echo "$cmd" | grep -qE '\b(cat|grep|rg|sed|head|tail|less|more|awk|cut)\b' &&
   echo "$cmd" | grep -qE "$PADRAO"; then
  echo "Bloqueado: não ler conteudo/colorir.js nem historias.js direto. Use: node build/item.js <id> (ou --busca texto)" >&2
  exit 2
fi
exit 0
