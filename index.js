// Configuração inicial (valores padrão)
const configuracoes = {
    adminUser: "admin",
    adminSenha: "1234",
    qrCodeUrl: "https://example.com/qrcode.png" // URL pré-definida para o QR Code
};

// Função para abrir o menu de configurações
function abrirMenuConfiguracoes() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === configuracoes.adminSenha) {
        document.getElementById("configuracoes").style.display = "block";
        document.getElementById("adminUser").value = configuracoes.adminUser;
        document.getElementById("adminSenha").value = configuracoes.adminSenha;
        document.getElementById("qrCodeUrl").value = configuracoes.qrCodeUrl;
    } else {
        alert("Senha incorreta!");
    }
}

// Função para fechar o menu de configurações
function fecharMenuConfiguracoes() {
    document.getElementById("configuracoes").style.display = "none";
}

// Função para salvar as configurações
function salvarConfiguracoes() {
    configuracoes.adminUser = document.getElementById("adminUser").value;
    configuracoes.adminSenha = document.getElementById("adminSenha").value;
    configuracoes.qrCodeUrl = document.getElementById("qrCodeUrl").value;
    alert("Configurações salvas com sucesso!");
    fecharMenuConfiguracoes();
}

// Função para iniciar o pagamento com QR Code pré-definido
function iniciarPagamentoPix() {
    const divResultado = document.getElementById("results");
    const qrCodeDiv = document.getElementById("qrCodeContainer");

    exibirMensagem(divResultado, "Use o QR Code abaixo para realizar o pagamento.", "processing");
    qrCodeDiv.innerHTML = `
        <h3>Escaneie o QR Code:</h3>
        <img src="${configuracoes.qrCodeUrl}" alt="QR Code para pagamento">
    `;
    qrCodeDiv.classList.add('show');
}

// Outras funções, como multiplicador, permanecem iguais...
