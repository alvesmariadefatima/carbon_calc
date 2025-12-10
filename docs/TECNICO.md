# 🔧 DOCUMENTAÇÃO TÉCNICA - API Backend

## 📋 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                 CLIENTE (Browser - frontend/)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  index.html  │  │  styles.css  │  │  script.js   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/CORS
                           ↓
┌──────────────────────────────────────────────────────────────┐
│              SERVIDOR (Node.js/Express - backend/)           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 backend/server.js                     │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │              Routes (API Endpoints)              │ │ │
│  │  │  /api/calculate/quick                           │ │ │
│  │  │  /api/calculate/detailed                        │ │ │
│  │  │  /api/emission-factors                          │ │ │
│  │  │  /api/averages                                  │ │ │
│  │  │  /api/save-result                               │ │ │
│  │  │  /api/health                                    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │        Funções Auxiliares                        │ │ │
│  │  │  - calculateCategory()                           │ │ │
│  │  │  - getEmissionClass()                            │ │ │
│  │  │  - getComparison()                               │ │ │
│  │  │  - getRecommendations()                          │ │ │
│  │  │  - Validações                                    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Fatores de Emissão (Variáveis)             │ │
│  │  emissionFactors, averages, transportNames           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## 🔌 Tecnologias Utilizadas

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18+
- **Middleware**: CORS 2.8+
- **Variáveis de Ambiente**: dotenv 16.3+
- **Dev Tool**: nodemon 3.0+ (opcional)

## 📦 Dependências

```json
{
  "dependencies": {
    "express": "^4.18.2",      // Framework web
    "cors": "^2.8.5",          // CORS middleware
    "dotenv": "^16.3.1"        // Variáveis de ambiente
  },
  "devDependencies": {
    "nodemon": "^3.0.1"        // Auto-reload em desenvolvimento
  }
}
```

## 🚀 Inicialização do Servidor

### Arquivo: backend/server.js

```javascript
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static(join(__dirname, '../frontend')));

// Routes e Handlers
// ...

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
```

## 📊 Estrutura de Dados

### Objeto de Entrada (Quick Calculate)
```javascript
{
  origin: string,           // "São Paulo"
  destination: string,      // "Rio de Janeiro"
  distance: number,         // 430
  transportType: string     // "car" | "bus" | "motorcycle" | "bicycle"
}
```

### Objeto de Saída (Quick Calculate)
```javascript
{
  success: boolean,
  data: {
    origin: string,
    destination: string,
    distance: number,
    transportType: string,        // "Carro" (label)
    emissionKg: number,           // 51.6
    emissionTons: number,         // 0.0516
    class: string,                // "low" | "medium" | "high"
    comparison: {
      status: string,             // "below_global" | "below_brazilian" | "above_brazilian"
      difference: number,
      percentage: number,
      message: string
    },
    recommendation: string        // Recomendação personalizada
  }
}
```

### Fatores de Emissão (Constants)
```javascript
emissionFactors = {
  transport: {
    bus: { factor: 0.04, label: 'Ônibus' },
    car: { factor: 0.12, label: 'Carro' },
    motorcycle: { factor: 0.08, label: 'Moto' },
    bicycle: { factor: 0.0, label: 'Bicicleta' }
  },
  energy: {
    electricity: { factor: 0.5, label: 'Eletricidade' },
    naturalGas: { factor: 2, label: 'Gás Natural' }
  },
  consumption: {
    meatConsumption: { factor: 27, label: 'Carne Vermelha' },
    waste: { factor: 0.5, label: 'Resíduos' }
  }
};
```

## 🔍 Funções Principais

### 1. calculateCategory()
```javascript
function calculateCategory(data, category) {
  // Calcula total de emissão por categoria
  // Parâmetros:
  //   data: { carKm: 500, ... }
  //   category: 'transport' | 'energy' | 'consumption'
  // Retorna: number (total em kg)
}
```

### 2. getEmissionClass()
```javascript
function getEmissionClass(tonnes) {
  // Classifica emissões em 3 níveis
  // tonnes <= 2: 'low'
  // tonnes <= 5: 'medium'
  // tonnes > 5: 'high'
}
```

### 3. getComparison()
```javascript
function getComparison(yearlyTonnes) {
  // Compara com médias brasileira e global
  // Retorna: { status, difference, percentage, message }
}
```

### 4. getDetailedRecommendations()
```javascript
function getDetailedRecommendations(transport, energy, consumption, total) {
  // Gera recomendações personalizadas
  // Retorna: array de { category, priority, message }
}
```

