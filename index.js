// Configuração do Mercado Pago
const mp = new MercadoPago('SUA_PUBLIC_KEY', {
    locale: 'pt-BR'
});

// Função para exibir mensagens dinâmicas
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

// Função para iniciar o pagamento PIX
async function iniciarPagamentoPix() {
    const valorCreditos = 100; // Quantidade de créditos a serem comprados
    const valorPagamento = 10.00; // Valor em reais a ser pago
    const divResultado = document.getElementById("results");

    try {
        exibirMensagem(divResultado, "Processando pagamento...", "processing");

        const response = await fetch('/criar-pagamento-pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor: valorPagamento,
                descricao: `Compra de ${valorCreditos} créditos`
            })
        });

        const data = await response.json();

        if (data.payment_id && data.qr_code) {
            const qrCodeDiv = document.getElementById("qrCodeContainer");
            qrCodeDiv.innerHTML = `
                <h3>Escaneie o QR Code abaixo para pagar:</h3>
                <img src="${data.qr_code}" alt="QR Code PIX">
            `;
            qrCodeDiv.classList.add('show');

            verificarPagamento(data.payment_id, valorCreditos);
        } else {
            exibirMensagem(divResultado, "Erro ao criar pagamento. Tente novamente.", "error");
        }
    } catch (error) {
        console.error("Erro ao processar o pagamento:", error);
        exibirMensagem(divResultado, "Erro ao processar o pagamento. Verifique sua conexão.", "error");
    }
}

// Função para verificar o pagamento PIX
async function verificarPagamento(paymentId, creditosComprados) {
    const divResultado = document.getElementById("results");

    try {
        exibirMensagem(divResultado, "Verificando pagamento...", "processing");

        const response = await fetch(`/verificar-pagamento?payment_id=${paymentId}`);
        const data = await response.json();

        if (data.status === 'approved') {
            const creditos = document.getElementById("creditos");
            creditos.value = parseInt(creditos.value) + creditosComprados;

            exibirMensagem(divResultado, "Pagamento aprovado! Créditos adicionados.", "success");

            const qrCodeDiv = document.getElementById("qrCodeContainer");
            qrCodeDiv.classList.remove('show');
        } else if (data.status === 'pending') {
            exibirMensagem(divResultado, "Pagamento pendente. Aguarde alguns minutos.", "warning");
        } else {
            exibirMensagem(divResultado, "Pagamento não aprovado. Tente novamente.", "error");
        }
    } catch (error) {
        console.error("Erro ao verificar o pagamento:", error);
        exibirMensagem(divResultado, "Erro ao verificar pagamento. Tente mais tarde.", "error");
    }
}

// Função principal do jogo
function multiplicador() {
    // Implementação da lógica do jogo permanece a mesma...
}
