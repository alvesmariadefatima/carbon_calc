# 🌍 Calculadora de Emissões de CO2

Uma aplicação web moderna e responsiva para calcular e monitorar emissões de carbono pessoais.

## 🆕 API Backend (Node.js + Express)

A aplicação agora conta com uma **API RESTful completa** no backend para cálculos dinâmicos!

### 🚀 Iniciar o Servidor

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ou para desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### 📡 Endpoints Principais

- **POST** `/api/calculate/quick` - Calcular emissão de viagem rápida
- **POST** `/api/calculate/detailed` - Calcular emissões detalhadas
- **GET** `/api/emission-factors` - Obter fatores de emissão
- **GET** `/api/averages` - Obter médias de emissão
- **POST** `/api/save-result` - Salvar resultado
- **GET** `/api/health` - Verificar status da API

📖 Veja `docs/API.md` para documentação completa dos endpoints!

## ✨ Recursos

### 🏠 Página Inicial
- **Calculadora Rápida**: Calcule emissões de viagens específicas
- **Campos simples**: Origem, Destino e Distância
- **Seleção de Transporte com emojis**: 
  - 🚌 Ônibus (~40g CO2/km)
  - 🚗 Carro (~120g CO2/km)
  - 🏍️ Moto (~80g CO2/km)
  - 🚴 Bicicleta (0g CO2)
- **Resultado instantâneo** com classificação visual

### 📊 Calculadora Completa
- **Análise detalhada** por categorias:
  - 🚗✈️ Transporte (carro, voos, transporte público)
  - ⚡ Energia Residencial (eletricidade, gás natural)
  - 🍖♻️ Consumo (carne vermelha, resíduos)
- **Comparação com médias** (Brasil: 4,6 ton/ano | Global: 4 ton/ano)
- **Recomendações personalizadas** baseadas nos dados
- **Classificação por cores**:
  - 🟢 Verde: Baixas emissões
  - 🟡 Amarelo: Emissões médias
  - 🔴 Vermelho: Altas emissões

## 🎨 Design e UX

### Paleta de Cores Significativa
- **Verde (#27ae60)**: Sustentabilidade e baixas emissões
- **Amarelo (#f1c40f)**: Alerta para emissões médias
- **Vermelho (#e74c3c)**: Crítico para altas emissões

### Responsividade
- ✅ Totalmente responsivo
- ✅ Menu sanduíche (🍔) em mobile
- ✅ Otimizado para desktop, tablet e smartphone
- ✅ Modo escuro automático (prefers-color-scheme)

### Acessibilidade
- ✅ Semântica HTML5 completa
- ✅ ARIA labels apropriados
- ✅ Navegação por teclado
- ✅ Contraste de cores adequado

## 🚀 Como Usar

### Opção 1: Calculadora Rápida (Recomendado para começar)
1. Abra a página inicial
2. Preencha Origem e Destino da viagem
3. Insira a distância em km
4. Clique em um tipo de transporte
5. Clique em "Calcular Emissão"
6. Veja o resultado instantaneamente

### Opção 2: Calculadora Completa
1. Navegue até "Calculadora" no menu
2. Preencha os campos desejados em cada categoria
3. Clique em "Calcular Emissões"
4. Veja análise completa e recomendações

## 📁 Estrutura de Arquivos

```
carbon_calc/
├── 📁 frontend/
│   ├── index.html       # Estrutura HTML semântica
│   ├── styles.css       # Estilos CSS com variáveis e responsividade
│   └── script.js        # Lógica JavaScript da aplicação
│
├── 📁 backend/
│   ├── server.js        # Express API com 6 endpoints
│   ├── package.json     # Dependências Node.js
│   └── .env             # Variáveis de ambiente
│
├── 📁 docs/
│   ├── API.md           # Documentação dos endpoints
│   ├── TECNICO.md       # Detalhes técnicos da arquitetura
│   ├── INTEGRACAO_API.md # Resumo de integração
│   ├── GUIA_WINDOWS.md  # Guia para Windows PowerShell
│   └── CHECKLIST.md     # Checklist de conclusão
│
├── 📁 examples/
│   └── requests.http    # Exemplos de requisições HTTP
│
├── README.md            # Este arquivo
├── ESTRUTURA.md         # Documentação da estrutura
└── .gitignore           # Arquivos a ignorar no Git
└── README.md        # Este arquivo
```

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica completa
- **CSS3**: Gradientes, animações, variáveis CSS, media queries
- **JavaScript (Vanilla)**: Sem dependências
- **Responsivo**: Mobile-first design

## 📱 Compatibilidade

- ✅ Chrome/Chromium (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)
- ✅ Navegadores mobile modernos

## 🎯 Fatores de Emissão Utilizados

### Transporte (rápido)
- Ônibus: 40g CO2/km
- Carro: 120g CO2/km
- Moto: 80g CO2/km
- Bicicleta: 0g CO2/km

### Transporte (detalhado)
- Carro: 120g CO2/km
- Voo: 255g CO2/hora
- Transporte público: 40g CO2/km

### Energia
- Eletricidade (Brasil): 500g CO2/kWh
- Gás natural: 2kg CO2/m³

### Consumo
- Carne vermelha: 27kg CO2/kg
- Resíduos: 500g CO2/kg

**Fonte**: EPA, IPCC e agências ambientais internacionais

## 👥 Desenvolvido com 💓

Desenvolvido com ❤️ e carinho por **DIO & Maria de Fátima**

## 📝 Notas Importantes

- Os valores são aproximações baseadas em dados científicos
- Variam conforme região e práticas locais
- Use para obter uma estimativa geral, não como valor exato
- Consulte agências ambientais para dados mais precisos

## 🌱 Dicas para Reduzir Emissões

1. **Transporte**: Use transporte público, bicicleta ou carona compartilhada
2. **Energia**: Instale painéis solares ou use energia renovável
3. **Consumo**: Reduza carne vermelha, prefira proteínas alternativas
4. **Resíduos**: Recicle e reduza consumo desnecessário
5. **Árvores**: Plante árvores para compensar emissões

---

**Última atualização**: 10 de dezembro de 2025
