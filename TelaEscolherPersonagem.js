document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ELEMENTOS DA TELA
  // ==========================================

  const slots = document.querySelectorAll(".personagem-slot");
  const botoesSelecionar = document.querySelectorAll(".btn-selecionar");

  const btnVoltar = document.getElementById("btn-voltar");

  const modal = document.getElementById("modal-confirmacao");
  const modalTexto = document.getElementById("modal-texto");

  const btnConfirmarInicio = document.getElementById("btn-confirmar-inicio");
  const btnCancelar = document.getElementById("btn-cancelar");

  let personagemEscolhido = null;

  // ==========================================
  // CAMINHOS DAS TELAS DOS PERSONAGENS
  // ==========================================

  const PAGINA_AKANE = "./Akane/TelaAkane.html";

  const PAGINA_RONIN = "./Ronin/TelaKurogane.html";

  const PAGINA_JOGO = "./Jogo.html";

  // ==========================================
  // EFEITO SONORO AO PASSAR O MOUSE
  // ==========================================

  function tocarSomHover() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";

      osc.frequency.setValueAtTime(320, ctx.currentTime);

      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // ==========================================
  // REDIRECIONAMENTO DOS PERSONAGENS
  // ==========================================

  function abrirTelaPersonagem(nome, caminho) {
    localStorage.setItem("personagemSelecionado", nome);

    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = caminho;
    }, 800);
  }

  // ==========================================
  // VERIFICAR PERSONAGEM CLICADO
  // ==========================================

  function verificarPersonagem(slot) {
    const personagem = slot.dataset.personagem;

    // SAMURAI SOMBRIO
    if (personagem === "Samurai Sombrio") {
      abrirTelaPersonagem("Samurai Sombrio", PAGINA_AKANE);

      return;
    }

    // RONIN ESCARLATE - SLOT 3 (VERMELHO)
    if (personagem === "Ronin Escarlate") {
      abrirTelaPersonagem("Ronin Escarlate", PAGINA_RONIN);

      return;
    }

    // DEMAIS PERSONAGENS
    selecionarPersonagem(slot);
  }

  // ==========================================
  // CLIQUE NOS PERSONAGENS
  // ==========================================

  slots.forEach((slot) => {
    slot.addEventListener("mouseenter", () => {
      tocarSomHover();
    });

    slot.addEventListener("click", () => {
      verificarPersonagem(slot);
    });
  });

  // ==========================================
  // BOTÕES SELECIONAR
  // ==========================================

  botoesSelecionar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const slot = btn.closest(".personagem-slot");

      verificarPersonagem(slot);
    });
  });

  // ==========================================
  // SELECIONAR PERSONAGEM PELO MODAL
  // ==========================================

  function selecionarPersonagem(slot) {
    slots.forEach((s) => {
      s.classList.remove("ativo");
    });

    slot.classList.add("ativo");

    personagemEscolhido = slot.dataset.personagem;

    modalTexto.textContent = `Você escolheu: ${personagemEscolhido}. Deseja continuar?`;

    modal.classList.remove("hidden");
  }

  // ==========================================
  // BOTÃO VOLTAR
  // ==========================================

  btnVoltar.addEventListener("click", () => {
    window.location.href = "TelaInicial.html";
  });

  // ==========================================
  // CONFIRMAR ESCOLHA
  // ==========================================

  btnConfirmarInicio.addEventListener("click", () => {
    if (!personagemEscolhido) return;

    localStorage.setItem("personagemSelecionado", personagemEscolhido);

    window.location.href = PAGINA_JOGO;
  });

  // ==========================================
  // CANCELAR ESCOLHA
  // ==========================================

  btnCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");

    slots.forEach((slot) => {
      slot.classList.remove("ativo");
    });

    personagemEscolhido = null;
  });
});
