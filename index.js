// Configuração do Mercado Pago
const mp = new MercadoPago('SUA_PUBLIC_KEY', {
    locale: 'pt-BR'
});

// Função para comprar créditos com PIX
async function iniciarPagamentoPix() {
    const valorCreditos = 100; // Quantidade de créditos a serem comprados
    const valorPagamento = 10.00; // Valor em reais a ser pago

    try {
        // Cria a cobrança PIX
        const response = await fetch('/criar-pagamento-pix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valor: valorPagamento,
                descricao: `Compra de ${valorCreditos} créditos`
            })
        });

        const data = await response.json();

        if (data.payment_id) {
            // Exibe o QR Code do PIX
            const qrCode = data.qr_code;
            alert(`Escaneie o QR Code para pagar: ${qrCode}`);

            // Verifica o pagamento
            verificarPagamento(data.payment_id, valorCreditos);
        } else {
            alert("Erro ao criar o pagamento. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao processar o pagamento.");
    }
}

// Função para verificar o pagamento
async function verificarPagamento(paymentId, creditosComprados) {
    try {
        const response = await fetch(`/verificar-pagamento?payment_id=${paymentId}`);
        const data = await response.json();

        if (data.status === 'approved') {
            // Adiciona os créditos ao saldo do jogador
            const creditos = document.getElementById("creditos");
            let creditosValor = parseInt(creditos.value);
            creditosValor += creditosComprados;
            creditos.value = creditosValor;

            alert("Pagamento aprovado! Créditos adicionados.");
        } else {
            alert("Pagamento não aprovado. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao verificar o pagamento.");
    }
}

// Lógica do jogo
function multiplicador() {
    const quantidadeDeSlot = 9;
    var imagens = [
        "./images/a001.jpg", "./images/a002.jpg", "./images/a003.jpg",
        "./images/a004.jpg", "./images/a005.jpg", "./images/a006.jpg",
        "./images/a007.jpg", "./images/a008.jpg", "./images/a009.jpg",
        "./images/a010.jpg", "./images/a011.jpg", "./images/a012.jpg"
    ];
    var pesos = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05, 0.05, 0.5, 0.5, 0.1];
    var multiplicadores = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
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

    if (apostaValor > creditosValor) {
        divResultado.innerHTML = "Créditos insuficientes!";
        divResultado.classList = 'lost';
        return;
    }

    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadasValor += 1;
    jogadas.value = jogadasValor;

    divResultado.classList = "";
    divResultado.innerHTML = "Rodando...";

    var rodando = setInterval(rodar, 100);
    setTimeout(function () {
        clearInterval(rodando);
        verifiqueSeGanhou();
    }, 500);

    function rodar() {
        for (var i = 0; i < quantidadeDeSlot; i++) {
            var aleatorio = selecionarImagemComPeso();
            var slotName = '.slot-' + (i + 1);
            var slotAtual = divImagens.querySelector(slotName);
            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

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

        // Zera o contador de jogadas se os créditos acabarem
        if (creditosValor <= 0) {
            jogadas.value = 0;
        }
    }
}
