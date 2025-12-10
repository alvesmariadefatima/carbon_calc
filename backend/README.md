# 🚀 Backend - Calculadora de Emissões CO2

Backend Express.js para cálculo dinâmico de emissões de carbono.

## 📋 Índice

- [Instalação](#instalação)
- [Execução](#execução)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Estrutura](#estrutura)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 🔧 Instalação

```powershell
# Navegue até a pasta backend
cd backend

# Instale as dependências
npm install
```

**Dependências:**
- `express` - Framework web
- `cors` - Middleware CORS
- `dotenv` - Gerenciamento de variáveis de ambiente

---

## ▶️ Execução

```powershell
# Modo produção
npm start

# Modo desenvolvimento (com reload automático)
npm run dev
```

O servidor iniciará em: `http://localhost:3001`

---

## 🗺️ Rotas Disponíveis

### 🏠 Rotas Principais (Frontend)

#### `GET /`
Serve o arquivo `index.html` do frontend (página inicial).

```bash
curl http://localhost:3001/
```

**Resposta:** HTML da página inicial

---

#### `GET /calculator`
Serve `index.html` (roteamento SPA para página de calculadora).

```bash
curl http://localhost:3001/calculator
```

---

#### `GET /about`
Serve `index.html` (roteamento SPA para página sobre).

```bash
curl http://localhost:3001/about
```

---

#### `GET /contact`
Serve `index.html` (roteamento SPA para página de contato).

```bash
curl http://localhost:3001/contact
```

---

### 🔌 Rotas da API

#### `POST /api/calculate/quick`
Calcula emissão de CO2 para uma viagem rápida.

**Request:**
```json
{
  "origin": "São Paulo",
  "destination": "Rio de Janeiro",
  "distance": 430,
  "transportType": "car"
}
```

**Parâmetros:**
- `origin` (string) - Cidade de origem
- `destination` (string) - Cidade de destino
- `distance` (number) - Distância em km
- `transportType` (string) - Tipo de transporte: `bus`, `car`, `motorcycle`, `bicycle`, `flight`, `publicTransport`

**Response (Sucesso):**
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
    "class": "low",
    "comparison": "~3.1 kg CO2 por mês se usar esse transporte regularmente",
    "recommendation": "Considere usar transporte público ou compartilhar caronas para reduzir emissões."
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3001/api/calculate/quick \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "car"
  }'
```

---

#### `POST /api/calculate/detailed`
Calcula emissão detalhada considerando múltiplas categorias.

**Request:**
```json
{
  "transport": {
    "type": "car",
    "distancePerMonth": 1000
  },
  "energy": {
    "electricityKwhPerMonth": 200,
    "naturalGasM3PerMonth": 50
  },
  "consumption": {
    "meatKgPerMonth": 10,
    "wasteKgPerMonth": 20
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transport": {
      "type": "Carro",
      "emissionTons": 1.44,
      "percentage": 72
    },
    "energy": {
      "emissionTons": 0.5,
      "percentage": 25
    },
    "consumption": {
      "emissionTons": 0.07,
      "percentage": 3
    },
    "totalEmissionTons": 2.01,
    "monthlyEmissionTons": 0.1675,
    "annualEmissionTons": 2.01,
    "recommendations": [
      "Reduzir uso do carro é o fator mais impactante",
      "Considere usar energia renovável",
      "Reduzir consumo de carne vermelha ajuda significativamente"
    ]
  }
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3001/api/calculate/detailed \
  -H "Content-Type: application/json" \
  -d '{
    "transport": {"type": "car", "distancePerMonth": 1000},
    "energy": {"electricityKwhPerMonth": 200, "naturalGasM3PerMonth": 50},
    "consumption": {"meatKgPerMonth": 10, "wasteKgPerMonth": 20}
  }'
