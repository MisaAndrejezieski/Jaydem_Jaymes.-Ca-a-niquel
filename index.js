// Configuração inicial do sistema
const configuracoes = {
    adminEmail: "admin@exemplo.com", // E-mail do administrador
    qrCodeUrl: "./images/qrcode.png", // QR Code salvo no código
    emailService: "https://email-service.com/send" // Simulação do envio de e-mail
};

// Função para exibir mensagens dinâmicas no jogo
function exibirMensagem(elemento, mensagem, classe) {
    elemento.innerHTML = mensagem;
    elemento.className = classe || '';
}

// Solicitação de pagamento via QR Code
function solicitarPagamento() {
    const qrCodeDiv = document.getElementById("qrCodeContainer");
    qrCodeDiv.innerHTML = `<img src="${configuracoes.qrCodeUrl}" alt="QR Code para pagamento">`;
    document.getElementById("qrCodeModal").style.display = "flex";

    // Envia um e-mail ao administrador para confirmação
    enviarEmailAdmin();
}

// Fecha o modal de QR Code
function fecharModalQRCode() {
    document.getElementById("qrCodeModal").style.display = "none";
    exibirMensagem(document.getElementById("results"), "Aguarde a confirmação do administrador.", "processing");
}

// Simulação de envio de e-mail para o administrador
function enviarEmailAdmin() {
    const emailPayload = {
        to: configuracoes.adminEmail,
        subject: "Confirmação de pagamento necessária",
        body: "Um jogador solicitou a compra de créditos. Confirme o pagamento para adicionar os créditos."
    };

    fetch(configuracoes.emailService, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emailPayload)
    })
        .then((response) => {
            if (response.ok) {
                alert("E-mail enviado ao administrador.");
            } else {
                alert("Falha ao enviar o e-mail. Tente novamente.");
            }
        })
        .catch((error) => {
            console.error("Erro ao enviar e-mail:", error);
            alert("Erro ao notificar o administrador.");
        });
}

// Lógica do jogo e dos slots
function multiplicador() {
    const divResultado = document.getElementById("results");
    const aposta = parseInt(document.getElementById("aposta").value) || 0;
    const creditos = document.getElementById("creditos");
    let creditosValor = parseInt(creditos.value);

    // Validação da aposta
    if (aposta <= 0 || aposta > creditosValor) {
        exibirMensagem(divResultado, "Aposta inválida. Verifique seus créditos.", "error");
        return;
    }

    // Deduz a aposta dos créditos
    creditosValor -= aposta;
    creditos.value = creditosValor;
    exibirMensagem(divResultado, "Rodando os slots...", "processing");

    // Animação dos slots
    const slots = document.querySelectorAll(".slot-container");
    const resultados = [];
    slots.forEach((slot) => {
        slot.innerHTML = ""; // Limpa o slot anterior
        const imgIndex = Math.floor(Math.random() * 12) + 1; // Seleciona imagem aleatória
        const img = document.createElement("img");
        img.src = `./images/a00${imgIndex}.jpg`; // Caminho da imagem
        img.className = "slot-spin"; // Adiciona classe de animação
        slot.appendChild(img);
        resultados.push(imgIndex); // Registra o resultado
    });

    // Calcula o resultado após a animação
    setTimeout(() => {
        calcularResultado(resultados, aposta, creditos, divResultado);
    }, 2000);
}

// Cálculo do resultado após a rodada dos slots
function calcularResultado(resultados, aposta, creditos, divResultado) {
    const padroes = [
        // Linhas
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // Colunas
        [0, 3, 6], [1, 4, 7], [2, 5, 8]
    ];

    let ganhoTotal = 0;
    let ganhou = false;

    padroes.forEach((padrao) => {
        if (resultados[padrao[0]] === resultados[padrao[1]] && resultados[padrao[0]] === resultados[padrao[2]]) {
            ganhoTotal += aposta * 2; // Multiplica o ganho
            ganhou = true;
        }
    });

    if (ganhou) {
        creditos.value = parseInt(creditos.value) + ganhoTotal;
        exibirMensagem(divResultado, `Parabéns! Você ganhou ${ganhoTotal} créditos!`, "won");
    } else {
        exibirMensagem(divResultado, "Você perdeu. Tente novamente!", "lost");
    }
}
