
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const CAMINHO_MUSICA = "musica_arena.mp3";

    const CHAVE_MUSICA = "ashenMusicaArenaAtiva";
    const CHAVE_TEMPO = "ashenMusicaArenaTempo";

    const pagina = window.location.pathname;

    const arenaI = pagina.endsWith("TelaArenaI.html");
    const arenaII = pagina.endsWith("TelaArenaII.html");
    const arenaIII = pagina.endsWith("TelaArenaIII.html");

    const musica = new Audio(CAMINHO_MUSICA);

    musica.loop = true;
    musica.volume = 0.4;

    let musicaLiberada = false;

    // ==========================================
    // ARENA I: INICIAR NOVA SEQUÊNCIA
    // ==========================================

    if (arenaI) {
        localStorage.setItem(CHAVE_MUSICA, "true");
        localStorage.setItem(CHAVE_TEMPO, "0");
    }

    const musicaAtiva =
        localStorage.getItem(CHAVE_MUSICA) === "true";

    const tempoSalvo =
        Number(localStorage.getItem(CHAVE_TEMPO)) || 0;

    // ==========================================
    // PREPARAR POSIÇÃO DA MÚSICA
    // ==========================================

    musica.addEventListener("loadedmetadata", () => {

        if (!arenaI && musicaAtiva && tempoSalvo < musica.duration) {
            musica.currentTime = tempoSalvo;
        }

    });

    // ==========================================
    // INICIAR MÚSICA APÓS INTERAÇÃO
    // ==========================================

    function iniciarMusica() {

        if (musicaLiberada) return;

        musicaLiberada = true;

        if (localStorage.getItem(CHAVE_MUSICA) !== "true") {
            return;
        }

        musica.play().catch(erro => {
            musicaLiberada = false;
            console.log("Erro ao iniciar música:", erro);
        });

    }

    // Primeiro clique ou tecla na Arena I
    function liberarMusica() {

        if (
            arenaI ||
            arenaII ||
            arenaIII
        ) {
            iniciarMusica();
        }

    }

    document.addEventListener("click", liberarMusica, { once: true });
    document.addEventListener("keydown", liberarMusica, { once: true });

    // ==========================================
    // SALVAR POSIÇÃO AO TROCAR DE ARENA
    // ==========================================

    window.addEventListener("beforeunload", () => {

        if (
            localStorage.getItem(CHAVE_MUSICA) === "true" &&
            !musica.paused
        ) {
            localStorage.setItem(CHAVE_TEMPO, musica.currentTime);
        }

    });

    // ==========================================
    // PARAR MÚSICA AO TERMINAR ARENA III
    // ==========================================

    window.pararMusicaArena = () => {

        musica.pause();
        musica.currentTime = 0;

        localStorage.setItem(CHAVE_MUSICA, "false");
        localStorage.setItem(CHAVE_TEMPO, "0");

    };

});
