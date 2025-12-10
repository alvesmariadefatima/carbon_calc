# 📊 API da Calculadora de Emissões de CO2

## Introdução

A API de Calculadora de Emissões de CO2 fornece endpoints para calcular emissões de carbono de forma dinâmica no backend.

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos de Instalação

```bash
# 1. Navegue até a pasta do projeto
cd carbon_calc

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints

### 1. Cálculo Rápido de Viagem

**POST** `/api/calculate/quick`

Calcula a emissão de CO2 para uma viagem específica.

#### Request Body
```json
{
  "origin": "São Paulo",
  "destination": "Rio de Janeiro",
  "distance": 430,
  "transportType": "car"
}
```

#### Tipos de Transporte Válidos
- `bus` - Ônibus (40g CO2/km)
- `car` - Carro (120g CO2/km)
- `motorcycle` - Moto (80g CO2/km)
- `bicycle` - Bicicleta (0g CO2)

#### Response
```json
{
  "success": true,
  "data": {
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "Carro",
    "emissionKg": 51.6,
    "emissionTons": 0.0516,
    "class": "medium",
    "comparison": {
      "status": "below_global",
      "difference": 3.95,
      "percentage": 128.9,
      "message": "..."
    },
    "recommendation": "⚠️ Considere usar transporte público para reduzir emissões."
  }
}
```

### 2. Cálculo Detalhado

**POST** `/api/calculate/detailed`

Calcula emissões detalhadas por categoria (transporte, energia, consumo).

#### Request Body
```json
{
  "transport": {
    "carKm": 500,
    "flightHours": 0,
    "publicTransportKm": 0
  },
  "energy": {
    "electricity": 150,
    "naturalGas": 20
  },
  "consumption": {
    "meatConsumption": 10,
    "waste": 50
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "categories": {
      "transport": {
        "emissionKg": 60,
        "percentage": 36.1
      },
      "energy": {
        "emissionKg": 75,
        "percentage": 45.2
      },
      "consumption": {
        "emissionKg": 35,
        "percentage": 21.1
      }
    },
    "totals": {
      "monthlyKg": 170,
      "yearlyTons": 2.04
    },
    "comparison": { ... },
    "class": "low",
    "recommendations": [
      {
        "category": "Consumo",
        "priority": "low",
        "message": "Continue mantendo suas emissões baixas!"
      }
    ]
  }
}
```

### 3. Fatores de Emissão

**GET** `/api/emission-factors`

Retorna todos os fatores de emissão disponíveis.

#### Response
```json
{
  "success": true,
  "data": {
    "transport": [
      {
        "id": "bus",
        "label": "Ônibus",
        "factor": 0.04,
        "unit": "kg CO2/km"
      },
      ...
    ],
    "energy": [...],
    "consumption": [...]
  }
}
```

### 4. Médias de Emissão

**GET** `/api/averages`

Retorna as médias de emissão de CO2 por país.

#### Response
```json
{
  "success": true,
  "data": {
    "brazilian": {
      "annual": 4.6,
      "monthly": 0.38,
      "unit": "toneladas CO2/ano"
    },
    "global": {
      "annual": 4.0,
      "monthly": 0.33,
      "unit": "toneladas CO2/ano"
    }
  }
}
```

### 5. Salvar Resultado

**POST** `/api/save-result`

Salva um resultado no histórico (simulado em memória).

#### Request Body
```json
{
  "resultType": "quick",
  "data": {
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "Carro",
    "emissionKg": 51.6
  },
  "timestamp": "2025-12-10T15:30:00Z"
}
```

#### Response
```json
{
  "success": true,
  "message": "Resultado salvo com sucesso!",
  "data": {
    "id": "result_1702250400000",
    "type": "quick",
    "data": { ... },
    "timestamp": "2025-12-10T15:30:00Z",
    "saved": true
  }
}
```

### 6. Health Check

**GET** `/api/health`

Verifica o status da API.

#### Response
```json
{
  "success": true,
  "message": "API de Calculadora de CO2 está funcionando!",
  "timestamp": "2025-12-10T15:30:00Z"
}
```

## 🔢 Classificação de Emissões

As emissões são classificadas em 3 níveis:

| Classe | Tons/Ano | Cor |
|--------|----------|-----|
| `low` | ≤ 2 | 🟢 Verde |
| `medium` | 2 - 5 | 🟡 Amarelo |
| `high` | > 5 | 🔴 Vermelho |

## ⚠️ Códigos de Erro

- **400** - Bad Request (campo obrigatório faltando ou inválido)
- **404** - Not Found (rota não encontrada)
- **500** - Internal Server Error

## 🔄 Fluxo de Integração

1. **Frontend** envia dados via `POST /api/calculate/quick`
2. **Backend** valida os dados
3. **Backend** calcula as emissões
4. **Backend** retorna resultado com recomendações
5. **Frontend** exibe resultado de forma visual

## 📝 Exemplo de Uso com JavaScript

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

async function calcularEmissao() {
  const response = await fetch(`${API_BASE_URL}/calculate/quick`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      origin: 'São Paulo',
      destination: 'Rio de Janeiro',
      distance: 430,
      transportType: 'car'
    })
  });

  const result = await response.json();
  
  if (result.success) {
    console.log(`Emissão: ${result.data.emissionKg} kg CO2`);
    console.log(`Recomendação: ${result.data.recommendation}`);
  }
}
```

## 🧪 Testes com cURL

```bash
# Teste rápido de cálculo
curl -X POST http://localhost:3000/api/calculate/quick \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "car"
  }'

# Verificar health check
curl http://localhost:3000/api/health

# Obter fatores de emissão
curl http://localhost:3000/api/emission-factors
```

## 📊 Estrutura de Dados

### Objeto de Emissão
```javascript
{
  origin: string,              // Cidade de origem
  destination: string,         // Cidade de destino
  distance: number,            // Distância em km
  transportType: string,       // Tipo de transporte
  emissionKg: number,          // Emissão em kg CO2
  emissionTons: number,        // Emissão em toneladas CO2
  class: 'low'|'medium'|'high',// Classificação
  comparison: {                // Comparação com média
    status: string,
    difference: number,
    percentage: number,
    message: string
  },
  recommendation: string       // Recomendação personalizada
}
```

## 🔐 Segurança

- CORS habilitado para desenvolvimento
- Validação de entrada em todas as rotas
- Tratamento de erros completo
- No dados sensíveis armazenados

## 📈 Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Histórico persistente de resultados
- [ ] Banco de dados para armazenamento
- [ ] API de cidades (distância automática)
- [ ] Gráficos e análises avançadas
- [ ] Exportar resultados em PDF
- [ ] Comparação com outros usuários

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através dos canais de suporte do projeto.

---

**Desenvolvido com 💓 por DIO & Maria de Fátima**
