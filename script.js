// --- Funções de Utilidade e Feedback Visual ---

// Função auxiliar para mostrar/esconder o loader
function toggleLoader(mostrar) {
    const loader = document.getElementById("loader");
    loader.style.display = mostrar ? "block" : "none";
}

// Atualiza status visual (Ligado/Desligado)
function atualizarStatus(texto, classe) {
    const statusEl = document.getElementById("status");
    statusEl.innerText = texto;
    statusEl.className = classe;
}

// Atualização da data/hora em tempo real
function atualizarDataHora() {
    const agora = new Date();
    const data = agora.toLocaleDateString();
    const hora = agora.toLocaleTimeString();
    document.getElementById("dataHora").innerText = `${data} ${hora}`;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();


// --- Funções de Controle (Comunicação com o Servidor) ---

// Liga/Desliga (toggle) e envia comando ao servidor
function alternarAC() {
    const statusAtual = document.getElementById("status").innerText;
    const isLigado = statusAtual === "Ligado";
    const rota = isLigado ? "/desligar" : "/ligar";

    toggleLoader(true);

    fetch(rota, { method: 'POST' })
        .then(response => {
            if (!response.ok) throw new Error('Falha no comando do servidor');
            
            // Atualização otimista
            const novoTexto = isLigado ? "Desligado" : "Ligado";
            const novaClasse = isLigado ? "desligado" : "ligado";
            atualizarStatus(novoTexto, novaClasse);
            
            atualizarDados(); 
        })
        .catch(() => {
            atualizarStatus("Erro de conexão", "desligado");
            alert("❌ Erro ao enviar comando para o dispositivo.");
        })
        .finally(() => {
            // O loader será escondido por 'atualizarDados'
        });
}

// Envia a nova temperatura desejada para o servidor
function setTemperaturaDesejada() {
    const tempAtual = document.getElementById("tempDesejada").innerText.replace(' °C', '');
    let valor = prompt("Defina a temperatura desejada (°C):", tempAtual);
    
    if (valor && !isNaN(valor) && parseFloat(valor) >= 18 && parseFloat(valor) <= 30) {
        toggleLoader(true);
        const temp = parseFloat(valor);

        fetch('/set-temp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ temp: temp })
        })
        .then(response => {
            if (!response.ok) throw new Error('Falha ao definir temperatura.');
            document.getElementById("tempDesejada").innerText = `${temp} °C`;
            alert(`Temperatura desejada ajustada para ${temp} °C.`);
            atualizarDados();
        })
        .catch(() => {
            alert("❌ Erro ao enviar a temperatura para o dispositivo.");
        })
        .finally(() => {
            toggleLoader(false);
        });
    } else if (valor) {
         alert("Valor inválido. Use um número entre 18 e 30.");
    }
}

// Ativa o Modo Econômico (seta a 26°C e envia para o servidor)
function modoEconomico() {
    const tempEconomica = 26;
    
    toggleLoader(true);

    fetch('/modo-economico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp: tempEconomica })
    })
    .then(response => {
        if (!response.ok) throw new Error('Falha ao ativar modo econômico.');

        document.getElementById("tempDesejada").innerText = `${tempEconomica} °C`;
        alert("🌱 Modo Econômico ativado! Temperatura ajustada para 26 °C.");
        atualizarDados();
    })
    .catch(() => {
        alert("❌ Erro ao ativar o Modo Econômico.");
    })
    .finally(() => {
        toggleLoader(false);
    });
}


// --- Lógica de Atualização de Dados (Preenche todos os campos) ---

// Simulação de dados que viriam do servidor (para fins de teste/exemplo)
const dadosSimulados = {
    temp: 24.8, 
    tempExterna: 31.5, // NOVO
    umid: 65,
    status: "Ligado",
    tempDesejada: 24,

    statusCompressor: "Ativo", 
    velocidadeFluxo: "Alta", 
    tempEvaporador: 8.1,
    tempoFunc: "2h 15m", // NOVO
    
    conexao: "Online",
    voltagem: 4.98,
    ciclos: 15,
    modoAtual: "Frio",
    timerConfig: "Desligado",
    consumo: 0.45,
    filtroVidaUtil: "85%", // NOVO
    firmware: "V2.1.3", // NOVO
    ipDispositivo: "192.168.1.10",
    historicoAlerta: "Falha de Leitura (1h atrás)" // NOVO
};


// Função principal para buscar e exibir dados
function atualizarDados() {
    toggleLoader(true);

    fetch('/dados')
        .then(resp => resp.json())
        .then(data => {
            
            // Se o fetch real falhar, descomente a linha abaixo para testar a UI:
            // const data = dadosSimulados; 
            
            // ----------------------------------------------------
            // 1. INFO PRINCIPAL
            // ----------------------------------------------------
            document.getElementById('temp').innerText = `${data.temp.toFixed(1)} °C`;
            document.getElementById('tempExterna').innerText = `${data.tempExterna.toFixed(1)} °C`;
            document.getElementById('umid').innerText = `${data.umid} %`;
            document.getElementById('ultimaAtualizacao').innerText = new Date().toLocaleTimeString();
            atualizarStatus(data.status, data.status === "Ligado" ? "ligado" : "desligado");

            // ----------------------------------------------------
            // 2. DETALHES DO SISTEMA (secundario)
            // ----------------------------------------------------
            document.getElementById('tempoFunc').innerText = data.tempoFunc;
            document.getElementById('statusCompressor').innerText = data.statusCompressor;
            document.getElementById('velocidadeFluxo').innerText = data.velocidadeFluxo;
            document.getElementById('tempEvaporador').innerText = `${data.tempEvaporador.toFixed(1)} °C`;
            
            const conexaoEl = document.getElementById('conexao');
            conexaoEl.innerText = data.conexao;
            conexaoEl.className = data.conexao === "Online" ? "ativo" : "inativo"; 
            document.getElementById('firmware').innerText = data.firmware;
            document.getElementById('ipDispositivo').innerText = data.ipDispositivo;

            // ----------------------------------------------------
            // 3. CONFIGURAÇÕES E MÉTRICAS (extra)
            // ----------------------------------------------------
            document.getElementById("tempDesejada").innerText = `${data.tempDesejada} °C`;
            document.getElementById("consumo").innerText = data.consumo.toFixed(2) + " kWh";
            document.getElementById('modoAtual').innerText = data.modoAtual;
            document.getElementById('filtroVidaUtil').innerText = data.filtroVidaUtil;
            document.getElementById('historicoAlerta').innerText = data.historicoAlerta;

            // ----------------------------------------------------
            // 4. LÓGICA DE ALERTA
            // ----------------------------------------------------
            const tempDesejada = parseFloat(document.getElementById("tempDesejada").innerText);
            if (data.temp > tempDesejada + 2 && data.status === "Ligado") {
                document.getElementById("alerta").innerText = "⚠️ Temp. acima do desejado! Ajustando...";
            } else if (data.temp < 20 && data.status === "Desligado") {
                document.getElementById("alerta").innerText = "❄️ Ambiente frio. AC está desligado.";
            } else {
                document.getElementById("alerta").innerText = "";
            }

        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            document.getElementById("alerta").innerText = "❌ Falha na comunicação com o dispositivo.";
            // Define o status de conexão como inativo em caso de falha
            document.getElementById('conexao').innerText = "Offline";
            document.getElementById('conexao').className = "inativo";
        })
        .finally(() => {
            toggleLoader(false);
        });
}

// Atualização automática dos dados a cada 5 segundos
setInterval(atualizarDados, 5000);
// Chama a função uma vez ao carregar a página
atualizarDados();
