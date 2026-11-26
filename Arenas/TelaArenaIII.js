
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const PAGINA_PROXIMA_ARENA = "../TelaCréditosFinais.html";

    const DIFICULDADE = {
        multiplicadorDanoHeroi: 1,
        multiplicadorDanoVilao: 1
    };

    const TEMPO_ENTRE_ACOES = 700;

    // ==========================================
    // ELEMENTOS HTML
    // ==========================================

    const elementos = {
        valorAtaque: document.getElementById("valorAtaque"),
        nomeUsuario: document.getElementById("nomeUsuario"),

        nomeHeroi: document.getElementById("nomeHeroi"),
        nomeVilao: document.getElementById("nomeVilao"),

        imagemHeroi: document.getElementById("imagemHeroi"),
        imagemVilao: document.getElementById("imagemVilao"),

        vidaHeroiTexto: document.getElementById("vidaHeroiTexto"),
        vidaVilaoTexto: document.getElementById("vidaVilaoTexto"),

        vidaHeroiBarra: document.getElementById("vidaHeroiBarra"),
        vidaVilaoBarra: document.getElementById("vidaVilaoBarra"),

        ladoHeroi: document.getElementById("ladoHeroi"),
        ladoVilao: document.getElementById("ladoVilao"),

        btnAtacar: document.getElementById("btnAtacar"),
        btnReiniciar: document.getElementById("btnReiniciar"),
        btnResultado: document.getElementById("btnResultado"),

        registroBatalha: document.getElementById("registroBatalha"),
        resultadoBatalha: document.getElementById("resultadoBatalha"),
        tituloResultado: document.getElementById("tituloResultado"),
        textoResultado: document.getElementById("textoResultado"),

        efeitosCombate: document.getElementById("efeitosCombate")
    };

    // ==========================================
    // CATÁLOGO E PERSONAGENS
    // ==========================================

    const catalogo = window.CatalogoAshenKingdom;

    if (!catalogo) {
        alert("Erro ao carregar o catálogo de personagens.");
        return;
    }

    const heroi = catalogo.obterHeroi();

    if (!heroi) {
        window.location.href = "../TelaEscolherPersonagem.html";
        return;
    }

    let vilao = catalogo.sortearVilao();

    if (!vilao) {
        alert("Não foi possível carregar um vilão para esta arena.");
        return;
    }

    // ==========================================
    // ATRIBUTOS
    // ==========================================

    const vidaMaximaHeroi = heroi.vida;
    const vidaMaximaVilao = vilao.vida;

    let vidaHeroi = vidaMaximaHeroi;
    let vidaVilao = vidaMaximaVilao;

    let batalhaEmAndamento = false;
    let batalhaFinalizada = false;

    // ==========================================
    // INFORMAÇÕES INICIAIS
    // ==========================================

    function carregarPersonagens() {

        elementos.nomeHeroi.textContent = heroi.nome;
        elementos.nomeVilao.textContent = vilao.nome;

        elementos.imagemHeroi.src = heroi.imagem;
        elementos.imagemVilao.src = vilao.imagem;

        elementos.valorAtaque.textContent = heroi.ataque;

        elementos.nomeUsuario.textContent =
            localStorage.getItem("ashenPersonagemNome") || heroi.nome;

        atualizarVida();
    }

    // ==========================================
    // ATUALIZAÇÃO DAS BARRAS DE VIDA
    // ==========================================

    function atualizarVida() {

        elementos.vidaHeroiTexto.textContent =
            `${vidaHeroi}/${vidaMaximaHeroi} HP`;

        elementos.vidaVilaoTexto.textContent =
            `${vidaVilao}/${vidaMaximaVilao} HP`;

        elementos.vidaHeroiBarra.style.width =
            `${(vidaHeroi / vidaMaximaHeroi) * 100}%`;

        elementos.vidaVilaoBarra.style.width =
            `${(vidaVilao / vidaMaximaVilao) * 100}%`;
    }

    // ==========================================
    // REGISTRO DA BATALHA
    // ==========================================

    function registrarMensagem(mensagem) {

        elementos.registroBatalha.textContent = mensagem;
        elementos.registroBatalha.scrollTop =
            elementos.registroBatalha.scrollHeight;
    }

    // ==========================================
    // CÁLCULO DE DANO
    // ==========================================

    function calcularDano(ataque, defesa, multiplicador) {

        return Math.max(
            1,
            Math.round((ataque - defesa) * multiplicador)
        );
    }

    // ==========================================
    // ANIMAÇÕES
    // ==========================================

    function animar(elemento, classe) {

        elemento.classList.remove(classe);

        void elemento.offsetWidth;

        elemento.classList.add(classe);

        setTimeout(() => {
            elemento.classList.remove(classe);
        }, 450);
    }

    // ==========================================
    // NÚMEROS DE DANO
    // ==========================================

    function mostrarDano(elemento, dano) {

        const numero = document.createElement("span");

        numero.classList.add("numero-dano");
        numero.textContent = `-${dano}`;

        const retangulo = elemento.getBoundingClientRect();

        numero.style.left =
            `${retangulo.left + retangulo.width / 2}px`;

        numero.style.top =
            `${retangulo.top + retangulo.height / 2}px`;

        elementos.efeitosCombate.appendChild(numero);

        setTimeout(() => {
            numero.remove();
        }, 900);
    }

    // ==========================================
    // ATAQUE DO HERÓI
    // ==========================================

    function atacarVilao() {

        const dano = calcularDano(
            heroi.ataque,
            vilao.defesa,
            DIFICULDADE.multiplicadorDanoHeroi
        );

        vidaVilao = Math.max(0, vidaVilao - dano);

        animar(elementos.imagemHeroi, "atacando");
        animar(elementos.ladoVilao, "recebendo-dano");

        mostrarDano(elementos.ladoVilao, dano);

        atualizarVida();

        registrarMensagem(
            `⚔ ${heroi.nome} atacou ${vilao.nome} e causou ${dano} de dano!`
        );

        if (vidaVilao <= 0) {
            animar(elementos.ladoVilao, "derrotado");
        }
    }

    // ==========================================
    // CONTRA-ATAQUE DO VILÃO
    // ==========================================

    function atacarHeroi() {

        const danoBase = calcularDano(
            vilao.ataque,
            heroi.defesa,
            DIFICULDADE.multiplicadorDanoVilao
        );

        // O vilão causa pelo menos 10 de dano.
        const dano = Math.max(10, danoBase);

        vidaHeroi = Math.max(0, vidaHeroi - dano);

        animar(elementos.imagemVilao, "atacando-vilao");
        animar(elementos.ladoHeroi, "recebendo-dano");

        mostrarDano(elementos.ladoHeroi, dano);

        atualizarVida();

        registrarMensagem(
            `💀 ${vilao.nome} contra-atacou ${heroi.nome} e causou ${dano} de dano!`
        );

        if (vidaHeroi <= 0) {
            animar(elementos.ladoHeroi, "derrotado");
        }
    }

    // ==========================================
    // FINALIZAÇÃO DA BATALHA
    // ==========================================

    function finalizarBatalha(vitoria) {

        batalhaFinalizada = true;
        batalhaEmAndamento = false;

        elementos.btnAtacar.disabled = true;
        elementos.resultadoBatalha.hidden = false;

        if (vitoria) {

            elementos.tituloResultado.textContent = "VITÓRIA!";

            elementos.textoResultado.textContent =
                `Você derrotou ${vilao.nome} e conquistou a Arena III! Prepare-se para o próximo desafio.`;

            elementos.btnResultado.textContent =
                "VER CRÉDITOS FINAIS";

            elementos.btnResultado.hidden = false;

            elementos.btnReiniciar.hidden = true;

        } else {

            elementos.tituloResultado.textContent = "DERROTA!";

            elementos.textoResultado.textContent =
                `${heroi.nome} foi derrotado por ${vilao.nome}. Tente novamente para conquistar a Arena III.`;

            elementos.btnResultado.hidden = true;

            elementos.btnReiniciar.hidden = false;
        }
    }

    // ==========================================
    // TURNO DE COMBATE
    // ==========================================

    async function executarTurno() {

        if (batalhaEmAndamento || batalhaFinalizada) {
            return;
        }

        batalhaEmAndamento = true;
        elementos.btnAtacar.disabled = true;

        // Herói ataca primeiro.
        atacarVilao();

        await new Promise(resolve =>
            setTimeout(resolve, TEMPO_ENTRE_ACOES)
        );

        // Verifica se o vilão foi derrotado.
        if (vidaVilao <= 0) {
            finalizarBatalha(true);
            return;
        }

        // Vilão contra-ataca.
        atacarHeroi();

        await new Promise(resolve =>
            setTimeout(resolve, TEMPO_ENTRE_ACOES)
        );

        // Verifica se o herói foi derrotado.
        if (vidaHeroi <= 0) {
            finalizarBatalha(false);
            return;
        }

        batalhaEmAndamento = false;
        elementos.btnAtacar.disabled = false;
    }

    // ==========================================
    // REINICIAR BATALHA
    // ==========================================

    function reiniciarBatalha() {

        vidaHeroi = vidaMaximaHeroi;
        vidaVilao = vidaMaximaVilao;

        batalhaEmAndamento = false;
        batalhaFinalizada = false;

        elementos.btnAtacar.disabled = false;

        elementos.btnReiniciar.hidden = true;
        elementos.resultadoBatalha.hidden = true;

        elementos.ladoHeroi.classList.remove(
            "derrotado",
            "recebendo-dano"
        );

        elementos.ladoVilao.classList.remove(
            "derrotado",
            "recebendo-dano"
        );

        elementos.imagemHeroi.classList.remove("atacando");
        elementos.imagemVilao.classList.remove("atacando-vilao");

        elementos.efeitosCombate.innerHTML = "";

        atualizarVida();

        registrarMensagem(
            `${heroi.nome} está pronto para tentar novamente na Arena III!`
        );
    }

    // ==========================================
    // EVENTOS DOS BOTÕES
    // ==========================================

    elementos.btnAtacar.addEventListener("click", executarTurno);

    elementos.btnReiniciar.addEventListener(
        "click",
        reiniciarBatalha
    );

    elementos.btnResultado.addEventListener("click", () => {

        if (batalhaFinalizada && vidaVilao <= 0) {
            window.location.href = PAGINA_PROXIMA_ARENA;
        }

    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    carregarPersonagens();

    registrarMensagem(
        `${heroi.nome} chegou à Arena III! ${vilao.nome} está à sua espera.`
    );

});
