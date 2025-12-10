# 📊 INTEGRAÇÃO DA API - RESUMO DAS MUDANÇAS

## ✅ O QUE FOI IMPLEMENTADO

### 🔧 Backend com Node.js + Express

#### Arquivos Criados:
1. **backend/server.js** - Servidor Express com API RESTful completa
2. **backend/package.json** - Dependências do projeto
3. **backend/.env** - Variáveis de ambiente
4. **docs/API.md** - Documentação completa da API
5. **examples/requests.http** - Exemplos de requisições HTTP
6. **.gitignore** - Arquivo de exclusão para Git

#### Arquivos Atualizados:
1. **frontend/script.js** - Integrado com chamadas à API
2. **frontend/styles.css** - Adicionado spinner de carregamento
3. **README.md** - Informações sobre a API

---

## 🚀 ENDPOINTS DISPONÍVEIS

### 1. **POST /api/calculate/quick**
- **Descrição**: Calcula emissão de uma viagem rápida
- **Entrada**: origin, destination, distance, transportType
- **Saída**: Emissão em kg e tons, classificação, recomendação
- **Exemplo**:
  ```json
  {
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "car"
  }
  ```

### 2. **POST /api/calculate/detailed**
- **Descrição**: Calcula emissões detalhadas por categoria
- **Entrada**: transport, energy, consumption
- **Saída**: Emissões por categoria, total, recomendações
- **Exemplo**:
  ```json
  {
    "transport": { "carKm": 500 },
    "energy": { "electricity": 150 },
    "consumption": { "meatConsumption": 10 }
  }
  ```

### 3. **GET /api/emission-factors**
- **Descrição**: Retorna todos os fatores de emissão
- **Entrada**: Nenhuma
- **Saída**: Transporte, energia, consumo com seus fatores

### 4. **GET /api/averages**
- **Descrição**: Retorna médias de emissão (Brasil e Global)
- **Entrada**: Nenhuma
- **Saída**: Dados anuais e mensais

### 5. **POST /api/save-result**
- **Descrição**: Salva resultado no histórico
- **Entrada**: resultType, data, timestamp
- **Saída**: Confirmação de salvamento com ID único

### 6. **GET /api/health**
- **Descrição**: Verifica status da API
- **Entrada**: Nenhuma
- **Saída**: Status de funcionamento

---

## 🎯 FUNCIONALIDADES DA API

### ✨ Cálculos Dinâmicos
- ✅ Emissões calculadas no backend
- ✅ Validação completa de inputs
- ✅ Tratamento robusto de erros
- ✅ Fallback para cálculo local (se API indisponível)

### 🎨 Recursos do Frontend
- ✅ Indicador de carregamento (spinner animado)
- ✅ Requisições assíncronas com fetch API
- ✅ Tratamento de erros e fallback
- ✅ Resultados dinâmicos da API

### 📊 Classificações e Comparações
- ✅ Classificação automática (baixo/médio/alto)
- ✅ Comparação com média brasileira e global
- ✅ Recomendações personalizadas baseadas em dados
- ✅ Porcentagem de emissão por categoria

### 💾 Persistência
- ✅ Salvamento de resultados
- ✅ IDs únicos para cada resultado
- ✅ Timestamps de registro

---

## 🛠️ COMO USAR

### Passo 1: Instalar Dependências
```bash
cd carbon_calc
npm install
```

### Passo 2: Iniciar Servidor
```bash
npm start
```

### Passo 3: Acessar a Aplicação
- Abra: `http://localhost:3000`
- A API está disponível em: `http://localhost:3000/api`

### Passo 4: Testar Endpoints
Use o arquivo `requests.http` com:
- REST Client (VS Code)
- Postman
- cURL

---

## 📡 FLUXO DE INTEGRAÇÃO

