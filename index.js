// Configuração do Mercado Pago
const mp = new MercadoPago('SUA_PUBLIC_KEY', {
    locale: 'pt-BR'
});

// Função para criar mensagens dinâmicas
function exibirMensagem(elemento, mensagem, classe) {
    elemento.innerHTML = mensagem;
    elemento.className = classe || '';
}

// Função para validar a aposta
function validarAposta(apostaValor, creditosValor) {
    if (apostaValor <= 0) {
        return "O valor da aposta deve ser maior que zero.";
    }
    if (apostaValor > creditosValor) {
        return "Créditos insuficientes para essa aposta.";
    }
    return null;
}

// Função para comprar créditos com PIX
async function iniciarPagamentoPix() {
    const valorCreditos = 100; // Quantidade de créditos a serem comprados
    const valorPagamento = 10.00; // Valor em reais a ser pago

    try {
        const response = await fetch('/criar-pagamento-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor: valorPagamento,
                descricao: `Compra de ${valorCreditos} créditos`
            })
        });

        const data = await response.json();

        if (data.payment_id) {
            alert(`Escaneie o QR Code para pagar: ${data.qr_code}`);
            verificarPagamento(data.payment_id, valorCreditos);
        } else {
            alert("Erro ao criar o pagamento. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao processar o pagamento:", error);
        alert("Erro ao processar o pagamento.");
    }
}

// Função para verificar o pagamento
async function verificarPagamento(paymentId, creditosComprados) {
    try {
        const response = await fetch(`/verificar-pagamento?payment_id=${paymentId}`);
        const data = await response.json();

        if (data.status === 'approved') {
            const creditos = document.getElementById("creditos");
            creditos.value = parseInt(creditos.value) + creditosComprados;
            alert("Pagamento aprovado! Créditos adicionados.");
        } else {
            alert("Pagamento não aprovado. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao verificar o pagamento:", error);
        alert("Erro ao verificar o pagamento.");
    }
}

// Lógica do jogo
function multiplicador() {
    const quantidadeDeSlot = 9;
    const imagens = [
        "./images/a001.jpg", "./images/a002.jpg", "./images/a003.jpg",
        "./images/a004.jpg", "./images/a005.jpg", "./images/a006.jpg",
        "./images/a007.jpg", "./images/a008.jpg", "./images/a009.jpg",
        "./images/a010.jpg", "./images/a011.jpg", "./images/a012.jpg"
    ];
    const pesos = [0.08, 0.08, 0.05, 0.5, 0.05, 0.05, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
    const multiplicadores = [2, 3, 4, 5, 6, 7, 8, 8, 8, 9, 9, 10];
    const resultados = [];
    const divResultado = document.getElementById("results");
    const creditos = document.getElementById("creditos");
    const aposta = document.getElementById("aposta");
    const ganhos = document.getElementById("ganhos");
    const jogadas = document.getElementById("jogadas");

    const apostaValor = parseInt(aposta.value);
    const creditosValor = parseInt(creditos.value);

    // Validações de aposta
    const erro = validarAposta(apostaValor, creditosValor);
    if (erro) {
        exibirMensagem(divResultado, erro, 'lost');
        return;
    }

    // Atualizar créditos e jogadas
    creditos.value = creditosValor - apostaValor;
    jogadas.value = parseInt(jogadas.value) + 1;

    exibirMensagem(divResultado, "Rodando...", "");

    const rodando = setInterval(() => rodar(quantidadeDeSlot, imagens, pesos, resultados), 100);

    setTimeout(() => {
        clearInterval(rodando);
        verifiqueSeGanhou(resultados, imagens, multiplicadores, apostaValor, creditos, ganhos, divResultado);
    }, 500);

    function rodar(quantidadeDeSlot, imagens, pesos, resultados) {
        const divImagens = document.querySelector(".images");

        for (let i = 0; i < quantidadeDeSlot; i++) {
            const aleatorio = selecionarImagemComPeso(pesos);
            const slotAtual = divImagens.querySelector(`.slot-${i + 1}`);
            slotAtual.src = imagens[aleatorio];
            resultados[i] = imagens[aleatorio];
        }
    }

    function selecionarImagemComPeso(pesos) {
        const totalPesos = pesos.reduce((a, b) => a + b, 0);
        let somaPesos = 0;
        const numeroAleatorio = Math.random() * totalPesos;
        for (let i = 0; i < pesos.length; i++) {
            somaPesos += pesos[i];
            if (numeroAleatorio < somaPesos) return i;
        }
    }

    function verifiqueSeGanhou(resultados, imagens, multiplicadores, apostaValor, creditos, ganhos, divResultado) {
        const padroes = [
            // Linhas
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // Colunas
            [0, 3, 6], [1, 4, 7], [2, 5, 8]
        ];

        let ganhoTotal = 0;
        let ganhou = false;

        for (const padrao of padroes) {
            if (resultados[padrao[0]] === resultados[padrao[1]] && resultados[padrao[0]] === resultados[padrao[2]]) {
                const indiceImagem = imagens.indexOf(resultados[padrao[0]]);
                ganhoTotal += apostaValor * multiplicadores[indiceImagem];
                ganhou = true;
            }
        }

        if (ganhou) {
            creditos.value = parseInt(creditos.value) + ganhoTotal;
            ganhos.value = ganhoTotal;
            exibirMensagem(divResultado, `Parabéns! Você ganhou ${ganhoTotal} créditos!`, 'won');
        } else {
            ganhos.value = 0;
            exibirMensagem(divResultado, "Infelizmente você perdeu!", 'lost');
        }

        if (parseInt(creditos.value) <= 0) {
            jogadas.value = 0;
        }
    }
}
