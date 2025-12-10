/* ===================================
   Calculadora de Emissões de CO2 - Formulário Rápido com API
   =================================== */

// Detectar ambiente e configurar URL da API
const API_BASE_URL = (() => {
  // Em desenvolvimento local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Em produção (GitHub Pages ou servidor remoto)
  // Ajuste a URL de acordo com seu backend em produção
  // Por exemplo, se usar Vercel, Heroku, Railway, etc.
  return process.env.REACT_APP_API_URL || 'https://seu-backend-aqui.com/api';
})();

// Fatores de emissão por tipo de transporte (em kg CO2 por km)
const transportEmissions = {
    bus: 0.04,          // Ônibus: ~40g CO2 por km
    car: 0.12,          // Carro: ~120g CO2 por km
    motorcycle: 0.08,   // Moto: ~80g CO2 por km
    bicycle: 0.0        // Bicicleta: 0g CO2
};

const transportNames = {
    bus: 'Ônibus',
    car: 'Carro',
    motorcycle: 'Moto',
    bicycle: 'Bicicleta'
};

// Obter elementos do formulário rápido
const quickCalculator = document.getElementById('quick-calculator');
const transportButtons = document.querySelectorAll('.transport-btn');
const selectedTransportInput = document.getElementById('selected-transport');

let selectedTransport = null;

// Adicionar listeners nos botões de transporte
transportButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Remover classe ativa de todos os botões
        transportButtons.forEach(b => b.classList.remove('active'));
        
        // Adicionar classe ativa ao botão clicado
        btn.classList.add('active');
        
        // Armazenar o transporte selecionado
        selectedTransport = btn.dataset.transport;
        selectedTransportInput.value = selectedTransport;
    });
});

// Adicionar listener para submissão do formulário rápido
quickCalculator.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!selectedTransport) {
        alert('Por favor, selecione um tipo de transporte!');
        return;
    }
    
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const distance = parseFloat(document.getElementById('distance').value);
    
    // Validar inputs
    if (!origin || !destination || !distance || distance <= 0) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }
    
    // Mostrar carregamento
    showLoadingState();
    
    try {
        // Fazer requisição à API
        const response = await fetch(`${API_BASE_URL}/calculate/quick`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin,
                destination,
                distance,
                transportType: selectedTransport
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            // Exibir resultado
            showQuickResult(result.data);
            
            // Salvar resultado no histórico
            saveResult('quick', result.data);
        } else {
            alert(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.error('Erro ao calcular:', error);
        
        // Fallback para cálculo local
        console.log('Usando cálculo local...');
        const emissionFactor = transportEmissions[selectedTransport];
        const totalEmission = (distance * emissionFactor).toFixed(2);
        
        showQuickResult({
            origin,
            destination,
            distance,
            transportType: transportNames[selectedTransport],
            emissionKg: totalEmission,
            emissionTons: (totalEmission / 1000).toFixed(4),
            class: getEmissionClass(totalEmission),
            comparison: { message: 'Cálculo local realizado' },
            recommendation: '✓ Cálculo concluído'
        });
    }
});

function showLoadingState() {
    const existingResult = document.querySelector('.quick-result');
    if (existingResult) {
        existingResult.remove();
    }

    const loadingHTML = `
        <div class="quick-result loading">
            <div class="spinner"></div>
            <p>Calculando emissões...</p>
        </div>
    `;

    quickCalculator.insertAdjacentHTML('afterend', loadingHTML);
}