```
┌──────────────────┐
│    Frontend      │
│ (frontend/)      │
│ (index.html)     │
└────────┬─────────┘
         │ POST /api/calculate/quick
         │ { origin, destination, distance, transportType }
         ↓
┌──────────────────────────┐
│  Backend (Express)       │
│  (backend/server.js)     │
│ ✓ Valida inputs         │
│ ✓ Calcula emissão       │
│ ✓ Gera recomendações    │
│ ✓ Compara com médias    │
└────────┬─────────────────┘
         │ JSON Response
         │ { success, data: { emissionKg, class, recommendation } }
         ↓
┌────────────────────────┐
│ Frontend (script.js)   │
│ ✓ Exibe resultado      │
│ ✓ Spinner animado      │
│ ✓ Classificação cor    │
│ ✓ Recomendações       │
└────────────────────────┘
```

---

## 🔍 VALIDAÇÕES IMPLEMENTADAS

### Na API:
- ✅ Campos obrigatórios (origin, destination, distance, transportType)
- ✅ Distância > 0
- ✅ Tipo de transporte válido
- ✅ Valores numéricos válidos para energia e consumo

### Mensagens de Erro:
- `400 Bad Request` - Input inválido
- `404 Not Found` - Rota não existe
- `500 Internal Server Error` - Erro no servidor

---

## 📊 FATORES DE EMISSÃO

### Transporte (kg CO2/km)
- 🚌 Ônibus: 40g
- 🚗 Carro: 120g
- 🏍️ Moto: 80g
- 🚴 Bicicleta: 0g

### Energia
- ⚡ Eletricidade: 500g/kWh (Brasil)
- 🔥 Gás Natural: 2kg/m³

### Consumo
- 🍖 Carne Vermelha: 27kg/kg
- 🗑️ Resíduos: 500g/kg

---

## 🎯 PRÓXIMOS PASSOS

Melhorias futuras possíveis:
- [ ] Banco de dados para persistência real
- [ ] Autenticação de usuários
- [ ] Histórico de resultados do usuário
- [ ] Gráficos e análises avançadas
- [ ] API de geolocalização para cálculo automático de distância
- [ ] Exportação de relatórios em PDF
- [ ] Comparação com outros usuários
- [ ] Desafios e gamificação
- [ ] Cache de resultados
- [ ] Rate limiting

---

## 📁 ESTRUTURA DO PROJETO

```
carbon_calc/
├── 📁 frontend/
│   ├── index.html         # Frontend
│   ├── styles.css         # Estilos
│   └── script.js          # Lógica Frontend + Integração API
│
├── 📁 backend/
│   ├── server.js          # Backend Express
│   ├── package.json       # Dependências
│   └── .env               # Variáveis de ambiente
│
├── 📁 docs/
│   ├── API.md             # Documentação da API
│   ├── TECNICO.md         # Detalhes técnicos
│   ├── INTEGRACAO_API.md  # Este arquivo
│   ├── GUIA_WINDOWS.md    # Guia Windows
│   └── CHECKLIST.md       # Checklist
│
├── 📁 examples/
│   └── requests.http      # Exemplos de requisições
│
├── README.md              # Documentação
├── ESTRUTURA.md           # Estrutura do projeto
├── .gitignore             # Git exclusões
└── node_modules/           # 🆕 Dependências instaladas
```

---

## 🎨 MELHORIAS VISUAIS

### Loading State
- Spinner animado durante requisição
- Mensagem "Calculando emissões..."
- Transição suave para resultado

### Resultado Melhorado
- Todos os dados da API exibidos
- Recomendação personalizada
- Classificação visual por cor
- Sem recalcular localmente (usa dados do backend)

---

## 💡 BENEFÍCIOS DA API

1. **Cálculos Centralizados**: Lógica no servidor, consistência garantida
2. **Dados Dinâmicos**: Fácil atualizar fatores sem código frontend
3. **Escalabilidade**: Pronto para adicionar banco de dados
4. **Segurança**: Validações no servidor
5. **Manutenibilidade**: Código organizado e documentado
6. **Reutilizabilidade**: Mesma API para múltiplos clientes (web, mobile, etc.)

---

**Desenvolvido com 💓 por DIO & Maria de Fátima**
