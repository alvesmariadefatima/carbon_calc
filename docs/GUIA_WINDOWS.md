# 🌍 Calculadora de CO2 - Guia Rápido (Windows PowerShell)

## ✅ Verificar Node.js

```powershell
# Verificar se Node.js está instalado
node -v
npm -v

# Se não estiver, baixe em: https://nodejs.org/
```

## 🚀 Instalação Rápida

### Opção 1: Comando Rápido
```powershell
# Abra PowerShell na pasta backend do projeto
cd "C:\Users\maria\OneDrive\Área de Trabalho\carbon_calc\backend"

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

### Opção 2: Passo a Passo
```powershell
# 1. Navegue até a pasta backend
cd "C:\Users\maria\OneDrive\Área de Trabalho\carbon_calc\backend"

# 2. Verifique se o Node.js está instalado
node --version

# 3. Instale as dependências
npm install

# Se houver erro de permissão, execute como administrador:
# Clique direito em PowerShell → "Executar como administrador"

# 4. Inicie o servidor
npm start

# 5. Abra no navegador
# http://localhost:3000
```

## 🧪 Testar a API

### No PowerShell:

```powershell
# Teste 1: Health Check
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET

# Teste 2: Calcular emissão de viagem
$body = @{
    origin = "São Paulo"
    destination = "Rio de Janeiro"
    distance = 430
    transportType = "car"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/calculate/quick" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

### Ou use cURL (mais simples):

```powershell
# Health check
curl http://localhost:3000/api/health

# Calcular viagem
curl -X POST http://localhost:3000/api/calculate/quick `
  -H "Content-Type: application/json" `
  -d '{
    "origin": "São Paulo",
    "destination": "Rio de Janeiro",
    "distance": 430,
    "transportType": "car"
  }'
```

## 🛑 Parar o Servidor

```powershell
# Pressione Ctrl + C no PowerShell
```

## 📊 Acessar a Aplicação

1. Abra o navegador
2. Vá para: `http://localhost:3000`
3. Use o formulário para calcular emissões

## 🐛 Solução de Problemas

### "npm: comando não encontrado"
- Node.js não está instalado
- Baixe em: https://nodejs.org/
- Reinicie o PowerShell após instalar

### "Porta 3000 já está em uso"
```powershell
# Encontre o processo usando a porta 3000
netstat -ano | findstr :3000

# Ou mude a porta no .env
# PORT=3001
```

### "Erro de permissão ao instalar"
```powershell
# Execute PowerShell como administrador
# Clique direito em PowerShell → "Executar como administrador"
npm install
```

### "Erro de CORS"
- A API está em `http://localhost:3000`
- O frontend também está em `http://localhost:3000`
- CORS está habilitado no servidor

## 📖 Documentação

- `README.md` - Informações gerais do projeto
- `API.md` - Documentação completa dos endpoints
- `requests.http` - Exemplos de requisições
- `INTEGRACAO_API.md` - Detalhes da integração

## 🔄 Modo Desenvolvimento com Auto-Reload

```powershell
npm run dev

# Servidor reinicia automaticamente quando você salva arquivos
# Pressione Ctrl + C para parar
```

## 📁 Estrutura de Pastas

```
C:\Users\maria\OneDrive\Área de Trabalho\carbon_calc\
├── index.html          ← Página principal
├── styles.css          ← Estilos
├── script.js           ← Lógica do frontend
├── server.js           ← Servidor Express (backend)
├── package.json        ← Dependências
├── .env                ← Configurações
└── node_modules\       ← Dependências instaladas
```

## ✨ Dicas Importantes

1. **Certifique-se de estar na pasta correta**:
   ```powershell
   cd "C:\Users\maria\OneDrive\Área de Trabalho\carbon_calc"
   ```

2. **Use aspas para caminhos com espaços**:
   ```powershell
   cd "Caminho com espaços"
   ```

3. **npm install precisa fazer apenas uma vez**

4. **npm start é executado sempre que quer usar a aplicação**

5. **Mantenha o PowerShell aberto enquanto usa a aplicação**

## 🎯 Próximos Passos

1. Instale as dependências (`npm install`)
2. Inicie o servidor (`npm start`)
3. Abra `http://localhost:3000` no navegador
4. Use a calculadora!
5. Consulte `API.md` para saber mais sobre os endpoints

## 📞 Dúvidas?

Verifique a documentação em:
- `README.md`
- `API.md`
- `INTEGRACAO_API.md`

---

**Desenvolvido com 💓 por DIO & Maria de Fátima**
