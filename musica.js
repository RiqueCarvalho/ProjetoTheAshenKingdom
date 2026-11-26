
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES DA MÚSICA
    // ==========================================

    const CAMINHO_MUSICA = "musica_geral.mp3";

    const CHAVE_MUSICA = "ashenMusicaAtiva";
    const CHAVE_TEMPO = "ashenMusicaTempo";

    const musica = new Audio(CAMINHO_MUSICA);

    musica.loop = true;
    musica.volume = 0.4;

    // ==========================================
    // RECUPERAR POSIÇÃO DA MÚSICA
    // ==========================================

    const musicaAtiva = localStorage.getItem(CHAVE_MUSICA);
    const tempoSalvo = Number(localStorage.getItem(CHAVE_TEMPO)) || 0;

    musica.addEventListener("loadedmetadata", () => {

        if (tempoSalvo < musica.duration) {
            musica.currentTime = tempoSalvo;
        }

        // Se a música já estava ativa, continuar tocando
        if (musicaAtiva === "true") {
            iniciarMusica();
        }

    });

    // ==========================================
    // INICIAR MÚSICA
    // ==========================================

    function iniciarMusica() {

        localStorage.setItem(CHAVE_MUSICA, "true");

        musica.play().catch((erro) => {
            console.log("O navegador aguarda uma interação para tocar a música:", erro);
        });

    }

    // ==========================================
    // PRIMEIRO CLIQUE DO JOGADOR
    // ==========================================

    document.addEventListener("click", () => {

        if (musica.paused) {
            iniciarMusica();
        }

    }, { once: true });

    // ==========================================
    // SALVAR POSIÇÃO ANTES DE TROCAR DE PÁGINA
    // ==========================================

    window.addEventListener("beforeunload", () => {

        localStorage.setItem(CHAVE_TEMPO, musica.currentTime);

    });

    // ==========================================
    // FINALIZAR MÚSICA
    // ==========================================

    window.pararMusicaAshen = () => {

        musica.pause();

        localStorage.setItem(CHAVE_MUSICA, "false");
        localStorage.setItem(CHAVE_TEMPO, "0");

    };

});
