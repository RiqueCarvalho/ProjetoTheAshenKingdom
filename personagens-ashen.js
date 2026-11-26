
/* =========================================
   THE ASHEN KINGDOM
   CATÁLOGO DE PERSONAGENS
========================================= */

window.CatalogoAshenKingdom = {

    herois: {

        akane: {
            id: "akane",
            nome: "Samurai Sombrio",
            imagem: "../Akane/akane2.png",
            vida: 120,
            ataque: 18,
            defesa: 12
        },

        hiroshi: {
            id: "hiroshi",
            nome: "Guerreiro das Foices",
            imagem: "../Hiroshi/hiroshi2.png",
            vida: 130,
            ataque: 20,
            defesa: 10
        },

        kurogane: {
            id: "kurogane",
            nome: "Hiroshi, o Último Samurai",
            imagem: "../Ronin/ronin2.png",
            vida: 140,
            ataque: 19,
            defesa: 15
        }

    },

    viloes: [

        {
            id: "vilao1",
            nome: "Guardião das Cinzas",
            imagem: "../Arenas/VilaoI.png",
            vida: 120,
            ataque: 12,
            defesa: 5
        },

        {
            id: "vilao2",
            nome: "Guerreiro Corrompido",
            imagem: "../Arenas/VilaoII.png",
            vida: 135,
            ataque: 14,
            defesa: 8
        },

        {
            id: "vilao3",
            nome: "Senhor da Escuridão",
            imagem: "../Arenas/VilaoIII.png",
            vida: 110,
            ataque: 16,
            defesa: 4
        }

    ],

    obterHeroi() {

        const id = localStorage.getItem(
            "ashenPersonagemSelecionado"
        );

        if (!id) return null;

        return this.herois[id] || null;

    },

    sortearVilao() {

        if (!this.viloes.length) return null;

        const indice = Math.floor(
            Math.random() * this.viloes.length
        );

        return this.viloes[indice];

    }

};
