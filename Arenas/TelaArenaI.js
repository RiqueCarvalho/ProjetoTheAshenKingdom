
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURAÇÕES
    // ==========================================

    const DIFICULDADE = "media";
    const PAGINA_PROXIMA_ARENA = "./TelaArenaII.html";

    const CONFIGURACAO = {
        media: {
            multiplicadorDanoHeroi: 1,
            multiplicadorDanoVilao: 1
        }
    };

    const dificuldade = CONFIGURACAO[DIFICULDADE];

    // ==========================================
    // VERIFICAR CATÁLOGO
    // ==========================================

    if (!window.CatalogoAshenKingdom) {
        console.error("personagens-ashen.js não foi carregado.");
        return;
    }

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
    // PERSONAGENS
    // ==========================================

    const catalogo = window.CatalogoAshenKingdom;
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
    // REGISTRO NARRATIVO
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
    // FINALIZAR BATALHA
    // ==========================================

    function finalizarBatalha(vitoria) {

        batalhaFinalizada = true;
        turnoEmAndamento = false;

        elementos.btnAtacar.disabled = true;

        if (vitoria) {

            elementos.tituloResultado.textContent = "VITÓRIA!";

            elementos.textoResultado.textContent =
                `Você derrotou ${vilao.nome}! Prepare-se para a próxima arena.`;

            elementos.btnResultado.textContent =
                "AVANÇAR PARA ARENA II";

            elementos.btnResultado.hidden = false;
            elementos.btnReiniciar.hidden = true;

            registrarMensagem(
                `🏆 ${heroi.nome} derrotou ${vilao.nome}! A Arena II está liberada!`
            );

        } else {

            elementos.tituloResultado.textContent = "DERROTA!";

            elementos.textoResultado.textContent =
                `${heroi.nome} foi derrotado por ${vilao.nome}. Você pode tentar novamente.`;

            elementos.btnResultado.hidden = true;
            elementos.btnReiniciar.hidden = false;

            registrarMensagem(
                `☠ ${vilao.nome} venceu o combate. Tente novamente!`
            );

        }

        elementos.resultadoBatalha.hidden = false;

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

    }

    // ==========================================
    // ESPERAR ANIMAÇÕES
    // ==========================================

    function esperar(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    // ==========================================
    // TURNO DE COMBATE
    // ==========================================

    async function executarTurno() {

        if (turnoEmAndamento || batalhaFinalizada) return;

        turnoEmAndamento = true;

        elementos.btnAtacar.disabled = true;

        // Herói ataca.
        atacarVilao();

        await esperar(700);

        // Verifica derrota do vilão.
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

        // Verifica derrota do herói.
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

        vilao = catalogo.sortearVilao();

        if (!vilao) return;

        vidaHeroi = vidaMaximaHeroi;
        vidaVilao = vilao.vida;

        turnoEmAndamento = false;
        batalhaFinalizada = false;

        elementos.nomeVilao.textContent = vilao.nome;

        elementos.imagemVilao.src = vilao.imagem;

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
            `${heroi.nome} recuperou suas forças e encontrou ${vilao.nome}. A batalha recomeçou!`
        );

    }

    // ==========================================
    // EVENTOS DOS BOTÕES
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

        if (!batalhaFinalizada) return;

        if (vidaVilao <= 0) {

            window.location.href = PAGINA_PROXIMA_ARENA;

        }

    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    atualizarVida();

    registrarMensagem(
        `${heroi.nome} encontrou ${vilao.nome}. A Arena I começou!`
    );

});
