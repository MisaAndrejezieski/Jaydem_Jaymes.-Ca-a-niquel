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
    const pesos = [0.08, 0.08, 0.05, 0.5, 0.05, 0.05, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01];
    const multiplicadores = [2, 3, 4, 5, 6, 7, 8, 8, 8, 9, 9, 10];
    const resultados = [];
    const divResultado = document.getElementById("results");
    const creditos = document.getElementById("creditos");
    const aposta = document.getElementById("aposta");
    const ganhos = document.getElementById("ganhos");
    const jogadas = document.getElementById("jogadas");

    const apostaValor = parseInt(aposta.value);
    let creditosValor = parseInt(creditos.value);

    // Validação de aposta
    if (apostaValor <= 0 || apostaValor > creditosValor) {
        exibirMensagem(divResultado, "Aposta inválida. Verifique seus créditos.", "error");
        return;
    }

    // Atualizar créditos e jogadas
    creditosValor -= apostaValor;
    creditos.value = creditosValor;
    jogadas.value = parseInt(jogadas.value) + 1;

    exibirMensagem(divResultado, "Rodando os slots...", "processing");

    const rodando = setInterval(() => rodar(imagens, pesos, resultados), 100);

    setTimeout(() => {
        clearInterval(rodando);
        calcularResultado(resultados, imagens, multiplicadores, apostaValor, creditos, ganhos, divResultado);
    }, 2000);
}

function rodar(imagens, pesos, resultados) {
    const divImagens = document.querySelector(".images");

    for (let i = 0; i < 9; i++) {
        const aleatorio = selecionarImagemComPeso(pesos);
        const slotAtual = divImagens.querySelector(`.slot-${i + 1}`);
        slotAtual.src = imagens[aleatorio];
        resultados[i] = imagens[aleatorio];
    }
}

function selecionarImagemComPeso(pesos) {
    const totalPesos = pesos.reduce((a, b) => a + b, 0);
    const numeroAleatorio = Math.random() * totalPesos;
    let somaPesos = 0;

    for (let i = 0; i < pesos.length; i++) {
        somaPesos += pesos[i];
        if (numeroAleatorio < somaPesos) {
            return i;
        }
    }
}

function calcularResultado(resultados, imagens, multiplicadores, apostaValor, creditos, ganhos, divResultado) {
    const padroes = [
        // Linhas
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // Colunas
        [0, 3, 6], [1, 4, 7], [2, 5, 8]
    ];

    let ganhoTotal = 0;
    let ganhou = false;

    padroes.forEach(padrao => {
        if (resultados[padrao[0]] === resultados[padrao[1]] && resultados[padrao[0]] === resultados[padrao[2]]) {
            const indiceImagem = imagens.indexOf(resultados[padrao[0]]);
            ganhoTotal += apostaValor * multiplicadores[indiceImagem];
            ganhou = true;
        }
    });

    if (ganhou) {
        creditos.value = parseInt(creditos.value) + ganhoTotal;
        ganhos.value = ganhoTotal;
        exibirMensagem(divResultado, `Parabéns! Você ganhou ${ganhoTotal} créditos!`, "won");
    } else {
        ganhos.value = 0;
        exibirMensagem(divResultado, "Você perdeu. Tente novamente!", "lost");
    }
}
