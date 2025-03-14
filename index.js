// Configuração inicial
const configuracoes = {
    adminUser: "admin",
    adminSenha: "1234",
    qrCodeUrl: ""
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

    if (qrCodeInput.files && qrCodeInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            configuracoes.qrCodeUrl = event.target.result;
            alert("Configurações salvas com sucesso!");
        };
        reader.readAsDataURL(qrCodeInput.files[0]);
    } else {
        alert("Nenhuma imagem foi carregada.");
    }

    fecharMenuConfiguracoes();
}

// Abrir e fechar modal de QR Code
function abrirModalQRCode() {
    if (configuracoes.qrCodeUrl) {
        const qrCodeDiv = document.getElementById("qrCodeContainer");
        qrCodeDiv.innerHTML = `<img src="${configuracoes.qrCodeUrl}" alt="QR Code para pagamento">`;
        document.getElementById("qrCodeModal").style.display = "flex";
    } else {
        alert("Nenhum QR Code configurado.");
    }
}

function fecharModalQRCode() {
    document.getElementById("qrCodeModal").style.display = "none";
}

// Controle de apostas
let apostaConfirmada = false;

function confirmarAposta() {
    apostaConfirmada = true;
    exibirMensagem(document.getElementById("results"), "Aposta confirmada. Pronto para jogar!", "success");
}

// Lógica do jogo
function multiplicador() {
    if (!apostaConfirmada) {
        exibirMensagem(document.getElementById("results"), "Confirme sua aposta antes de jogar.", "error");
        return;
    }

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

    // Desativa a confirmação para a próxima rodada
    apostaConfirmada = false;
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
