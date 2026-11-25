const slots = document.querySelectorAll('.personagem-slot');
const botoesSelecionar = document.querySelectorAll('.btn-selecionar');
const btnVoltar = document.getElementById('btn-voltar');

const modal = document.getElementById('modal-confirmacao');
const modalTexto = document.getElementById('modal-texto');
const btnConfirmarInicio = document.getElementById('btn-confirmar-inicio');
const btnCancelar = document.getElementById('btn-cancelar');

let personagemEscolhido = null;


// ==========================================
// CAMINHO DA TELA DO SAMURAI SOMBRIO
// ==========================================

const PAGINA_AKANE = './Akane/TelaAkane.html';


// ==========================================
// EFEITO SONORO
// ==========================================

function tocarSomHover() {

    try {

        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';

        osc.frequency.setValueAtTime(320, ctx.currentTime);

        osc.frequency.exponentialRampToValueAtTime(
            520,
            ctx.currentTime + 0.08
        );

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.08
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);

    } catch (e) {

    }

}


// ==========================================
// REDIRECIONAR PARA A TELA DA AKANE
// ==========================================

function abrirTelaAkane() {

    localStorage.setItem(
        'personagemSelecionado',
        'Samurai Sombrio'
    );

    document.body.style.transition = 'opacity 0.8s ease';

    document.body.style.opacity = '0';

    setTimeout(() => {

        window.location.href = PAGINA_AKANE;

    }, 800);

}


// ==========================================
// CLIQUE NOS PERSONAGENS
// ==========================================

slots.forEach((slot) => {

    slot.addEventListener('mouseenter', () => {

        tocarSomHover();

    });


    slot.addEventListener('click', () => {

        // PRIMEIRO PERSONAGEM: SAMURAI SOMBRIO

        if (slot.classList.contains('slot-1')) {

            abrirTelaAkane();

            return;

        }

        // OUTROS PERSONAGENS

        selecionarPersonagem(slot);

    });

});


// ==========================================
// BOTÕES SELECIONAR
// ==========================================

botoesSelecionar.forEach((btn) => {

    btn.addEventListener('click', (e) => {

        e.stopPropagation();

        const slot = btn.closest('.personagem-slot');

        // BOTÃO DO SAMURAI SOMBRIO

        if (slot.classList.contains('slot-1')) {

            abrirTelaAkane();

            return;

        }

        // BOTÕES DOS OUTROS PERSONAGENS

        selecionarPersonagem(slot);

    });

});


// ==========================================
// SELECIONAR PERSONAGEM
// ==========================================

function selecionarPersonagem(slot) {

    slots.forEach((s) => {

        s.classList.remove('ativo');

    });

    slot.classList.add('ativo');

    personagemEscolhido = slot.dataset.personagem;

    modalTexto.textContent =
        `Você escolheu: ${personagemEscolhido}. Deseja continuar?`;

    modal.classList.remove('hidden');

}


// ==========================================
// BOTÃO VOLTAR
// ==========================================

btnVoltar.addEventListener('click', () => {

    window.location.href = 'TelaInicial.html';

});


// ==========================================
// CONFIRMAR ESCOLHA DOS OUTROS PERSONAGENS
// ==========================================

btnConfirmarInicio.addEventListener('click', () => {

    if (!personagemEscolhido) {

        return;

    }

    localStorage.setItem(
        'personagemSelecionado',
        personagemEscolhido
    );

    window.location.href = 'Jogo.html';

});


// ==========================================
// CANCELAR ESCOLHA
// ==========================================

btnCancelar.addEventListener('click', () => {

    modal.classList.add('hidden');

});