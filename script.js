// Função para ligar o ar-condicionado
function ligarAC() {
  fetch('/ligar')  // Rota do Arduino
    .then(() => {
      document.getElementById('status').innerText = "Ligado";
    })
    .catch(err => console.error("Erro ao ligar AC:", err));
}

// Função para desligar o ar-condicionado
function desligarAC() {
  fetch('/desligar')
    .then(() => {
      document.getElementById('status').innerText = "Desligado";
    })
    .catch(err => console.error("Erro ao desligar AC:", err));
}

// Atualiza dados da sala (temperatura e umidade)
function atualizarDados() {
  fetch('/dados')  // Arduino deve devolver JSON
    .then(resp => resp.json())
    .then(data => {
      document.getElementById('temp').innerText = data.temp;
      document.getElementById('umid').innerText = data.umid;
      document.getElementById('status').innerText = data.status;
 })
    .catch(err => console.error("Erro ao buscar dados:", err));
}

// Atualiza a cada 5 segundos
setInterval(atualizarDados, 5000);