function showQuickResult(data) {
    // Criar elemento de resultado
    const resultHTML = `
        <div class="quick-result">
            <h3>📊 Resultado da Viagem</h3>
            <div class="result-content">
                <p><strong>Origem:</strong> ${data.origin}</p>
                <p><strong>Destino:</strong> ${data.destination}</p>
                <p><strong>Distância:</strong> ${data.distance} km</p>
                <p><strong>Transporte:</strong> ${data.transportType}</p>
                <p class="emission-result"><strong>Emissão de CO2:</strong> <span class="emission-value ${getEmissionClass(data.emissionKg)}">${data.emissionKg} kg CO2</span></p>
                <p style="color: var(--color-primary); margin-top: var(--spacing-md); font-weight: 500;">${data.recommendation}</p>
            </div>
        </div>
    `;
    
    // Verificar se já existe um resultado e remover
    const existingResult = document.querySelector('.quick-result');
    if (existingResult) {
        existingResult.remove();
    }
    
    // Inserir novo resultado após o formulário
    quickCalculator.insertAdjacentHTML('afterend', resultHTML);
    
    // Scroll para o resultado
    document.querySelector('.quick-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getEmissionClass(emission) {
    const em = parseFloat(emission);
    if (em < 10) {
        return 'emission-low';
    } else if (em < 50) {
        return 'emission-medium';
    } else {
        return 'emission-high';
    }
}

async function saveResult(type, data) {
    try {
        await fetch(`${API_BASE_URL}/save-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resultType: type,
                data,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.log('Resultado não pôde ser salvo:', error);
    }
}

/* ===================================
   Menu Sanduíche (Hamburger Menu)
   =================================== */

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('a');

// Abrir/fechar menu ao clicar no botão sanduíche
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Fechar menu ao clicar fora dele
document.addEventListener('click', (event) => {
    const isClickInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
    
    if (!isClickInside && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ===================================
   Calculadora de Emissões de CO2
   =================================== */

// Fatores de emissão (em kg CO2)
const emissionFactors = {
    carKm: 0.12,              // kg CO2 por km
    flightHours: 0.255,       // kg CO2 por hora
    publicTransportKm: 0.04,  // kg CO2 por km
    electricity: 0.5,         // kg CO2 por kWh
    naturalGas: 2,            // kg CO2 por m³
    meatConsumption: 27,      // kg CO2 por kg
    waste: 0.5                // kg CO2 por kg
};

// Médias para comparação (anuais em toneladas)
const averages = {
    brazilian: 4.6,
    global: 4.0
};

// Obter o formulário
const carbonForm = document.getElementById('carbon-form');

// Adicionar listener para submissão do formulário
carbonForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateEmissions();
});

function calculateEmissions() {
    // Obter valores do formulário
    const carKm = parseFloat(document.getElementById('car-km').value) || 0;
    const flightHours = parseFloat(document.getElementById('flight-hours').value) || 0;
    const publicTransport = parseFloat(document.getElementById('public-transport').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const naturalGas = parseFloat(document.getElementById('natural-gas').value) || 0;
    const meatConsumption = parseFloat(document.getElementById('meat-consumption').value) || 0;
    const waste = parseFloat(document.getElementById('waste-generation').value) || 0;

    // Calcular emissões por categoria
    const transportEmissions = 
        (carKm * emissionFactors.carKm) +
        (flightHours * emissionFactors.flightHours) +
        (publicTransport * emissionFactors.publicTransportKm);

    const energyEmissions = 
        (electricity * emissionFactors.electricity) +
        (naturalGas * emissionFactors.naturalGas);

    const consumptionEmissions = 
        (meatConsumption * emissionFactors.meatConsumption) +
        (waste * emissionFactors.waste);

    // Totais mensais
    const totalMonthly = transportEmissions + energyEmissions + consumptionEmissions;
    
    // Totais anuais
    const totalYearly = totalMonthly * 12 / 1000; // Converter para toneladas

    // Exibir resultados
    displayResults(
        transportEmissions,
        energyEmissions,
        consumptionEmissions,
        totalMonthly,
        totalYearly
    );
}

function displayResults(transport, energy, consumption, totalMonthly, totalYearly) {
    // Atualizar valores na página
    document.getElementById('transport-emissions').textContent = 
        transport.toFixed(2) + ' kg CO2';
    document.getElementById('energy-emissions').textContent = 
        energy.toFixed(2) + ' kg CO2';
    document.getElementById('consumption-emissions').textContent = 
        consumption.toFixed(2) + ' kg CO2';
    document.getElementById('total-monthly').textContent = 
        totalMonthly.toFixed(2) + ' kg CO2';
    document.getElementById('total-yearly').textContent = 
        totalYearly.toFixed(2) + ' toneladas CO2';

    // Mostrar container de resultados
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');

    // Adicionar classificação por cor
    updateEmissionColor(totalYearly);

    // Adicionar comparação com média
    updateComparison(totalYearly);

    // Atualizar recomendações
    updateRecommendations(transport, energy, consumption);

    // Scroll para resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateEmissionColor(yearlyEmission) {
    const totalYearlyElement = document.getElementById('total-yearly');
    
    // Remover classes anteriores
    totalYearlyElement.classList.remove('emission-low', 'emission-medium', 'emission-high');
    
    // Adicionar classe apropriada
    if (yearlyEmission <= 2) {
        totalYearlyElement.classList.add('emission-low');
    } else if (yearlyEmission <= 5) {
        totalYearlyElement.classList.add('emission-medium');
    } else {
        totalYearlyElement.classList.add('emission-high');
    }
}

function updateComparison(yearlyEmission) {
    const comparisonText = document.getElementById('comparison-text');
    let comparison = '';
    let badge = '';

    if (yearlyEmission <= averages.global) {
        comparison = `Parabéns! Você está abaixo da média global de ${averages.global} toneladas.`;
        badge = '<span class="comparison-badge below-average">✓ Abaixo da média</span>';
    } else if (yearlyEmission <= averages.brazilian) {
        comparison = `Você está próximo à média brasileira de ${averages.brazilian} toneladas.`;
        badge = '<span class="comparison-badge above-average">⚠ Próximo à média</span>';
    } else {
        const difference = (yearlyEmission - averages.brazilian).toFixed(2);
        comparison = `Você está ${difference} toneladas acima da média brasileira de ${averages.brazilian} toneladas.`;
        badge = '<span class="comparison-badge above-average">✗ Acima da média</span>';
    }

    comparisonText.innerHTML = comparison + ' ' + badge;
}

function updateRecommendations(transport, energy, consumption) {
    const recommendationsList = document.getElementById('recommendations');
    const recommendations = [];

    // Limpar recomendações anteriores
    recommendationsList.innerHTML = '';

    // Analisar cada categoria e adicionar recomendações
    if (transport > 100) {
        recommendations.push('Use transporte público, bicicleta ou carona compartilhada para reduzir emissões de transportes');
    }
    if (transport > 50 && transport <= 100) {
        recommendations.push('Considere aumentar o uso de transporte público');
    }

    if (energy > 75) {
        recommendations.push('Instale painéis solares ou troque por energia renovável');
    }
    if (energy > 50 && energy <= 75) {
        recommendations.push('Reduza o consumo de eletricidade: use LED, desligue aparelhos em stand-by');
    }

    if (consumption > 270) {
        recommendations.push('Reduza significativamente o consumo de carne vermelha ou torne-se vegetariano');
    }
    if (consumption > 100 && consumption <= 270) {
        recommendations.push('Diminua o consumo de carne vermelha ou escolha proteínas alternativas');
    }

    if (recommendations.length === 0) {
        recommendations.push('Continue mantendo suas emissões baixas!');
        recommendations.push('Compartilhe suas práticas sustentáveis com outras pessoas');
        recommendations.push('Plante árvores para compensar suas emissões');
    }

    // Adicionar recomendações à lista
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
}

/* ===================================
   Inicialização
   =================================== */

console.log('Calculadora de CO2 carregada com sucesso!');