```

---

#### `GET /api/emission-factors`
Retorna todos os fatores de emissão disponíveis no sistema.

**Response:**
```json
{
  "success": true,
  "data": {
    "transport": {
      "bus": { "factor": 0.04, "label": "Ônibus" },
      "car": { "factor": 0.12, "label": "Carro" },
      "motorcycle": { "factor": 0.08, "label": "Moto" },
      "bicycle": { "factor": 0.0, "label": "Bicicleta" },
      "flight": { "factor": 0.255, "label": "Voo (por hora)" },
      "publicTransport": { "factor": 0.04, "label": "Transporte Público" }
    },
    "energy": {
      "electricity": { "factor": 0.5, "label": "Eletricidade (kWh)" },
      "naturalGas": { "factor": 2, "label": "Gás Natural (m³)" }
    },
    "consumption": {
      "meatConsumption": { "factor": 27, "label": "Carne Vermelha (kg)" },
      "waste": { "factor": 0.5, "label": "Resíduos (kg)" }
    }
  }
}
```

**Exemplo cURL:**
```bash
curl http://localhost:3001/api/emission-factors
```

---

#### `GET /api/averages`
Retorna as médias anuais de emissões brasileira e global.

**Response:**
```json
{
  "success": true,
  "data": {
    "brazilian": 4.6,
    "global": 4.0,
    "unit": "toneladas CO2 por ano"
  }
}
```

**Exemplo cURL:**
```bash
curl http://localhost:3001/api/averages
```

---

#### `POST /api/save-result`
Salva um resultado de cálculo (simulado em memória).

**Request:**
```json
{
  "type": "quick",
  "data": {
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "car",
    "emissionTons": 0.0516
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resultado salvo com sucesso",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-12-10T15:30:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3001/api/save-result \
  -H "Content-Type: application/json" \
  -d '{
    "type": "quick",
    "data": {
      "origin": "São Paulo",
      "destination": "Rio de Janeiro",
      "distance": 430,
      "transportType": "car",
      "emissionTons": 0.0516
    }
  }'
```

---

#### `GET /api/health`
Verifica se o servidor está funcionando (health check).

**Response:**
```json
{
  "success": true,
  "message": "Servidor CO2 em funcionamento",
  "timestamp": "2025-12-10T15:30:00.000Z"
}
```

**Exemplo cURL:**
```bash
curl http://localhost:3001/api/health
```

---

### ❌ Tratamento de Erros

#### Erro 400 - Requisição Inválida
Quando faltam parâmetros obrigatórios ou valores inválidos.

```json
{
  "success": false,
  "error": "Campos obrigatórios: origin, destination, distance, transportType"
}
```

#### Erro 404 - Rota Não Encontrada
Para rotas API inexistentes:

```json
{
  "success": false,
  "error": "Rota da API não encontrada",
  "path": "/api/inexistente"
}
```

Para rotas não-API inexistentes: Serve `index.html` (SPA routing)

#### Erro 500 - Erro Interno do Servidor

```json
{
  "success": false,
  "error": "Erro ao processar requisição"
}
```

---

## 📁 Estrutura

```
backend/
├── server.js          # Arquivo principal com todas as rotas e lógica
├── package.json       # Dependências e scripts
├── .env              # Variáveis de ambiente
└── README.md         # Este arquivo
```

---

## 🌍 Variáveis de Ambiente

Arquivo `.env`:

```bash
# Porta do servidor backend
PORT=3001

# Ambiente (development ou production)
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

---

## 📊 Tipos de Transporte Disponíveis

| Tipo | Fator (kg CO2/km) | Descrição |
|------|------------------|-----------|
| 🚌 Ônibus | 0.04 | Transporte coletivo urbano |
| 🚗 Carro | 0.12 | Automóvel particular |
| 🏍️ Moto | 0.08 | Motocicleta |
| 🚴 Bicicleta | 0.0 | Zero emissões |
| ✈️ Voo | 0.255 | Por hora de voo |
| 🚊 Transporte Público | 0.04 | Ônibus, metrô, trem |

---

## 📈 Classificação de Emissões

- 🟢 **Baixa** (low): ≤ 2 toneladas CO2/ano
- 🟡 **Média** (medium): 2 - 5 toneladas CO2/ano
- 🔴 **Alta** (high): > 5 toneladas CO2/ano

---

## 🔄 Fluxo de Requisição

```
Cliente (Frontend)
    ↓
GET/POST /api/*
    ↓
Express Middleware (CORS, JSON)
    ↓
Validação de Entrada
    ↓
Cálculo de Emissão
    ↓
Resposta JSON
    ↓
Cliente (Frontend)
```

---

## 💡 Exemplos de Uso

### Com JavaScript (Fetch API)

```javascript
const API_BASE_URL = 'http://localhost:3001/api';

// Calcular emissão rápida
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
console.log(result);
```

### Com Python

```python
import requests

api_url = 'http://localhost:3001/api/calculate/quick'
data = {
    'origin': 'São Paulo',
    'destination': 'Rio de Janeiro',
    'distance': 430,
    'transportType': 'car'
}

response = requests.post(api_url, json=data)
print(response.json())
```

---

## 🧪 Testar Rotas

Use o arquivo `../docs/requests.http` para testar todas as rotas com a extensão REST Client do VS Code.

---

## 📝 Notas Importantes

- O servidor usa CORS aberto (`*`) em desenvolvimento
- Dados de resultados são salvos em memória (não persistem)
- Para produção, considere implementar banco de dados
- Validações acontecem no servidor (backend)

---

## 👨‍💻 Desenvolvido com 💓 por DIO & Maria de Fátima
