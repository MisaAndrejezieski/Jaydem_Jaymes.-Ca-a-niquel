function multiplicador() {
    // Configurações do jogo
    const quantidadeDeSlot = 9; // Número de slots no jogo
    const tempoRodando = 1000; // Tempo (em ms) que os slots ficam rodando
    const intervaloRodando = 100; // Intervalo (em ms) para atualizar os slots

    // Caminhos das imagens
    const imagens = [
        "./images/j001.jpg", "./images/j002.jpg", "./images/j003.jpg",
        "./images/j004.jpg", "./images/j005.jpg", "./images/j006.jpg",
        "./images/j007.jpg", "./images/j008.jpg", "./images/j009.jpg",
        "./images/j010.jpg", "./images/j011.jpg", "./images/j012.jpg"
    ];

    // Pesos para seleção ponderada das imagens
    const pesos = [1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

    // Multiplicadores de ganho para cada imagem
    const multiplicadores = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

    // Elementos do DOM
    const divImagens = document.querySelector(".images");
    const divResultado = document.getElementById("results");
    const creditosElement = document.getElementById("creditos");
    const apostaElement = document.getElementById("aposta");
    const ganhosElement = document.getElementById("ganhos");
    const botaoJogar = document.getElementById("jogar");

    // Variáveis de estado
    let creditos = parseInt(creditosElement.value) || 100; // Créditos iniciais
    let aposta = parseInt(apostaElement.value) || 10; // Valor padrão da aposta
    let ganhos = 0;
    let resultados = [];

    // Função principal para iniciar o jogo
    function iniciarJogo() {
        // Validação da aposta
        if (isNaN(aposta) {
            mostrarMensagem("Valor de aposta inválido!", "lost");
            return;
        }

        if (aposta > creditos) {
            mostrarMensagem("Créditos insuficientes!", "lost");
            return;
        }

        // Deduz a aposta dos créditos
        creditos -= aposta;
        creditosElement.value = creditos;

        // Reseta os ganhos e resultados
        ganhos = 0;
        resultados = [];
        ganhosElement.value = ganhos;

        // Mostra mensagem de "Rodando..."
        mostrarMensagem("Rodando...", "");

        // Inicia a rotação dos slots
        const rodando = setInterval(rodarSlots, intervaloRodando);

        // Para a rotação após o tempo definido
        setTimeout(() => {
            clearInterval(rodando);
            verificarGanhos();
        }, tempoRodando);
    }

    // Função para rodar os slots
    function rodarSlots() {
        for (let i = 0; i < quantidadeDeSlot; i++) {
            const indiceImagem = selecionarImagemComPeso();
            const slot = divImagens.querySelector(`.slot-${i + 1}`);
            slot.src = imagens[indiceImagem];
            resultados[i] = imagens[indiceImagem];
        }
    }

    // Função para selecionar uma imagem com base nos pesos
    function selecionarImagemComPeso() {
        const totalPesos = pesos.reduce((a, b) => a + b, 0);
        const numeroAleatorio = Math.random() * totalPesos;
        let somaPesos = 0;

        for (let i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) {
                return i;
            }
        }
    }

    // Função para verificar os ganhos
    function verificarGanhos() {
        const linhas = [
            [resultados[0], resultados[1], resultados[2]], // Linha 1
            [resultados[3], resultados[4], resultados[5]], // Linha 2
            [resultados[6], resultados[7], resultados[8]]  // Linha 3
        ];

        let ganhoTotal = 0;
        let ganhou = false;

        // Verifica cada linha
        for (const linha of linhas) {
            if (linha[0] === linha[1] && linha[0] === linha[2]) {
                const indiceImagem = imagens.indexOf(linha[0]);
                const multiplicador = multiplicadores[indiceImagem];
                ganhoTotal += aposta * multiplicador;
                ganhou = true;
            }
        }

        // Verifica se todas as imagens são iguais (jackpot)
        if (resultados.every((val, i, arr) => val === arr[0])) {
            ganhoTotal *= 100; // Multiplica o ganho por 100
            ganhou = true;
        }

        // Atualiza os créditos e exibe o resultado
        if (ganhou) {
            creditos += ganhoTotal;
            creditosElement.value = creditos;
            ganhosElement.value = ganhoTotal;
            mostrarMensagem(`Parabéns! Você ganhou ${ganhoTotal} créditos!`, "won");
        } else {
            mostrarMensagem("Infelizmente você perdeu!", "lost");
        }
    }

    // Função para exibir mensagens ao usuário
    function mostrarMensagem(mensagem, classe) {
        divResultado.textContent = mensagem;
        divResultado.className = classe;
    }

    // Evento de clique no botão "Jogar"
    botaoJogar.addEventListener("click", iniciarJogo);
}

// Inicializa o jogo
multiplicador();
