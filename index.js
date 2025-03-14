// Configuração inicial
const configuracoes = {
    adminUser: "admin",
    adminSenha: "1234",
    adminEmail: "",
    qrCodeUrl: localStorage.getItem("qrCodeUrl") || "" // Carrega o QR Code do localStorage, se disponível
};

// Função para exibir mensagens dinâmicas
function exibirMensagem(elemento, mensagem, classe) {
    elemento.innerHTML = mensagem;
    elemento.className = classe || '';
}

// Abrir e fechar menu de configurações
function abrirMenuConfiguracoes() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === configuracoes.adminSenha) {
        document.getElementById("configuracoes").style.display = "block";
        document.getElementById("adminUser").value = configuracoes.adminUser;
        document.getElementById("adminSenha").value = configuracoes.adminSenha;
        document.getElementById("adminEmail").value = configuracoes.adminEmail;
    } else {
        alert("Senha incorreta!");
    }
}

function fecharMenuConfiguracoes() {
    document.getElementById("configuracoes").style.display = "none";
}

function salvarConfiguracoes() {
    const qrCodeInput = document.getElementById("qrCodeImage");
    configuracoes.adminUser = document.getElementById("adminUser").value;
    configuracoes.adminSenha = document.getElementById("adminSenha").value;
    configuracoes.adminEmail = document.getElementById("adminEmail").value;

    if (qrCodeInput.files && qrCodeInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            configuracoes.qrCodeUrl = event.target.result;
            localStorage.setItem("qrCodeUrl", configuracoes.qrCodeUrl); // Salva no localStorage
            alert("Configurações salvas com sucesso!");
        };
        reader.readAsDataURL(qrCodeInput.files[0]);
    } else if (!configuracoes.qrCodeUrl) {
        alert("Nenhuma imagem foi carregada.");
    } else {
        alert("Configurações salvas sem alterar o QR Code.");
    }

    fecharMenuConfiguracoes();
}

// Solicitar pagamento com QR Code
function solicitarPagamento() {
    if (configuracoes.qrCodeUrl) {
        const qrCodeDiv = document.getElementById("qrCodeContainer");
        qrCodeDiv.innerHTML = `<img src="${configuracoes.qrCodeUrl}" alt="QR Code para pagamento">`;
        document.getElementById("qrCodeModal").style.display = "flex";

        // Notificar administrador por e-mail (simulado no console)
        enviarEmailAdmin();
    } else {
        alert("Nenhum QR Code configurado.");
    }
}

// Fechar o modal e simular confirmação de pagamento
function fecharModalQRCode() {
    document.getElementById("qrCodeModal").style.display = "none";
    exibirMensagem(document.getElementById("results"), "Pagamento confirmado. Créditos adicionados!", "won");
}

// Simular envio de e-mail para o administrador
function enviarEmailAdmin() {
    if (configuracoes.adminEmail) {
        console.log(`E-mail enviado para o administrador: ${configuracoes.adminEmail}`);
        alert("Um e-mail foi enviado ao administrador para confirmar o pagamento.");
    } else {
        alert("E-mail do administrador não configurado.");
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
    