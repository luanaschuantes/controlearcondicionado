// Atualiza status visual
function atualizarStatus(texto, classe) {
  const statusEl = document.getElementById("status");
  statusEl.innerText = texto;
  statusEl.className = classe;
}

// Liga/Desliga (toggle)
function alternarAC() {
  const statusAtual = document.getElementById("status").innerText;
  const rota = statusAtual === "Ligado" ? "/desligar" : "/ligar";

  fetch(rota)
    .then(() => {
      if (rota === "/ligar") {
        atualizarStatus("Ligado", "ligado");
      } else {
        atualizarStatus("Desligado", "desligado");
      }
    })
    .catch(() => {
      atualizarStatus("Erro de conexão", "desligado");
    });
}

// Atualiza dados da sala
function atualizarDados() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  fetch('/dados')
    .then(resp => resp.json())
    .then(data => {
      document.getElementById('temp').innerText = `${data.temp} °C`;
      document.getElementById('umid').innerText = `${data.umid} %`;
      atualizarStatus(data.status, data.status === "Ligado" ? "ligado" : "desligado");
      document.getElementById('ultimaAtualizacao').innerText = new Date().toLocaleTimeString();

      // Alerta
      if (data.temp > 28) {
        document.getElementById("alerta").innerText = "⚠️ Temperatura Alta!";
      } else if (data.temp < 20) {
        document.getElementById("alerta").innerText = "❄️ Ambiente muito frio!";
      } else {
        document.getElementById("alerta").innerText = "";
      }

      // Consumo estimado (simulação)
      let consumo = (data.temp - 18) * 0.2;
      document.getElementById("consumo").innerText = consumo.toFixed(2) + " kWh";
    })
    .catch(() => {
      atualizarStatus("Erro ao buscar dados", "desligado");
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

// Definir temperatura desejada
function setTemperaturaDesejada() {
  let valor = prompt("Defina a temperatura desejada (°C):", 24);
  if (valor && !isNaN(valor)) {
    document.getElementById("tempDesejada").innerText = `${valor} °C`;
  }
}

// Modo econômico
function modoEconomico() {
  document.getElementById("tempDesejada").innerText = "26 °C";
  alert("🌱 Modo Econômico ativado! Temperatura ajustada para 26 °C.");
}

// Atualização automática dos dados
setInterval(atualizarDados, 5000);

// Atualização da data/hora em tempo real
function atualizarDataHora() {
  const agora = new Date();
  const data = agora.toLocaleDateString();
  const hora = agora.toLocaleTimeString();
  document.getElementById("dataHora").innerText = `${data} ${hora}`;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();
