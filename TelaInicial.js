document.addEventListener("DOMContentLoaded", () => {

    const btnNovoJogo = document.getElementById("btnNovoJogo");
    const btnConfiguracoes = document.getElementById("btnConfiguracoes");
    const btnCreditos = document.getElementById("btnCreditos");

    const modal = document.getElementById("modalConfiguracoes");

    const btnCancelar = document.getElementById("btnCancelar");
    const btnSalvar = document.getElementById("btnSalvar");

    const brilho = document.getElementById("brilho");
    const audio = document.getElementById("audio");
    const legendas = document.getElementById("legendas");

    const tela = document.querySelector(".tela-inicial");


    // =====================================
    // NOVO JOGO
    // =====================================

    btnNovoJogo.addEventListener("click", () => {
        window.location.href = "TelaInicial2.html";
    });


    // =====================================
    // CRÉDITOS
    // =====================================

    btnCreditos.addEventListener("click", () => {
        window.location.href = "TelaCreditos.html";
    });


    // =====================================
    // ABRIR CONFIGURAÇÕES
    // =====================================

    btnConfiguracoes.addEventListener("click", () => {
        modal.classList.add("aberto");
    });


    // =====================================
    // FECHAR CONFIGURAÇÕES
    // =====================================

    function fecharConfiguracoes() {
        modal.classList.remove("aberto");
    }

    btnCancelar.addEventListener("click", fecharConfiguracoes);


    // =====================================
    // SALVAR CONFIGURAÇÕES
    // =====================================

    btnSalvar.addEventListener("click", () => {

        const configuracoes = {
            brilho: brilho.value,
            audio: audio.value,
            legendas: legendas.value
        };

        localStorage.setItem(
            "ashen-cfg",
            JSON.stringify(configuracoes)
        );

        tela.style.filter = `brightness(${brilho.value})`;

        fecharConfiguracoes();

    });


    // =====================================
    // CARREGAR CONFIGURAÇÕES
    // =====================================

    try {

        const salvas = JSON.parse(
            localStorage.getItem("ashen-cfg") || "{}"
        );

        if (salvas.brilho) {
            brilho.value = salvas.brilho;
            tela.style.filter = `brightness(${salvas.brilho})`;
        }

        if (salvas.audio) {
            audio.value = salvas.audio;
        }

        if (salvas.legendas) {
            legendas.value = salvas.legendas;
        }

    } catch (erro) {
        console.log("Não foi possível carregar as configurações.");
    }


    // =====================================
    // FECHAR CLICANDO FORA
    // =====================================

    modal.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            fecharConfiguracoes();
        }

    });


    // =====================================
    // FECHAR COM ESC
    // =====================================

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            fecharConfiguracoes();
        }

    });

});