function multiplicador() {
    // Define a quantidade de slots
    const quantidadeDeSlot = 9;

    // Array com os caminhos das imagens
    var imagens = [
        "./images/j001.jpg",
        "./images/j002.jpg",
        "./images/j003.jpg",
        "./images/j004.jpg",
        "./images/j005.jpg",
        "./images/j006.jpg",
        "./images/j007.jpg",
        "./images/j008.jpg",
        "./images/j009.jpg",
        "./images/j010.jpg",
        "./images/j011.jpg",
        "./images/j012.jpg"
    ];

    // Array com os pesos das imagens para seleção ponderada
    var pesos = [1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3, 0.2];

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

    // Função para verificar se o jogador ganhou
    function verifiqueSeGanhou() {
        // Define as linhas de slots
        var linhas = [
            [resultados[0], resultados[1], resultados[2]],
            [resultados[3], resultados[4], resultados[5]],
            [resultados[6], resultados[7], resultados[8]]
        ];

        var ganhoTotal = 0;
        var ganhou = false;

        // Verifica cada linha para ver se há três imagens iguais
        for (var i = 0; i < linhas.length; i++) {
            if (linhas[i][0] === linhas[i][1] && linhas[i][0] === linhas[i][2]) {
                var indiceImagem = imagens.indexOf(linhas[i][0]);
                var multiplicadorGanho = multiplicadores[indiceImagem];
                var ganho = apostaValor * multiplicadorGanho;
                ganhoTotal += ganho;
                ganhou = true;
            }
        }

        // Verifica se todas as imagens são iguais
        if (resultados.every((val, i, arr) => val === arr[0])) {
            ganhoTotal = ganho * 100;
            ganhou = true;
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
