// =======================
// Variáveis Globais
// =======================
let arCondicionadoLigado = false;
let modoAtual = "---";
let bancoDeDadosSimulado = [];
let idRegistro = 1;

// NOVO: Variáveis para simular conexões reais
const IS_ARDUINO_CONNECTED = false; // Mude para true quando conectado ao hardware
const IS_DATABASE_CONNECTED = false; // Mude para true quando conectado ao BD real

const tempAmbienteElemento = document.getElementById("temp-ambiente");
const statusDispositivo = document.getElementById("status-dispositivo");
const modoAtualElemento = document.getElementById("modo-atual");
const tempDesejadaElemento = document.getElementById("temp-desejada-valor");
const logArea = document.getElementById("log-area");

// =======================
// Utilitários
// =======================
function adicionarLog(mensagem, tipo = "info") {
    const agora = new Date().toLocaleTimeString();
    const log = document.createElement("p");
    log.className = `log-item ${tipo}`;
    log.textContent = `[${agora}] ${mensagem}`;
    logArea.prepend(log);
}

function checkPermission() {
    const permissao = document.getElementById("user-permission").textContent;
    if (permissao !== "Administrativa") {
        adicionarLog("Ação bloqueada: Permissão insuficiente.", "warning");
        return false;
    }
    return true;
}

// NOVO: Função para verificar se o sistema está pronto para a ação real
function checkConnection() {
    if (!IS_ARDUINO_CONNECTED) {
        alert("⚠️ ATENÇÃO: Dispositivo de controle (Arduino) não conectado. O comando não será enviado ao hardware.");
        return false;
    }
    return true;
}

// =======================
// Funções de Controle
// =======================
function ligarAr() {
    if (!checkPermission()) return;
    if (!checkConnection()) { // Verifica a conexão antes de prosseguir
        adicionarLog("AC não LIGADO: Falha na comunicação com o Arduino.", "error");
        return; 
    }
    if (arCondicionadoLigado) {
        adicionarLog("O AC já está LIGADO.", "info");
        return;
    }

    arCondicionadoLigado = true;
    statusDispositivo.textContent = "LIGADO";
    statusDispositivo.classList.remove("status-desligado");
    statusDispositivo.classList.add("status-ligado");
    adicionarLog("Ar condicionado LIGADO (Comando Enviado).", "success");
    registrarNoBanco();
}

function desligarAr() {
    if (!checkPermission()) return;
    if (!checkConnection()) { // Verifica a conexão antes de prosseguir
        adicionarLog("AC não DESLIGADO: Falha na comunicação com o Arduino.", "error");
        return; 
    }
    if (!arCondicionadoLigado) {
        adicionarLog("O AC já está DESLIGADO.", "info");
        return;
    }

    arCondicionadoLigado = false;
    statusDispositivo.textContent = "DESLIGADO";
    statusDispositivo.classList.remove("status-ligado");
    statusDispositivo.classList.add("status-desligado");
    adicionarLog("Ar condicionado DESLIGADO (Comando Enviado).", "error");
    registrarNoBanco();
}

function setAutomatico() {
    if (!checkPermission()) return;
    if (!checkConnection()) { // Verifica a conexão
        adicionarLog("Modo Automático não ativado: Falha no sensor/controle.", "error");
        return;
    }
    adicionarLog("Modo AUTOMÁTICO ativado. O sistema gerenciará o AC com base nos sensores.", "info");
    // Lógica para iniciar o loop de controle automático aqui
}

function setTemperatura() {
    const novaTemp = document.getElementById("temp-desejada").value;
    tempDesejadaElemento.textContent = `${novaTemp}°C`;
    
    // Alerta se o comando de temperatura não pode ser enviado
    if (!checkConnection()) {
        adicionarLog(`Temperatura desejada visualizada, mas não enviada ao AC.`, "warning");
        return;
    }
    
    adicionarLog(`Temperatura desejada definida para ${novaTemp}°C (Comando Enviado).`, "info");
}

function setModo() {
    const novoModo = document.getElementById("modo-operacao").value;
    modoAtual = novoModo;
    modoAtualElemento.textContent = novoModo;
    
    // Alerta se o comando de modo não pode ser enviado
    if (!checkConnection()) {
        adicionarLog(`Modo visualizado, mas não enviado ao AC.`, "warning");
        return;
    }

    adicionarLog(`Modo de operação alterado para ${novoModo} (Comando Enviado).`, "info");
    registrarNoBanco();
}

// ============================
// Simulação de Banco de Dados
// ============================

function registrarNoBanco() {
    // Alerta se o registro deve ir para o BD real
    if (!IS_DATABASE_CONNECTED) {
        alert("⚠️ ATENÇÃO: O registro de log está sendo salvo apenas na memória (BD Simulado), não no Banco de Dados real.");
    }
    
    const agora = new Date();
    const dataHora = agora.toLocaleString("pt-BR");
    const status = arCondicionadoLigado ? "Ligado" : "Desligado";
    const tempAtual = tempAmbienteElemento.textContent;

    const novoRegistro = {
        id: idRegistro++,
        dataHora,
        status,
        temperatura: tempAtual,
        modo: modoAtual,
    };

    bancoDeDadosSimulado.unshift(novoRegistro);
    if (bancoDeDadosSimulado.length > 10) {
        bancoDeDadosSimulado.pop();
    }

    atualizarTabela();
}

function atualizarTabela() {
    const tbody = document.querySelector("#tabela-banco tbody");
    tbody.innerHTML = "";

    bancoDeDadosSimulado.forEach((registro) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.dataHora}</td>
            <td>${registro.status}</td>
            <td>${registro.temperatura}</td>
            <td>${registro.modo}</td>
        `;
        tbody.appendChild(linha);
    });
}

// =======================
// Atualizar Data e Hora
// =======================
function atualizarRelogio() {
    const agora = new Date();
    document.getElementById("data-hora").textContent = agora.toLocaleString("pt-BR");
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();