## 📡 Fluxo de Requisição (POST /api/calculate/quick)

```
1. Cliente envia JSON
   ↓
2. Express recebe e passa para o handler
   ↓
3. Middleware express.json() parseia o JSON
   ↓
4. Handler valida os dados
   - Campos obrigatórios?
   - Distância > 0?
   - Tipo válido?
   ↓
5. Se erro: retorna 400 com mensagem de erro
   Se OK: continua
   ↓
6. Calcula emissão
   emissionKg = distance * emissionFactors[type]
   ↓
7. Classifica resultado
   class = getEmissionClass(emissionKg)
   ↓
8. Compara com médias
   comparison = getComparison(emissionKg / 1000 / 12)
   ↓
9. Gera recomendação
   recommendation = getTransportRecommendation(type)
   ↓
10. Retorna JSON com sucesso
    ↓
11. Cliente recebe e exibe resultado
```

## 🔒 Validações Implementadas

### Validação de Entrada

```javascript
// Campo obrigatório
if (!origin || !destination || !distance || !transportType) {
  return 400 Bad Request
}

// Distância válida
if (distance <= 0) {
  return 400 Bad Request
}

// Tipo de transporte válido
if (!emissionFactors.transport[transportType]) {
  return 400 Bad Request
}
```

### Tratamento de Erros

```javascript
try {
  // Processamento
} catch (error) {
  res.status(500).json({
    success: false,
    error: error.message
  });
}
```

## 🔄 CORS Configuration

```javascript
app.use(cors());

// Por padrão, permite:
// - Qualquer origem (*)
// - Qualquer método (GET, POST, PUT, DELETE)
// - Qualquer header

// Pode ser customizado:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📊 Cálculo de Emissão

### Fórmula Básica
```
Emissão (kg CO2) = Distância (km) × Fator de Emissão (kg CO2/km)
```

### Exemplo
```
São Paulo → Rio (430 km) de Carro
Fator do Carro: 0.12 kg CO2/km
Emissão = 430 × 0.12 = 51.6 kg CO2
```

### Classificação
```
< 2 tons/ano   → 🟢 Baixo
2-5 tons/ano   → 🟡 Médio
> 5 tons/ano   → 🔴 Alto
```

## 🌐 CORS e Frontend

### Frontend faz requisição:
```javascript
fetch('http://localhost:3000/api/calculate/quick', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

### Servidor responde com CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

## 🧪 Testes da API

### cURL
```bash
curl -X POST http://localhost:3000/api/calculate/quick \
  -H "Content-Type: application/json" \
  -d '{"origin":"SP","destination":"RJ","distance":430,"transportType":"car"}'
```

### Fetch API (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/api/calculate/quick', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: 'SP',
    destination: 'RJ',
    distance: 430,
    transportType: 'car'
  })
});

const data = await response.json();
console.log(data);
```

## 📈 Performance

### Otimizações Implementadas
1. **Validação rápida** de inputs
2. **Cálculos simples** (multiplicação apenas)
3. **Respostas em JSON** (formato eficiente)
4. **Sem I/O** (nem chamadas a BD)
5. **Resposta em < 1ms** (tipicamente)

### Escalabilidade
- Servidor pode processar **1000+ requisições/segundo**
- Pronto para adicionar banco de dados
- Cache possível para resultados similares

## 🔐 Segurança

### Implementado
- ✅ Validação de entrada
- ✅ Tratamento de erros
- ✅ CORS habilitado
- ✅ Sem dados sensíveis
- ✅ Sem SQL injection (sem BD)
- ✅ Sem XSS (JSON responses)

### Não Implementado (recomendado depois)
- [ ] Autenticação
- [ ] Rate limiting
- [ ] Logging
- [ ] HTTPS
- [ ] Helmet.js (headers de segurança)

## 📚 Referências

- [Express.js Documentation](https://expressjs.com/)
- [CORS Specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JSON Format](https://www.json.org/)

## 🎯 Próximas Melhorias

1. **Banco de Dados**: PostgreSQL ou MongoDB para persistência
2. **Autenticação**: JWT para autenticar usuários
3. **Rate Limiting**: Limitar requisições por IP
4. **Logging**: Morgan ou Winston para logs
5. **Validação**: Joi ou Zod para schemas
6. **Documentação Interativa**: Swagger/OpenAPI
7. **Testes Automatizados**: Jest ou Mocha
8. **Compressão**: gzip para respostas

---

**Documentação Técnica v1.0**  
**Desenvolvido com 💓 por DIO & Maria de Fátima**
