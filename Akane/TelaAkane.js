document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // BOTÃO VOLTAR
    // =========================================

    const btnVoltar = document.getElementById("btnVoltar");

    btnVoltar.addEventListener("click", () => {

        window.location.href = "../TelaEscolherPersonagem.html";

    });


    // =========================================
    // ESCOLHER PERSONAGEM
    // =========================================

    const btnEscolher = document.getElementById("btnEscolher");

    btnEscolher.addEventListener("click", () => {

        // Salva o personagem escolhido
        localStorage.setItem("personagemSelecionado", "Akane no Yuki");

        localStorage.setItem("nomePersonagem", "Akane Hoshikage");

        localStorage.setItem("tituloPersonagem", "A Assassina da Neve Sangrenta");

        // Efeito de transição
        document.body.style.transition = "opacity 0.8s ease";

        document.body.style.opacity = "0";

        // Redirecionamento
        setTimeout(() => {

            window.location.href = "CarregamentoAkane.html";

        }, 800);

    });

});