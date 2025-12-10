import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para aceitar requisições de múltiplas origens
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://alvesmariadefatima.github.io',
    process.env.CORS_ORIGIN || '*'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// NÃO servir arquivos estáticos ainda - primeiro processar as rotas da API
// app.use(express.static(join(__dirname, '../frontend')));

// ===================================
// Fatores de Emissão
// ===================================

const emissionFactors = {
  transport: {
    bus: { factor: 0.04, label: 'Ônibus' },
    car: { factor: 0.12, label: 'Carro' },
    motorcycle: { factor: 0.08, label: 'Moto' },
    bicycle: { factor: 0.0, label: 'Bicicleta' },
    flight: { factor: 0.255, label: 'Voo (por hora)' },
    publicTransport: { factor: 0.04, label: 'Transporte Público' }
  },
  energy: {
    electricity: { factor: 0.5, label: 'Eletricidade (kWh)' },
    naturalGas: { factor: 2, label: 'Gás Natural (m³)' }
  },
  consumption: {
    meatConsumption: { factor: 27, label: 'Carne Vermelha (kg)' },
    waste: { factor: 0.5, label: 'Resíduos (kg)' }
  }
};

const averages = {
  brazilian: 4.6,
  global: 4.0
};

// ===================================
// Rotas da API
// ===================================

/**
 * POST /api/calculate/quick
 * Calcula emissão de uma viagem rápida
 */
