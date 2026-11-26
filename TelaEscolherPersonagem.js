document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ELEMENTOS
  // ==========================================

  const slots = document.querySelectorAll(".personagem-slot");

  const btnVoltar = document.getElementById("btn-voltar");

  const modal = document.getElementById("modal-confirmacao");
  const modalTexto = document.getElementById("modal-texto");

  const btnConfirmarInicio = document.getElementById("btn-confirmar-inicio");
  const btnCancelar = document.getElementById("btn-cancelar");

  // ==========================================
  // PERSONAGENS E DESTINOS
  // ==========================================

  const personagens = {
    1: {
      nome: "Samurai Sombrio",
      pagina: "./Akane/TelaAkane.html",
      abrirDiretamente: true,
    },

    2: {
      nome: "Guerreiro das Foices",
      pagina: "./Hiroshi/TelaHiroshi.html",
      abrirDiretamente: false,
    },

    3: {
      nome: "Hiroshi, o Último Samurai",
      pagina: "./Ronin/TelaKurogane.html",
      abrirDiretamente: false,
    },
  };

  // ==========================================
  // VARIÁVEIS
  // ==========================================

  let personagemSelecionado = null;

  // ==========================================
  // EFEITO SONORO DE HOVER
  // ==========================================

  function tocarSomHover() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const audio = new AudioContext();

      const oscilador = audio.createOscillator();
      const volume = audio.createGain();

      oscilador.connect(volume);
      volume.connect(audio.destination);

      oscilador.type = "sine";

      oscilador.frequency.setValueAtTime(600, audio.currentTime);

      volume.gain.setValueAtTime(0.04, audio.currentTime);

      volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08);

      oscilador.start();
      oscilador.stop(audio.currentTime + 0.08);

      oscilador.onended = () => audio.close();
    } catch (erro) {
      console.warn("Erro ao reproduzir som:", erro);
    }
  }

  // ==========================================
  // TRANSIÇÃO DE PÁGINA
  // ==========================================

  function irParaPagina(pagina) {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = pagina;
    }, 800);
  }

  // ==========================================
  // SELECIONAR PERSONAGEM
  // ==========================================

  function selecionarPersonagem(slot) {
    const botao = slot.querySelector(".btn-selecionar");

    if (!botao) return;

    const id = botao.dataset.id;

    const personagem = personagens[id];

    if (!personagem) return;

    personagemSelecionado = personagem;

    // Salva o personagem selecionado
    localStorage.setItem("personagemSelecionado", personagem.nome);

    // Remove a seleção dos outros personagens
    slots.forEach((item) => {
      item.classList.remove("ativo");
    });

    // Ativa o personagem escolhido
    slot.classList.add("ativo");

    // ======================================
    // SAMURAI SOMBRIO
    // ======================================

    if (personagem.abrirDiretamente) {
      irParaPagina(personagem.pagina);
      return;
    }

    // ======================================
    // DEMAIS PERSONAGENS: ABRIR MODAL
    // ======================================

    modalTexto.textContent = `Você escolheu ${personagem.nome}. Deseja iniciar sua jornada?`;

    modal.classList.remove("hidden");
  }

  // ==========================================
  // EVENTOS DOS PERSONAGENS
  // ==========================================

  slots.forEach((slot) => {
    // Clique no personagem ou no botão
    slot.addEventListener("click", () => {
      selecionarPersonagem(slot);
    });

    // Som ao passar o mouse
    slot.addEventListener("mouseenter", () => {
      tocarSomHover();
    });
  });

  // ==========================================
  // BOTÃO VOLTAR
  // ==========================================

  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      irParaPagina("./TelaInicial2.html");
    });
  }

  // ==========================================
  // CONFIRMAR JORNADA
  // ==========================================

  btnConfirmarInicio.addEventListener("click", () => {
    if (!personagemSelecionado) return;

    // Salva novamente o personagem escolhido
    localStorage.setItem("personagemSelecionado", personagemSelecionado.nome);

    // Abre a página correspondente ao personagem
    irParaPagina(personagemSelecionado.pagina);
  });

  // ==========================================
  // CANCELAR / TROCAR PERSONAGEM
  // ==========================================

  btnCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");

    slots.forEach((slot) => {
      slot.classList.remove("ativo");
    });

    personagemSelecionado = null;

    localStorage.removeItem("personagemSelecionado");
  });
});
