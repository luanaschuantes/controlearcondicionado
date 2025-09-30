// =======================
// Variáveis Globais
// =======================
let arCondicionadoLigado = false;
let modoAtual = "---";
let bancoDeDadosSimulado = [];
let idRegistro = 1;

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

// =======================
// Funções de Controle
// =======================
function ligarAr() {
  if (!checkPermission()) return;
  if (arCondicionadoLigado) {
    adicionarLog("O AC já está LIGADO.", "info");
    return;
  }

  arCondicionadoLigado = true;
  statusDispositivo.textContent = "LIGADO";
  statusDispositivo.classList.remove("status-desligado");
  statusDispositivo.classList.add("status-ligado");
  adicionarLog("Ar condicionado LIGADO com sucesso.", "success");
  registrarNoBanco();
}

function desligarAr() {
  if (!checkPermission()) return;
  if (!arCondicionadoLigado) {
    adicionarLog("O AC já está DESLIGADO.", "info");
    return;
  }

  arCondicionadoLigado = false;
  statusDispositivo.textContent = "DESLIGADO";
  statusDispositivo.classList.remove("status-ligado");
  statusDispositivo.classList.add("status-desligado");
  adicionarLog("Ar condicionado DESLIGADO com sucesso.", "error");
  registrarNoBanco();
}

function setAutomatico() {
  if (!checkPermission()) return;
  adicionarLog("Modo AUTOMÁTICO ativado. O sistema gerenciará o AC com base nos sensores.", "info");
  // Simulação de controle automático (poderia ligar/desligar dependendo da temp ambiente)
}

function setTemperatura() {
  const novaTemp = document.getElementById("temp-desejada").value;
  tempDesejadaElemento.textContent = `${novaTemp}°C`;
  adicionarLog(`Temperatura desejada definida para ${novaTemp}°C.`, "info");
}

function setModo() {
  const novoModo = document.getElementById("modo-operacao").value;
  modoAtual = novoModo;
  modoAtualElemento.textContent = novoModo;
  adicionarLog(`Modo de operação alterado para ${novoModo}.`, "info");
  registrarNoBanco();
}

// ============================
// Simulação de Banco de Dados
// ============================

function registrarNoBanco() {
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
