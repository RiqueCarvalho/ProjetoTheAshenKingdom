
document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // CONFIGURAÇÃO DOS ÁUDIOS
  // =========================================

  const audios = {
    tela1: "./Capitulo1.mp3",
    tela2: "./Capitulo2.mp3",
    tela3: "./Capitulo3.mp3",
  };

  // =========================================
  // CONFIGURAÇÕES
  // =========================================

  const narrador = new Audio();

  narrador.volume = 1;

  let telaAtual = "tela1";
  let narracaoIniciada = false;
  let narracaoConcluida = false;

  const statusNarracao = document.getElementById("statusNarracao");

  // =========================================
  // ATUALIZAR STATUS
  // =========================================

  function atualizarStatus(mensagem) {
    if (statusNarracao) {
      statusNarracao.textContent = mensagem;
    }
  }

  // =========================================
  // ATUALIZAR BOTÕES
  // =========================================

  function atualizarBotoes() {
    const tela = document.getElementById(telaAtual);

    if (!tela) return;

    const btnIniciar = tela.querySelector(".btn-iniciar-narracao");
    const btnProximo = tela.querySelector(".btn-proximo");
    const btnJogo = tela.querySelector(".btn-iniciar-jogo");

    if (btnIniciar) {
      btnIniciar.style.display = narracaoIniciada ? "none" : "flex";
    }

    if (btnProximo) {
      btnProximo.disabled = !narracaoConcluida;
    }

    if (btnJogo) {
      btnJogo.disabled = !narracaoConcluida;
    }
  }

  // =========================================
  // INICIAR NARRAÇÃO
  // =========================================

  async function iniciarNarracao() {
    if (narracaoIniciada) return;

    const caminhoAudio = audios[telaAtual];

    if (!caminhoAudio) {
      atualizarStatus("⚠️ Áudio não encontrado.");

      console.error("Áudio não configurado:", telaAtual);

      return;
    }

    narracaoIniciada = true;

    narracaoConcluida = false;

    atualizarBotoes();

    narrador.src = caminhoAudio;

    narrador.load();

    atualizarStatus("🎙️ Optimus Prime está narrando...");

    try {
      // A reprodução é solicitada diretamente no clique
      // para respeitar a política do navegador.

      await narrador.play();

      console.log("Narração iniciada:", caminhoAudio);
    } catch (erro) {
      console.error("Erro ao iniciar narração:", erro);

      narracaoIniciada = false;

      atualizarBotoes();

      if (erro.name === "NotAllowedError") {
        atualizarStatus("🔊 Clique em INICIAR NARRAÇÃO.");
      } else {
        atualizarStatus("❌ Não foi possível reproduzir o áudio.");
      }
    }
  }

  // =========================================
  // TROCAR CAPÍTULO
  // =========================================

  window.mudarTela = function (idProximaTela) {
    const telaDestino = document.getElementById(idProximaTela);

    if (!telaDestino) return;

    // Impede avançar antes do fim da narração

    if (!narracaoConcluida) return;

    narrador.pause();

    narrador.currentTime = 0;

    document.querySelectorAll(".tela-jogo").forEach((tela) => {
      tela.classList.remove("ativa");
    });

    telaDestino.classList.add("ativa");

    telaAtual = idProximaTela;

    narracaoIniciada = false;

    narracaoConcluida = false;

    atualizarStatus("🎙️ Narrador: Optimus Prime");

    atualizarBotoes();
  };

  // =========================================
  // CLIQUE EM INICIAR NARRAÇÃO
  // =========================================

  document.querySelectorAll(".btn-iniciar-narracao").forEach((botao) => {
    botao.addEventListener("click", iniciarNarracao);
  });

  // =========================================
  // CLIQUE EM PRÓXIMO
  // =========================================

  document.querySelectorAll(".btn-proximo").forEach((botao) => {
    botao.addEventListener("click", () => {
      if (!narracaoConcluida) return;

      const proximaTela = telaAtual === "tela1" ? "tela2" : "tela3";

      window.mudarTela(proximaTela);
    });
  });

  // =========================================
  // FINALIZAR HISTÓRIA E IR PARA ARENA I
  // =========================================

  const btnIniciarJogo = document.querySelector(".btn-iniciar-jogo");

  if (btnIniciarJogo) {
    btnIniciarJogo.addEventListener("click", () => {
      if (!narracaoConcluida) return;

      narrador.pause();

      narrador.currentTime = 0;

      // Transição de tela
      document.body.style.transition = "opacity 0.8s ease";
      document.body.style.opacity = "0";

      // Redireciona para a Arena I
      setTimeout(() => {
        window.location.href = "../Arenas/TelaArenaI.html";
      }, 800);
    });
  }

  // =========================================
  // NARRAÇÃO TERMINOU
  // =========================================

  narrador.addEventListener("ended", () => {
    narracaoConcluida = true;

    atualizarBotoes();

    atualizarStatus("✅ Narração concluída! Você pode avançar.");

    console.log("Narração finalizada:", telaAtual);
  });

  // =========================================
  // ERRO NO ÁUDIO
  // =========================================

  narrador.addEventListener("error", () => {
    narracaoIniciada = false;

    narracaoConcluida = false;

    atualizarBotoes();

    atualizarStatus("❌ Erro ao carregar o MP3.");

    console.error("Erro no áudio:", narrador.src);
  });

  // =========================================
  // INICIALIZAÇÃO
  // =========================================

  atualizarBotoes();

  atualizarStatus("🎙️ Narrador: Optimus Prime");
});
