// ============================
// Simulação de Banco de Dados
// ============================

let bancoDeDadosSimulado = [];
let idRegistro = 1;

function registrarNoBanco() {
  const agora = new Date();
  const dataHora = agora.toLocaleString('pt-BR');
  const status = arCondicionadoLigado ? "Ligado" : "Desligado";
  const tempAtual = tempAmbienteElemento.textContent;
  const modo = modoAtual;

  const novoRegistro = {
    id: idRegistro++,
    dataHora,
    status,
    temperatura: tempAtual,
    modo
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

  bancoDeDadosSimulado.forEach(registro => {
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

// Adiciona chamadas nos locais corretos:
function ligarAr() {
  if (!checkPermission()) return;
  if (arCondicionadoLigado) {
    adicionarLog("O AC já está LIGADO.", 'info');
    return;
 
