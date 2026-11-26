document.addEventListener("DOMContentLoaded", () => {
  const btnVoltar = document.getElementById("btnVoltar");
  const btnEscolher = document.getElementById("btnEscolher");

  // Altere para o caminho da tela anterior.
  const TELA_ANTERIOR = "../TelaEscolherPersonagem.html";

  // Altere para o caminho da próxima tela após escolher o personagem.
  const PROXIMA_TELA = "CarregamentoRonin.html";

  // BOTÃO VOLTAR
  btnVoltar.addEventListener("click", () => {
    window.location.href = TELA_ANTERIOR;
  });

  // BOTÃO ESCOLHER
  btnEscolher.addEventListener("click", () => {
    localStorage.setItem("personagemSelecionado", "Kurogane no Oni");

    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = PROXIMA_TELA;
    }, 800);
  });
});
