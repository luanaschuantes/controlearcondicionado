// =======================
// Variáveis Globais
// =======================
let arCondicionadoLigado = false;
let modoAtual = "---";
let bancoDeDadosSimulado = [];
let idRegistro = 1;

// Variáveis para simular conexões reais (Mantenha como 'false' para testar os alertas)
// Altere para TRUE quando o Arduino ou o BD real estiverem conectados
const IS_ARDUINO_CONNECTED = false; // Simula a conexão com o hardware de controle (Arduino)
const IS_DATABASE_CONNECTED = false; // Simula a conexão com um BD persistente

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
    // Nesta simulação, 'Administrativa' é a única que permite a ação.
    const permissao = document.getElementById("user-permission").textContent;
    if (permissao !== "Administrativa") {
        adicionarLog("Ação bloqueada: Permissão insuficiente.", "warning");
        return false;
    }
    return true;
}

// NOVIDADE: Verifica se o dispositivo de controle (Arduino) está pronto
function checkArduinoConnection() {
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
    if (!checkArduinoConnection()) { // Verifica a conexão com o Arduino
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
    if (!checkArduinoConnection()) { // Verifica a conexão com o Arduino
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
    if (!checkArduinoConnection()) { // Verifica a conexão com o Arduino
        adicionarLog("Modo Automático não ativado: Falha no sensor/controle.", "error");
        return;
    }
    adicionarLog("Modo AUTOMÁTICO ativado. O sistema gerenciará o AC com base nos sensores.", "info");
    // Aqui seria a lógica para iniciar o loop de controle automático
    registrarNoBanco();
}

function setTemperatura() {
    const novaTemp = document.getElementById("temp-desejada").value;
    tempDesejadaElemento.textContent = `${novaTemp}°C`;
    
    // Alerta se o comando de temperatura não pode ser enviado
    if (!checkArduinoConnection()) {
        adicionarLog(`Temperatura visualizada, mas não enviada ao AC.`, "warning");
        return;
    }
    
    adicionarLog(`Temperatura desejada definida para ${novaTemp}°C (Comando Enviado).`, "info");
    registrarNoBanco();
}

function setModo() {
    const novoModo = document.getElementById("modo-operacao").value;
    modoAtual = novoModo;
    modoAtualElemento.textContent = novoModo;
    
    // Alerta se o comando de modo não pode ser enviado
    if (!checkArduinoConnection()) {
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
    // NOVIDADE: ALERTA CLARO SOBRE O BANCO DE DADOS
    if (!IS_DATABASE_CONNECTED) {
        alert("🚨 ALERTA BD: O histórico de ações está sendo salvo APENAS no 'Banco de Dados Simulado' (na memória do navegador). Os dados NÃO estão sendo persistidos em um banco de dados real. Para persistir, defina 'IS_DATABASE_CONNECTED' como true.");
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
    // Limita o histórico a 10 registros
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

// Define o modo e a temperatura inicial na carga da página
document.addEventListener('DOMContentLoaded', () => {
    // Garante que a temperatura e o modo inicial sejam exibidos ao carregar
    setTemperatura(); 
    setModo(); 
});
