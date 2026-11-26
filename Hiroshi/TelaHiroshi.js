document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================

  const NOME_PERSONAGEM = "Hiroshi, o Último Samurai";

  // Caminho para retornar à seleção de personagens.
  const PAGINA_ANTERIOR = "../TelaEscolherPersonagem.html";

  // Caminho da próxima tela após escolher o personagem.
  const PROXIMA_PAGINA = "CarregamentoHiroshi.html";

  // ==========================================
  // ELEMENTOS
  // ==========================================

  const btnVoltar = document.getElementById("btnVoltar");
  const btnEscolher = document.getElementById("btnEscolher");

  // ==========================================
  // BOTÃO VOLTAR
  // ==========================================

  btnVoltar.addEventListener("click", () => {
    window.location.href = PAGINA_ANTERIOR;
  });

  // ==========================================
  // ESCOLHER PERSONAGEM
  // ==========================================

  btnEscolher.addEventListener("click", () => {
    localStorage.setItem("personagemSelecionado", NOME_PERSONAGEM);

    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = PROXIMA_PAGINA;
    }, 800);
  });
});
