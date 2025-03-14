// Configurações iniciais do sistema
const configuracoes = {
    adminEmail: "admin@exemplo.com", // E-mail do administrador
    qrCodeUrl: "./images/qrcode.png", // URL do QR Code
    emailService: "https://email-service.com/send" // Simulação do serviço de envio de e-mail
};

// Função para exibir mensagens dinâmicas no jogo
function exibirMensagem(elemento, mensagem, classe) {
    elemento.innerHTML = mensagem;
    elemento.className = classe || '';
}

// Função para solicitar compra de créditos com QR Code
function solicitarPagamento() {
    // Exibe o modal com o QR Code
    const qrCodeDiv = document.getElementById("qrCodeContainer");
    qrCodeDiv.innerHTML = `<img src="${configuracoes.qrCodeUrl}" alt="QR Code para pagamento">`;
    document.getElementById("qrCodeModal").style.display = "flex";

    // Envia um e-mail ao administrador para confirmação
    enviarEmailAdmin();
}

// Função para fechar o modal de QR Code
function fecharModalQRCode() {
    document.getElementById("qrCodeModal").style.display = "none";
    exibirMensagem(document.getElementById("results"), "Aguarde a confirmação do administrador.", "processing");
}

// Simulação do envio de e-mail para o administrador
function enviarEmailAdmin() {
    const emailPayload = {
        to: configuracoes.adminEmail,
        subject: "Confirmação de pagamento necessária",
        body: "Um jogador solicitou a compra de créditos. Confirme o pagamento e atualize os créditos no sistema."
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

// Lógica principal do jogo
function multiplicador() {
    const resultados = [];
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

    // Animação dos slots e resultados
    const slots = document.querySelectorAll(".slot-container");
    slots.forEach((slot) => {
        slot.innerHTML = ""; // Limpa o slot
        const imgIndex = Math.floor(Math.random() * 12) + 1; // Seleciona uma imagem aleatória
        const img = document.createElement("img");
        img.src = `./images/a00${imgIndex}.jpg`; // Caminho da imagem
        img.className = "slot-spin"; // Adiciona a animação
        slot.appendChild(img);
        resultados.push(imgIndex); // Salva o resultado
    });

    // Calcula o resultado após a rotação
    setTimeout(() => {
        calcularResultado(resultados, aposta, creditos, divResultado);
    }, 2000);
}

// Função para calcular o resultado dos slots
function calcularResultado(resultados, aposta, creditos, divResultado) {
    const padroes = [
        // Linhas
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // Colunas
        [0, 3, 6], [1, 4, 7], [2, 5, 8]
    ];

    let ganhoTotal = 0;
    let ganhou = false;

    // Verifica padrões para determinar vitória
    padroes.forEach(padrao => {
        if (resultados[padrao[0]] === resultados[padrao[1]] && resultados[padrao[0]] === resultados[padrao[2]]) {
            const ganho = aposta * 2; // Multiplica o ganho
            ganhoTotal += ganho;
            ganhou = true;
        }
    });

    // Atualiza o saldo e exibe mensagens
    if (ganhou) {
        creditos.value = parseInt(creditos.value) + ganhoTotal;
        exibirMensagem(divResultado, `Você ganhou ${ganhoTotal} créditos!`, "won");
    } else {
        exibirMensagem(divResultado, "Você perdeu. Tente novamente!", "lost");
    }
}
