document.addEventListener("DOMContentLoaded", () => {

    const btnEscolherPersonagem =
        document.getElementById("btnEscolherPersonagem");

    const btnMercado =
        document.getElementById("btnMercado");


    // =====================================
    // ESCOLHER PERSONAGEM
    // =====================================

    btnEscolherPersonagem.addEventListener("click", () => {

        window.location.href = "TelaEscolherPersonagem.html";

    });


    // =====================================
    // MERCADO / LOJA
    // =====================================

    btnMercado.addEventListener("click", () => {

        window.location.href = "TelaLoja.html";

    });

});