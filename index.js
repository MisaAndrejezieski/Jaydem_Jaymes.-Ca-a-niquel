// Lógica do jogo
function multiplicador() {
    const quantidadeDeSlot = 9;
    var imagens = [
        "./images/a001.jpg", "./images/a002.jpg", "./images/a003.jpg",
        "./images/a004.jpg", "./images/a005.jpg", "./images/a006.jpg",
        "./images/a007.jpg", "./images/a008.jpg", "./images/a009.jpg",
        "./images/a010.jpg", "./images/a011.jpg", "./images/a012.jpg"
    ];
    var pesos = [0.08, 0.08, 0.05, 0.5, 0.05, 0.05, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
    var multiplicadores = [2, 3, 4, 5, 6, 7, 8, 8, 8, 9, 9, 10];
    var resultados = [];

    var divImagens = document.querySelector(".images");
    var divResultado = document.getElementById("results");
    var creditos = document.getElementById("creditos");
    var aposta = document.getElementById("aposta");
    var ganhos = document.getElementById("ganhos");
    var jogadas = document.getElementById("jogadas");

    var apostaValor = parseInt(aposta.value);
    var creditosValor = parseInt(creditos.value);
    var jogadasValor = parseInt(jogadas.value);

    // Verifica se o jogador tem créditos suficientes
    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        return;
    }

    // Deduz a aposta dos créditos e incrementa o contador de jogadas
    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadasValor += 1;
    jogadas.value = jogadasValor;

    // Reseta o estado do resultado
    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    // Simula a rotação dos slots
    var rodando = setInterval(rodar, 100);
    setTimeout(function () {
        clearInterval(rodando);
        verifiqueSeGanhou();
    }, 500);

    // Função para rodar os slots
    function rodar() {
        for (var i = 0; i < quantidadeDeSlot; i++) {
            var aleatorio = selecionarImagemComPeso();
            var slotName = '.slot-' + (i + 1);
            var slotAtual = divImagens.querySelector(slotName);
            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

    // Função para selecionar uma imagem com base nos pesos
    function selecionarImagemComPeso() {
        var totalPesos = pesos.reduce((a, b) => a + b, 0);
        var numeroAleatorio = Math.random() * totalPesos;
        var somaPesos = 0;
        for (var i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) {
                return i;
            }
        }
    }

    // Função para verificar se o jogador ganhou
    function verifiqueSeGanhou() {
        var linhas = [
            [resultados[0], resultados[1], resultados[2]], // Linha 1
            [resultados[3], resultados[4], resultados[5]], // Linha 2
            [resultados[6], resultados[7], resultados[8]]  // Linha 3
        ];
        var colunas = [
            [resultados[0], resultados[3], resultados[6]], // Coluna 1
            [resultados[1], resultados[4], resultados[7]], // Coluna 2
            [resultados[2], resultados[5], resultados[8]]  // Coluna 3
        ];

        var ganhoTotal = 0;
        var ganhou = false;

        // Verifica linhas
        for (var i = 0; i < linhas.length; i++) {
            if (linhas[i][0] === linhas[i][1] && linhas[i][0] === linhas[i][2]) {
                var indiceImagem = imagens.indexOf(linhas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                ganhoTotal += apostaValor * multiplicadorGanho;
                ganhou = true;
            }
        }

        // Verifica colunas
        for (var i = 0; i < colunas.length; i++) {
            if (colunas[i][0] === colunas[i][1] && colunas[i][0] === colunas[i][2]) {
                var indiceImagem = imagens.indexOf(colunas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                ganhoTotal += apostaValor * multiplicadorGanho;
                ganhou = true;
            }
        }

        // Atualiza o estado do jogo com base no resultado
        if (ganhou) {
            creditosValor += ganhoTotal;
            creditos.value = creditosValor;
            ganhos.value = ganhoTotal;
            divResultado.innerHTML = "Parabéns! Você ganhou " + ganhoTotal + " créditos!";
            divResultado.classList = 'won';
        } else {
            ganhos.value = 0;
            divResultado.innerHTML = "Infelizmente você perdeu!";
            divResultado.classList = 'lost';
        }

        // Zera o contador de jogadas se os créditos acabarem
        if (creditosValor <= 0) {
            jogadas.value = 0;
        }
    }
}