app.post('/api/calculate/quick', (req, res) => {
  try {
    const { origin, destination, distance, transportType } = req.body;

    // Validação
    if (!origin || !destination || !distance || !transportType) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: origin, destination, distance, transportType'
      });
    }

    if (distance <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Distância deve ser maior que 0'
      });
    }

    // Obter fator de emissão
    const transport = emissionFactors.transport[transportType];
    if (!transport) {
      return res.status(400).json({
        success: false,
        error: `Tipo de transporte inválido. Opções: ${Object.keys(emissionFactors.transport).join(', ')}`
      });
    }

    // Calcular emissão
    const emission = distance * transport.factor;
    const emissionClass = getEmissionClass(emission);

    res.json({
      success: true,
      data: {
        origin,
        destination,
        distance,
        transportType: transport.label,
        emissionKg: parseFloat(emission.toFixed(2)),
        emissionTons: parseFloat((emission / 1000).toFixed(4)),
        class: emissionClass,
        comparison: getComparison(emission / 1000 / 12), // Converter para mensal para comparação
        recommendation: getTransportRecommendation(transportType)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/calculate/detailed
 * Calcula emissões detalhadas por categoria
 */
app.post('/api/calculate/detailed', (req, res) => {
  try {
    const { transport = {}, energy = {}, consumption = {} } = req.body;

    // Calcular emissões por categoria
    const transportEmission = calculateCategory(transport, 'transport');
    const energyEmission = calculateCategory(energy, 'energy');
    const consumptionEmission = calculateCategory(consumption, 'consumption');

    const totalMonthly = transportEmission + energyEmission + consumptionEmission;
    const totalYearly = totalMonthly * 12;
    const emissionClass = getEmissionClass(totalYearly / 1000);

    res.json({
      success: true,
      data: {
        categories: {
          transport: {
            emissionKg: parseFloat(transportEmission.toFixed(2)),
            percentage: totalMonthly > 0 ? ((transportEmission / totalMonthly) * 100).toFixed(1) : 0
          },
          energy: {
            emissionKg: parseFloat(energyEmission.toFixed(2)),
            percentage: totalMonthly > 0 ? ((energyEmission / totalMonthly) * 100).toFixed(1) : 0
          },
          consumption: {
            emissionKg: parseFloat(consumptionEmission.toFixed(2)),
            percentage: totalMonthly > 0 ? ((consumptionEmission / totalMonthly) * 100).toFixed(1) : 0
          }
        },
        totals: {
          monthlyKg: parseFloat(totalMonthly.toFixed(2)),
          yearlyTons: parseFloat((totalYearly / 1000).toFixed(2))
        },
        comparison: getComparison(totalYearly / 1000),
        class: emissionClass,
        recommendations: getDetailedRecommendations(transport, energy, consumption, totalMonthly)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/emission-factors
 * Retorna todos os fatores de emissão disponíveis
 */
app.get('/api/emission-factors', (req, res) => {
  res.json({
    success: true,
    data: {
      transport: Object.entries(emissionFactors.transport).map(([key, value]) => ({
        id: key,
        label: value.label,
        factor: value.factor,
        unit: 'kg CO2/km'
      })),
      energy: Object.entries(emissionFactors.energy).map(([key, value]) => ({
        id: key,
        label: value.label,
        factor: value.factor,
        unit: value.label.includes('kWh') ? 'kg CO2/kWh' : 'kg CO2/m³'
      })),
      consumption: Object.entries(emissionFactors.consumption).map(([key, value]) => ({
        id: key,
        label: value.label,
        factor: value.factor,
        unit: 'kg CO2/kg'
      }))
    }
  });
});

/**
 * GET /api/averages
 * Retorna as médias de emissão (Brasil e Global)
 */
app.get('/api/averages', (req, res) => {
  res.json({
    success: true,
    data: {
      brazilian: {
        annual: averages.brazilian,
        monthly: parseFloat((averages.brazilian / 12).toFixed(2)),
        unit: 'toneladas CO2/ano'
      },
      global: {
        annual: averages.global,
        monthly: parseFloat((averages.global / 12).toFixed(2)),
        unit: 'toneladas CO2/ano'
      }
    }
  });
});

/**
 * POST /api/save-result
 * Salva resultado em histórico (simulado)
 */
app.post('/api/save-result', (req, res) => {
  try {
    const { resultType, data, timestamp } = req.body;

    if (!resultType || !data) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: resultType, data'
      });
    }

    // Simular salvamento em banco de dados
    const savedResult = {
      id: `result_${Date.now()}`,
      type: resultType,
      data,
      timestamp: timestamp || new Date().toISOString(),
      saved: true
    };

    res.json({
      success: true,
      message: 'Resultado salvo com sucesso!',
      data: savedResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===================================
// Funções Auxiliares
// ===================================

function calculateCategory(data, category) {
  let total = 0;
  const factors = emissionFactors[category];

  Object.entries(data).forEach(([key, value]) => {
    if (factors[key] && value > 0) {
      total += value * factors[key].factor;
    }
  });

  return total;
}

function getEmissionClass(tonnes) {
  if (tonnes <= 2) return 'low';
  if (tonnes <= 5) return 'medium';
  return 'high';
}

function getComparison(yearlyTonnes) {
  let status = '';
  let difference = 0;
  let percentage = 0;

  if (yearlyTonnes <= averages.global) {
    status = 'below_global';
    difference = (averages.global - yearlyTonnes).toFixed(2);
    percentage = ((yearlyTonnes / averages.global) * 100).toFixed(1);
  } else if (yearlyTonnes <= averages.brazilian) {
    status = 'below_brazilian';
    difference = (averages.brazilian - yearlyTonnes).toFixed(2);
    percentage = ((yearlyTonnes / averages.brazilian) * 100).toFixed(1);
  } else {
    status = 'above_brazilian';
    difference = (yearlyTonnes - averages.brazilian).toFixed(2);
    percentage = ((yearlyTonnes / averages.brazilian) * 100).toFixed(1);
  }

  return {
    status,
    difference: parseFloat(difference),
    percentage: parseFloat(percentage),
    message: getComparisonMessage(status, difference, yearlyTonnes)
  };
}

function getComparisonMessage(status, difference, yearlyTonnes) {
  switch (status) {
    case 'below_global':
      return `Parabéns! Você está ${difference} toneladas abaixo da média global de ${averages.global} toneladas.`;
    case 'below_brazilian':
      return `Você está próximo à média brasileira. ${difference} toneladas abaixo de ${averages.brazilian} toneladas.`;
    case 'above_brazilian':
      return `Você está ${difference} toneladas acima da média brasileira de ${averages.brazilian} toneladas. Procure reduzir suas emissões!`;
    default:
      return 'Análise indisponível';
  }
}

function getTransportRecommendation(transportType) {
  const recommendations = {
    bus: '✓ Ótima escolha! O ônibus é uma opção sustentável.',
    car: '⚠️ Considere usar transporte público para reduzir emissões.',
    motorcycle: '✓ Bom! Motos têm menor impacto que carros.',
    bicycle: '✓ Excelente! Zero emissões!',
    flight: '⚠️ Voos têm alto impacto. Considere alternativas quando possível.',
    publicTransport: '✓ Ótima escolha! Transporte público é sustentável.'
  };

  return recommendations[transportType] || 'Considere alternativas mais sustentáveis.';
}

function getDetailedRecommendations(transport, energy, consumption, totalMonthly) {
  const recommendations = [];

  // Análise de transporte
  const transportTotal = calculateCategory(transport, 'transport');
  if (transportTotal > 100) {
    recommendations.push({
      category: 'Transporte',
      priority: 'high',
      message: 'Use transporte público, bicicleta ou carona compartilhada para reduzir emissões.'
    });
  } else if (transportTotal > 50) {
    recommendations.push({
      category: 'Transporte',
      priority: 'medium',
      message: 'Aumente o uso de transporte público.'
    });
  }

  // Análise de energia
  const energyTotal = calculateCategory(energy, 'energy');
  if (energyTotal > 75) {
    recommendations.push({
      category: 'Energia',
      priority: 'high',
      message: 'Instale painéis solares ou troque por energia renovável.'
    });
  } else if (energyTotal > 50) {
    recommendations.push({
      category: 'Energia',
      priority: 'medium',
      message: 'Reduza o consumo de eletricidade: use LED, desligue aparelhos em stand-by.'
    });
  }

  // Análise de consumo
  const consumptionTotal = calculateCategory(consumption, 'consumption');
  if (consumptionTotal > 270) {
    recommendations.push({
      category: 'Consumo',
      priority: 'high',
      message: 'Reduza significativamente o consumo de carne vermelha ou torne-se vegetariano.'
    });
  } else if (consumptionTotal > 100) {
    recommendations.push({
      category: 'Consumo',
      priority: 'medium',
      message: 'Diminua o consumo de carne vermelha ou escolha proteínas alternativas.'
    });
  }

  // Se nenhuma recomendação crítica
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'Geral',
      priority: 'low',
      message: 'Continue mantendo suas emissões baixas!'
    });
    recommendations.push({
      category: 'Geral',
      priority: 'low',
      message: 'Plante árvores para compensar suas emissões.'
    });
  }

  return recommendations;
}

// ===================================
// Health Check
// ===================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de Calculadora de CO2 está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ===================================
// Servir arquivos estáticos do frontend (DEPOIS de todas as rotas API)
// ===================================

app.use(express.static(join(__dirname, '../frontend')));

// ===================================
// Rotas Principais (Frontend) - SPA Routing
// ===================================

// Rota raiz - serve index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// Rota para qualquer requisição não-API - serve index.html (SPA)
app.get('/calculator', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// ===================================
// Tratamento de erros 404
// ===================================

app.use((req, res) => {
  // Se for uma rota API, retorna JSON de erro
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'Rota da API não encontrada',
      path: req.path
    });
  }
  // Caso contrário, serve o index.html (SPA routing)
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// ===================================
// Iniciar servidor
// ===================================

app.listen(PORT, () => {
  console.log(`✨ Servidor de CO2 rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
