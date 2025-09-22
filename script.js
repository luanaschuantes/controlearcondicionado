// ------------------------------
// 🔄 Funções de Utilidade e Feedback Visual
// ------------------------------

function toggleLoader(mostrar) {
    const loader = document.getElementById("loader");
    loader.style.display = mostrar ? "block" : "none";
}

function atualizarStatus(texto, classe) {
    const statusEl = document.getElementById("status");
    statusEl.innerText = texto;
    statusEl.className = classe;
}

function atualizarDataHora() {
    const agora = new Date();
    const data = agora.toLocaleDateString();
    const hora = agora.toLocaleTimeString();
    document.getElementById("dataHora").innerText = `${data} ${hora}`;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();

function logUsuario(mensagem) {
    const logArea = document.getElementById("logUsuario");
    const hora = new Date().toLocaleTimeString();
    logArea.innerHTML += `<div>[${hora}] ${mensagem}</div>`;
}


// ------------------------------
// ⚙️ Comandos ao Dispositivo
// ------------------------------

function alternarAC() {
    const statusAtual = document.getElementById("status").innerText;
    const isLigado = statusAtual === "Ligado";
    const rota = isLigado ? "/desligar" : "/ligar";

    toggleLoader(true);

    fetch(rota, { method: 'POST' })
        .then(response => {
            if (!response.ok) throw new Error();
            atualizarStatus(isLigado ? "Desligado" : "Ligado", isLigado ? "desligado" : "ligado");
            logUsuario(`AC ${isLigado ? "desligado" : "ligado"}`);
            atualizarDados();
        })
        .catch(() => {
            atualizarStatus("Erro de conexão", "desligado");
            alert("❌ Erro ao enviar comando.");
        })
        .finally(() => toggleLoader(false));
}

function setTemperaturaDesejada() {
    const tempAtual = document.getElementById("tempDesejada").innerText.replace(' °C', '');
    let valor = prompt("Defina a temperatura desejada (°C):", tempAtual);

    if (valor && !isNaN(valor) && parseFloat(valor) >= 18 && parseFloat(valor) <= 30) {
        const temp = parseFloat(valor);
        toggleLoader(true);

        fetch('/set-temp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ temp })
        })
        .then(resp => {
            if (!resp.ok) throw new Error();
            document.getElementById("tempDesejada").innerText = `${temp} °C`;
            logUsuario(`Temperatura ajustada para ${temp} °C`);
            atualizarDados();
        })
        .catch(() => alert("❌ Erro ao definir temperatura."))
        .finally(() => toggleLoader(false));
    } else if (valor) {
        alert("❗ Valor inválido. Digite entre 18 e 30 °C.");
    }
}

function modoEconomico() {
    const tempEconomica = 26;
    toggleLoader(true);

    fetch('/modo-economico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp: tempEconomica })
    })
    .then(resp => {
        if (!resp.ok) throw new Error();
        document.getElementById("tempDesejada").innerText = `${tempEconomica} °C`;
        alert("🌱 Modo Econômico ativado!");
        logUsuario("Modo Econômico ativado");
        atualizarDados();
    })
    .catch(() => alert("❌ Erro ao ativar modo econômico."))
    .finally(() => toggleLoader(false));
}

function modoTurbo() {
    toggleLoader(true);
    fetch('/modo-turbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp: 18 })
    })
    .then(resp => {
        if (!resp.ok) throw new Error();
        document.getElementById("tempDesejada").innerText = "18 °C";
        alert("🚀 Modo Turbo ativado! Fluxo máximo.");
        logUsuario("Modo Turbo ativado");
        atualizarDados();
    })
    .catch(() => alert("❌ Erro ao ativar modo turbo."))
    .finally(() => toggleLoader(false));
}

function resetSistema() {
    if (confirm("Tem certeza que deseja reiniciar o sistema?")) {
        toggleLoader(true);
        fetch('/reset', { method: 'POST' })
        .then(resp => {
            if (!resp.ok) throw new Error();
            alert("🔄 Sistema reiniciado com sucesso.");
            logUsuario("Sistema reiniciado");
            atualizarDados();
        })
        .catch(() => alert("❌ Falha ao reiniciar o sistema."))
        .finally(() => toggleLoader(false));
    }
}

function exportarCSV() {
    fetch('/exportar-csv')
        .then(resp => resp.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "dados_ar_condicionado.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            logUsuario("Exportação CSV realizada");
        })
        .catch(() => alert("❌ Erro ao exportar CSV."));
}


// ------------------------------
// 📡 Atualização dos Dados
// ------------------------------

function atualizarDados() {
    toggleLoader(true);

    fetch('/dados')
        .then(resp => resp.json())
        .then(data => {
            document.getElementById('temp').innerText = `${data.temp.toFixed(1)} °C`;
            document.getElementById('tempExterna').innerText = `${data.tempExterna.toFixed(1)} °C`;
            document.getElementById('umid').innerText = `${data.umid} %`;
            document.getElementById('ultimaAtualizacao').innerText = new Date().toLocaleTimeString();

            atualizarStatus(data.status, data.status === "Ligado" ? "ligado" : "desligado");

            document.getElementById('tempoFunc').innerText = data.tempoFunc;
            document.getElementById('statusCompressor').innerText = data.statusCompressor;
            document.getElementById('velocidadeFluxo').innerText = data.velocidadeFluxo;
            document.getElementById('tempEvaporador').innerText = `${data.tempEvaporador.toFixed(1)} °C`;

            const conexaoEl = document.getElementById('conexao');
            conexaoEl.innerText = data.conexao;
            conexaoEl.className = data.conexao === "Online" ? "ativo" : "inativo";

            document.getElementById('firmware').innerText = data.firmware;
            document.getElementById('ipDispositivo').innerText = data.ipDispositivo;

            document.getElementById("tempDesejada").innerText = `${data.tempDesejada} °C`;
            document.getElementById("consumo").innerText = data.consumo.toFixed(2) + " kWh";
            document.getElementById('modoAtual').innerText = data.modoAtual;
            document.getElementById('filtroVidaUtil').innerText = data.filtroVidaUtil;
            document.getElementById('historicoAlerta').innerText = data.historicoAlerta;

            // 🔔 Nova lógica de alertas
            const alertaEl = document.getElementById("alerta");
            const tempDesejada = parseFloat(data.tempDesejada);

            if (data.temp > tempDesejada + 2 && data.status === "Ligado") {
                alertaEl.innerText = "⚠️ Temperatura acima do desejado!";
                alertaEl.className = "alerta quente";
            } else if (data.temp < 20 && data.status === "Desligado") {
                alertaEl.innerText = "❄️ Ambiente frio. AC está desligado.";
                alertaEl.className = "alerta frio";
            } else {
                alertaEl.innerText = "";
                alertaEl.className = "";
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            document.getElementById("alerta").innerText = "❌ Falha na comunicação.";
            document.getElementById('conexao').innerText = "Offline";
            document.getElementById('conexao').className = "inativo";
        })
        .finally(() => toggleLoader(false));
}

// 🔁 Atualização Automática
setInterval(atualizarDados, 5000);
atualizarDados();
