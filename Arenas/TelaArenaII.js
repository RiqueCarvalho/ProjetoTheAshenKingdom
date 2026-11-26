
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const DIFICULDADE = "media";

    const PAGINA_PROXIMA_ARENA = "TelaArenaIII.html";

    const CONFIGURACAO = {
        media: {
            multiplicadorDanoHeroi: 1,
            multiplicadorDanoVilao: 1
        }
    };

    const dificuldade = CONFIGURACAO[DIFICULDADE];

    // ==========================================
    // CATÁLOGO
    // ==========================================

    if (!window.CatalogoAshenKingdom) {
        console.error("Catálogo Ashen Kingdom não encontrado.");
        return;
    }

    const catalogo = window.CatalogoAshenKingdom;

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const elementos = {
        nomeHeroi: document.getElementById("nomeHeroi"),
        nomeVilao: document.getElementById("nomeVilao"),

        imagemHeroi: document.getElementById("imagemHeroi"),
        imagemVilao: document.getElementById("imagemVilao"),

        vidaHeroiTexto: document.getElementById("vidaHeroiTexto"),
        vidaVilaoTexto: document.getElementById("vidaVilaoTexto"),

        vidaHeroiBarra: document.getElementById("vidaHeroiBarra"),
        vidaVilaoBarra: document.getElementById("vidaVilaoBarra"),

        valorAtaque: document.getElementById("valorAtaque"),
        nomeUsuario: document.getElementById("nomeUsuario"),

        btnAtacar: document.getElementById("btnAtacar"),
        btnReiniciar: document.getElementById("btnReiniciar"),

        registroBatalha: document.getElementById("registroBatalha"),

        resultadoBatalha: document.getElementById("resultadoBatalha"),
        tituloResultado: document.getElementById("tituloResultado"),
        textoResultado: document.getElementById("textoResultado"),
        btnResultado: document.getElementById("btnResultado"),

        efeitosCombate: document.getElementById("efeitosCombate"),

        ladoHeroi: document.getElementById("ladoHeroi"),
        ladoVilao: document.getElementById("ladoVilao")
    };

    // ==========================================
    // CARREGAR PERSONAGENS
    // ==========================================

    const heroi = catalogo.obterHeroi();

    if (!heroi) {
        alert("Nenhum personagem foi selecionado.");

        window.location.href =
            "../TelaEscolherPersonagem.html";

        return;
    }

    let vilao = catalogo.sortearVilao();

    if (!vilao) {
        alert("Nenhum vilão cadastrado.");
        return;
    }

    // ==========================================
    // ATRIBUTOS
    // ==========================================

    let vidaHeroi = heroi.vida;
    let vidaVilao = vilao.vida;

    const vidaMaximaHeroi = heroi.vida;

    const ataqueHeroi = heroi.ataque;
    const defesaHeroi = heroi.defesa;

    let turnoEmAndamento = false;
    let batalhaFinalizada = false;

    // ==========================================
    // INFORMAÇÕES INICIAIS
    // ==========================================

    elementos.nomeHeroi.textContent = heroi.nome;
    elementos.nomeVilao.textContent = vilao.nome;

    elementos.imagemHeroi.src = heroi.imagem;
    elementos.imagemVilao.src = vilao.imagem;

    elementos.valorAtaque.textContent = ataqueHeroi;

    elementos.nomeUsuario.textContent =
        localStorage.getItem("ashenPersonagemNome") || heroi.nome;

    // ==========================================
    // REGISTRO DA BATALHA
    // ==========================================

    function registrarMensagem(mensagem) {

        const paragrafo = document.createElement("p");

        paragrafo.textContent = mensagem;

        elementos.registroBatalha.appendChild(paragrafo);

        elementos.registroBatalha.scrollTop =
            elementos.registroBatalha.scrollHeight;

    }

    // ==========================================
    // ATUALIZAR VIDA
    // ==========================================

    function atualizarVida() {

        elementos.vidaHeroiTexto.textContent =
            `${vidaHeroi}/${vidaMaximaHeroi} HP`;

        elementos.vidaVilaoTexto.textContent =
            `${vidaVilao}/${vilao.vida} HP`;

        elementos.vidaHeroiBarra.style.width =
            `${Math.max(0, vidaHeroi / vidaMaximaHeroi * 100)}%`;

        elementos.vidaVilaoBarra.style.width =
            `${Math.max(0, vidaVilao / vilao.vida * 100)}%`;

    }

    // ==========================================
    // ANIMAÇÕES
    // ==========================================

    function animar(elemento, classe) {

        elemento.classList.remove(classe);

        void elemento.offsetWidth;

        elemento.classList.add(classe);

        elemento.addEventListener("animationend", () => {
            elemento.classList.remove(classe);
        }, { once: true });

    }

    // ==========================================
    // NÚMEROS DE DANO
    // ==========================================

    function mostrarDano(elemento, dano) {

        const numero = document.createElement("div");

        numero.className = "numero-dano";
        numero.textContent = `-${dano}`;

        const retangulo = elemento.getBoundingClientRect();

        numero.style.left =
            `${retangulo.left + retangulo.width / 2}px`;

        numero.style.top =
            `${retangulo.top + 100}px`;

        elementos.efeitosCombate.appendChild(numero);

        setTimeout(() => numero.remove(), 1100);

    }

    // ==========================================
    // CÁLCULO DE DANO
    // ==========================================

    function calcularDano(ataque, defesa, multiplicador = 1) {

        return Math.max(
            1,
            Math.round((ataque - defesa) * multiplicador)
        );

    }

    // ==========================================
    // ATAQUE DO HERÓI
    // ==========================================

    function atacarVilao() {

        const dano = calcularDano(
            ataqueHeroi,
            vilao.defesa,
            dificuldade.multiplicadorDanoHeroi
        );

        vidaVilao = Math.max(0, vidaVilao - dano);

        animar(elementos.imagemHeroi, "atacando");
        animar(elementos.ladoVilao, "recebendo-dano");

        mostrarDano(elementos.ladoVilao, dano);

        atualizarVida();

        registrarMensagem(
            `⚔ ${heroi.nome} atacou ${vilao.nome} e causou ${dano} de dano!`
        );

    }

    // ==========================================
    // ATAQUE DO VILÃO
    // ==========================================

    function atacarHeroi() {

        const danoBase = calcularDano(
            vilao.ataque,
            defesaHeroi,
            dificuldade.multiplicadorDanoVilao
        );

        // Dano mínimo de 10.
        const dano = Math.max(10, danoBase);

        vidaHeroi = Math.max(0, vidaHeroi - dano);

        animar(elementos.imagemVilao, "atacando-vilao");
        animar(elementos.ladoHeroi, "recebendo-dano");

        mostrarDano(elementos.ladoHeroi, dano);

        atualizarVida();

        registrarMensagem(
            `💀 ${vilao.nome} contra-atacou ${heroi.nome} e causou ${dano} de dano!`
        );

    }

    // ==========================================
    // ESPERA
    // ==========================================

    function esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================
    // FINALIZAR BATALHA
    // ==========================================

    function finalizarBatalha(vitoria) {

        batalhaFinalizada = true;
        turnoEmAndamento = false;

        elementos.btnAtacar.disabled = true;

        if (vitoria) {

            elementos.tituloResultado.textContent = "VITÓRIA!";

            elementos.textoResultado.textContent =
                `Você derrotou ${vilao.nome}! A Arena II foi conquistada. Prepare-se para o próximo desafio.`;

            elementos.btnResultado.textContent =
                "AVANÇAR PARA ARENA III";

            elementos.btnResultado.hidden = false;
            elementos.btnReiniciar.hidden = true;

            registrarMensagem(
                `🏆 ${heroi.nome} derrotou ${vilao.nome}!`
            );

        } else {

            elementos.tituloResultado.textContent = "DERROTA!";

            elementos.textoResultado.textContent =
                `${heroi.nome} foi derrotado por ${vilao.nome}. Tente novamente!`;

            elementos.btnResultado.hidden = true;
            elementos.btnReiniciar.hidden = false;

            registrarMensagem(
                `☠ ${vilao.nome} venceu o combate.`
            );

        }

        elementos.resultadoBatalha.hidden = false;

    }

    // ==========================================
    // EXECUTAR TURNO
    // ==========================================

    async function executarTurno() {

        if (turnoEmAndamento || batalhaFinalizada) return;

        turnoEmAndamento = true;

        elementos.btnAtacar.disabled = true;

        // Herói ataca.
        atacarVilao();

        await esperar(700);

        // Verificar derrota do vilão.
        if (vidaVilao <= 0) {

            animar(elementos.imagemVilao, "derrotado");

            registrarMensagem(
                `${vilao.nome} caiu diante de ${heroi.nome}!`
            );

            await esperar(800);

            finalizarBatalha(true);

            return;

        }

        // Vilão contra-ataca.
        atacarHeroi();

        await esperar(700);

        // Verificar derrota do herói.
        if (vidaHeroi <= 0) {

            animar(elementos.imagemHeroi, "derrotado");

            registrarMensagem(
                `${heroi.nome} não conseguiu resistir ao ataque!`
            );

            await esperar(800);

            finalizarBatalha(false);

            return;

        }

        turnoEmAndamento = false;

        elementos.btnAtacar.disabled = false;

    }

    // ==========================================
    // REINICIAR BATALHA
    // ==========================================

    function reiniciarBatalha() {

        // Mantém o mesmo vilão.
        vidaHeroi = vidaMaximaHeroi;
        vidaVilao = vilao.vida;

        turnoEmAndamento = false;
        batalhaFinalizada = false;

        elementos.imagemHeroi.classList.remove("derrotado");
        elementos.imagemVilao.classList.remove("derrotado");

        elementos.ladoHeroi.classList.remove("recebendo-dano");
        elementos.ladoVilao.classList.remove("recebendo-dano");

        elementos.resultadoBatalha.hidden = true;

        elementos.btnReiniciar.hidden = true;

        elementos.btnAtacar.disabled = false;

        elementos.registroBatalha.innerHTML = "";

        atualizarVida();

        registrarMensagem(
            `${heroi.nome} recuperou suas forças e enfrentará ${vilao.nome} novamente!`
        );

    }

    // ==========================================
    // EVENTOS
    // ==========================================

    elementos.btnAtacar.addEventListener(
        "click",
        executarTurno
    );

    elementos.btnReiniciar.addEventListener(
        "click",
        reiniciarBatalha
    );

    elementos.btnResultado.addEventListener("click", () => {

        if (!batalhaFinalizada || vidaVilao > 0) return;

        window.location.href = PAGINA_PROXIMA_ARENA;

    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarVida();

    registrarMensagem(
        `${heroi.nome} chegou à Arena II e encontrou ${vilao.nome}. Que comece o combate!`
    );

});
