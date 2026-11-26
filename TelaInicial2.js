
document.addEventListener("DOMContentLoaded", () => {

    const btnEscolherPersonagem =
        document.getElementById("btnEscolherPersonagem");

    const btnMercado =
        document.getElementById("btnMercado");

    const modalMercado =
        document.getElementById("modalMercado");

    const btnOkMercado =
        document.getElementById("btnOkMercado");


    // =====================================
    // ÁUDIO DO GALVÃO BUENO
    // =====================================

    const narracaoGalvao = new Audio("GalvaoBueno.mp3");

    narracaoGalvao.volume = 1;


    // =====================================
    // ESCOLHER PERSONAGEM
    // =====================================

    btnEscolherPersonagem.addEventListener("click", () => {

        narracaoGalvao.pause();
        narracaoGalvao.currentTime = 0;

        window.location.href = "TelaEscolherPersonagem.html";

    });


    // =====================================
    // MERCADO / LOJA
    // =====================================

    btnMercado.addEventListener("click", async () => {

        modalMercado.hidden = false;

        // Reinicia o áudio caso o usuário clique novamente.
        narracaoGalvao.pause();
        narracaoGalvao.currentTime = 0;

        try {

            await narracaoGalvao.play();

        } catch (erro) {

            console.error("Erro ao reproduzir o áudio do Galvão:", erro);

        }

    });


    // =====================================
    // BOTÃO OK
    // =====================================

    btnOkMercado.addEventListener("click", () => {

        modalMercado.hidden = true;

        narracaoGalvao.pause();
        narracaoGalvao.currentTime = 0;

    });


    // =====================================
    // FINALIZAÇÃO DO ÁUDIO
    // =====================================

    narracaoGalvao.addEventListener("ended", () => {

        narracaoGalvao.currentTime = 0;

    });

});
