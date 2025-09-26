// Variáveis de Estado Global
let arCondicionadoLigado = false;
let temperaturaDesejada = 22;
let modoAtual = "Ventilacao";
let papelDoUsuario = "professor"; // 'professor' ou 'tecnico' (simulação de permissão)

// Elementos DOM
const statusElemento = document.getElementById('status-dispositivo');
const logArea = document.getElementById('log-area');
const tempAmbienteElemento = document.getElementById('temp-ambiente');
const umidadeElemento = document.getElementById('umidade');
const pressaoGasElemento = document.getElementById('pressao-gas');
const consumoKwElemento = document.getElementById('consumo-kw');
const velocidadeElemento = document.getElementById('velocidade');
const modoAtualElemento = document.getElementById('modo-atual');

// --- 1. FUNÇÕES ESSENCIAIS (DATA/HORA e LOG) ---

function adicionarLog(mensagem, tipo = 'info') {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR');
    const novoLog = document.createElement('p');
    novoLog.className = `log-item ${tipo}`;
    novoLog.textContent = `[${hora}] ${mensagem}`;
    
    // Adiciona no topo e limita o número de logs
    logArea.prepend(novoLog);
    if (logArea.children.length > 10) {
        logArea.removeChild(logArea.lastChild);
    }
}

function atualizarDataHora() {
    const agora = new Date();
    const opcoes = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dataHoraFormatada = agora.toLocaleTimeString('pt-BR', opcoes);
    document.getElementById('data-hora').textContent = dataHoraFormatada;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();


// --- 2. SIMULAÇÃO DE SENSORES ---

function simularLeituras() {
    // Simulação da temperatura ambiente com variação natural
    let tempAmbiente = parseFloat(tempAmbienteElemento.textContent);
    
    // Pequena variação para simular ambiente dinâmico
    let variacao = (Math.random() - 0.5) * 0.2; 

    if (arCondicionadoLigado && modoAtual === "Frio") {
        // Se ligado e no frio, a temperatura ambiente tende a cair em direção à desejada
        if (tempAmbiente > temperaturaDesejada) {
            variacao -= 0.3; 
        }
        // Simulação de consumo maior
        consumoKwElemento.textContent = (Math.random() * (1.2 - 0.8) + 0.8).toFixed(1) + ' kW';
    } else if (arCondicionadoLigado && modoAtual === "Aquecimento") {
        // Se ligado e no aquecimento, a temperatura tende a subir
        if (tempAmbiente < temperaturaDesejada) {
            variacao += 0.3; 
        }
        consumoKwElemento.textContent = (Math.random() * (1.5 - 1.0) + 1.0).toFixed(1) + ' kW';
    } else {
         // Se desligado, temperatura tende a subir (aquecimento natural da sala)
        if (tempAmbiente < 28) { // Limite máximo para a sala
             variacao += 0.05; 
        }
        consumoKwElemento.textContent = (Math.random() * (0.3 - 0.1) + 0.1).toFixed(1) + ' kW'; // Consumo baixo (ventilação)
    }

    tempAmbiente = tempAmbiente + variacao;
    tempAmbiente = Math.min(Math.max(tempAmbiente, 18.0), 30.0); // Limite de 18°C a 30°C

    tempAmbienteElemento.textContent = tempAmbiente.toFixed(1) + '°C';
    
    // Umidade e Pressão (apenas variação aleatória para complexidade)
    umidadeElemento.textContent = (Math.random() * (70 - 50) + 50).toFixed(0) + '%';
    pressaoGasElemento.textContent = (Math.random() * (5.5 - 4.5) + 4.5).toFixed(1) + ' bar';

    // Checagem de Alerta de Temperatura
    if (tempAmbiente > 28.0 && !arCondicionadoLigado) {
        adicionarLog(`ALERTA: Temperatura da Sala atingiu 28.0°C! Considere ligar o AC.`, 'alert');
    }
}
// Atualiza a cada 5 segundos
setInterval(simularLeituras, 5000);
simularLeituras();


// --- 3. FUNÇÕES DE CONTROLE (BOTÕES) ---

function checkPermission() {
    // Apenas técnicos podem fazer manutenção (simulação de funcionalidade)
    if (papelDoUsuario !== 'tecnico') {
        // Se a funcionalidade fosse mais complexa (e.g., redefinir sistema)
        // return false; 
    }
    return true;
}

function atualizarStatusDisplay() {
    if (arCondicionadoLigado) {
        statusElemento.textContent = "LIGADO";
        statusElemento.classList.remove('status-desligado');
        statusElemento.classList.add('status-ligado');
        modoAtualElemento.textContent = modoAtual;
    } else {
        statusElemento.textContent = "DESLIGADO";
        statusElemento.classList.remove('status-ligado');
        statusElemento.classList.add('status-desligado');
        modoAtualElemento.textContent = "---";
        velocidadeElemento.textContent = "Desligada";
    }
    
    document.getElementById('temp-desejada-valor').textContent = `${temperaturaDesejada}°C`;
}

function ligarAr() {
    if (!checkPermission()) return;
    if (arCondicionadoLigado) {
        adicionarLog("O AC já está LIGADO.", 'info');
        return;
    }
    arCondicionadoLigado = true;
    modoAtual = document.getElementById('modo-operacao').value; // Usa o modo selecionado
    velocidadeElemento.textContent = "Média";
    atualizarStatusDisplay();
    adicionarLog(`AC LIGADO no modo: ${modoAtual}. Temp: ${temperaturaDesejada}°C.`);
}

function desligarAr() {
    if (!checkPermission()) return;
    arCondicionadoLigado = false;
    atualizarStatusDisplay();
    adicionarLog("AC DESLIGADO pelo usuário.", 'info');
}

function setAutomatico() {
    if (!checkPermission()) return;
    if (!arCondicionadoLigado) ligarAr();
    
    modoAtual = "Automático";
    document.getElementById('modo-operacao').value = "Frio"; // Reseta o select visualmente
    velocidadeElemento.textContent = "Automática";
    atualizarStatusDisplay();
    adicionarLog("Modo de Operação definido para AUTOMÁTICO (Controle inteligente).");
}

function setTemperatura() {
    if (!checkPermission()) return;
    const novaTemp = parseInt(document.getElementById('temp-desejada').value);
    
    if (novaTemp >= 18 && novaTemp <= 26) {
        temperaturaDesejada = novaTemp;
        atualizarStatusDisplay();
        adicionarLog(`Temperatura desejada ajustada para ${temperaturaDesejada}°C.`);
        if (arCondicionadoLigado && modoAtual === 'Automático') {
             // Força a saída do Automático se a temperatura for alterada manualmente
             modoAtual = document.getElementById('modo-operacao').value; 
        }
    } else {
        alert("Atenção! Defina uma temperatura entre 18°C e 26°C.");
        adicionarLog("Tentativa de ajuste de temperatura fora dos limites (18-26°C).", 'alert');
    }
}

function setModo() {
    if (!checkPermission()) return;
    if (arCondicionadoLigado) {
        modoAtual = document.getElementById('modo-operacao').value;
        velocidadeElemento.textContent = (modoAtual === 'Ventilacao') ? 'Alta' : 'Média';
        atualizarStatusDisplay();
        adicionarLog(`Modo de operação alterado para ${modoAtual}.`);
    } else {
        alert("Ligue o Ar Condicionado primeiro para alterar o modo.");
        document.getElementById('modo-operacao').value = modoAtual; // Mantém o valor anterior no select
    }
}

// Configuração Inicial
document.addEventListener('DOMContentLoaded', () => {
    // Configura o papel do usuário no display
    document.getElementById('user-role').textContent = papelDoUsuario.charAt(0).toUpperCase() + papelDoUsuario.slice(1);
    document.getElementById('user-permission').textContent = (papelDoUsuario === 'tecnico') ? 'Total' : 'Administrativa';
    
    // Inicializa
    atualizarStatusDisplay();
});
