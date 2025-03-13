function multiplicador() {
    // Define a quantidade de slots
    const quantidadeDeSlot = 9;

    // Array com os caminhos das imagens
    var imagens = [
        "./images/a001.jpg",
        "./images/a002.jpg",
        "./images/a003.jpg",
        "./images/a004.jpg",
        "./images/a005.jpg",
        "./images/a006.jpg",
        "./images/a007.jpg",
        "./images/a008.jpg",
        "./images/a009.jpg",
        "./images/a010.jpg",
        "./images/a011.jpg",
        "./images/a012.jpg"
    ];

    // Array com os pesos das imagens para seleção ponderada
    var pesos = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0.5, 0.5, 0.1];

    // Array com os multiplicadores de ganhos para cada imagem
    var multiplicadores = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

    // Array para armazenar os resultados dos slots
    var resultados = [];

    // Seleciona os elementos do DOM
    var divImagens = document.querySelector(".images");
    var divResultado = document.getElementById("results");
    var creditos = document.getElementById("creditos");
    var aposta = document.getElementById("aposta");
    var ganhos = document.getElementById("ganhos");

    // Obtém os valores de aposta e créditos
    var apostaValor = parseInt(aposta.value);
    var creditosValor = parseInt(creditos.value);

    // Verifica se o jogador tem créditos suficientes para apostar
    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        return;
    }

    // Deduz o valor da aposta dos créditos
    creditosValor -= apostaValor;
    creditos.value = creditosValor;

    // Reseta a mensagem de resultado
    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    // Inicia a rotação dos slots
    var rodando = setInterval(rodar, 100);

    // Para a rotação dos slots após 1 segundo
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

            // Atualiza a imagem do slot
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

        // Atualiza os créditos e exibe a mensagem de resultado
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
    }
}
