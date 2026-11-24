// Tela "Cópia de segurança" (na Área do responsável): baixar e importar o progresso.
LB.usarBackup = function (ctx) {
  'use strict';
  const { ref, computed } = Vue;
  const avisoCopia = ref('');

  // Lembrete: "Última cópia há X dias" (a data fica nos ajustes, `ultimaCopia`).
  const lembreteCopia = computed(() => LB.backup.lembrete(ctx.ajustes.value.ultimaCopia));

  async function baixarCopia() {
    const agora = new Date().toISOString();
    const texto = LB.backup.gerar(ctx.estadoAtual(), await LB.tentativas.todas(), agora);
    const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = LB.backup.nomeArquivo(agora);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    ctx.ajustes.value = { ...ctx.ajustes.value, ultimaCopia: agora };
    avisoCopia.value = '✓ Cópia baixada. Guarde o arquivo num lugar seguro.';
  }

  // Recebe o texto do arquivo (separado do evento para os testes chamarem direto).
  async function importarTexto(texto) {
    const r = LB.backup.ler(texto);
    if (!r.ok) { avisoCopia.value = '⚠️ ' + r.erro; return false; }
    const quando = r.data ? ' de ' + new Date(r.data).toLocaleDateString('pt-BR') : '';
    const sim = await ctx.perguntar({
      titulo: 'Trocar o progresso?',
      texto: 'O progresso deste aparelho será trocado pela cópia' + quando + '. Isso não pode ser desfeito.',
      sim: 'Trocar', perigo: true
    });
    if (!sim) { avisoCopia.value = ''; return false; }
    ctx.aplicarEstado(r.estado);
    await LB.tentativas.substituir(r.tentativas);
    avisoCopia.value = '✓ Progresso trazido da cópia.';
    return true;
  }

  async function importarCopia(evento) {
    const arq = evento.target.files && evento.target.files[0];
    evento.target.value = '';
    if (arq) await importarTexto(await arq.text());
  }

  return { avisoCopia, lembreteCopia, baixarCopia, importarCopia, importarTexto };
};
