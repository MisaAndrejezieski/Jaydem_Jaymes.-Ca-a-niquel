// Configuração inicial (valores padrão)
const configuracoes = {
    adminUser: "admin",
    adminSenha: "1234",
    qrCodeUrl: "https://example.com/qrcode.png" // URL pré-definida para o QR Code
};

// Função para exibir mensagens dinâmicas
function exibirMensagem(elemento, mensagem, classe) {
    elemento.innerHTML = mensagem;
    elemento.className = classe || '';
}

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

// Validação de aposta
function validarAposta(apostaValor, creditosValor) {
    if (apostaValor <= 0) return "O valor da aposta deve ser maior que zero.";
    if (apostaValor > creditosValor) return "Créditos insuficientes para apostar.";
    return null;
}
