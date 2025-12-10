# 🚀 Guia de Deploy - Carbon Calculator

## 📦 Estrutura do Projeto

```
carbon_calc/
├── frontend/          # Aplicação visual (GitHub Pages)
├── backend/           # API REST (Heroku, Vercel, Railway, etc.)
└── .github/
    └── workflows/
        └── deploy.yml # Workflow de deploy automático
```

## 🌐 GitHub Pages (Frontend)

O frontend é automaticamente deployado via GitHub Actions.

### Configuração Automática

1. **Ative GitHub Pages** no seu repositório:
   - Acesse: `Settings → Pages`
   - Em "Build and deployment", selecione:
     - Source: `GitHub Actions`

2. **O workflow já está configurado** em `.github/workflows/deploy.yml`
   - Automaticamente faz deploy a cada push em `main`
   - Pega os arquivos da pasta `frontend/`

### Acessar o Frontend

```
https://alvesmariadefatima.github.io/carbon_calc/
```

---

## 🔌 Backend - Opções de Deploy

Como GitHub Pages só hospeda conteúdo estático, você precisa hospedar a API em outro serviço.

### Opção 1: Heroku (Recomendado para Iniciantes)

```bash
# 1. Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Criar aplicação
heroku create seu-app-name

# 4. Deploy
git push heroku main

# 5. URL do seu backend
# https://seu-app-name.herokuapp.com
```

### Opção 2: Vercel (Recomendado - Free Tier)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy a pasta backend
cd backend
vercel --prod

# 4. URL do seu backend
# https://seu-projeto.vercel.app
```

### Opção 3: Railway (Grátis + Fácil)

```bash
# 1. Ir para https://railway.app
# 2. Connect GitHub
# 3. Selecionar repo e branch
# 4. Railway detecta Node.js automaticamente
# 5. Seu backend estará em https://seu-projeto.up.railway.app
```

### Opção 4: Replit (Muito Fácil)

1. Acesse https://replit.com
2. Clique "Import from GitHub"
3. Selecione seu repositório
4. Replit roda automaticamente na nuvem
5. URL: `https://seu-usuario.replit.dev`

---

## 🔧 Configurar URL da API em Produção

Após hospedar o backend, atualize a URL:

### Método 1: Editar `frontend/script.js`

```javascript
const API_BASE_URL = (() => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3001/api';
  }
  // URL em produção
  return 'https://seu-backend-heroku.herokuapp.com/api';
})();
```

### Método 2: Usar arquivo `.env.production`

```bash
# frontend/.env.production
REACT_APP_API_URL=https://seu-backend.herokuapp.com/api
```

Depois no GitHub:
1. Vá em `Settings → Secrets and variables → Actions`
2. Crie variável: `API_URL` = `https://seu-backend.com/api`
3. Use no workflow com `${{ secrets.API_URL }}`

---

## 📋 Checklist de Deploy

- [ ] Frontend em GitHub Pages
  - [ ] URL: `https://alvesmariadefatima.github.io/carbon_calc/`
  - [ ] Workflow em `.github/workflows/deploy.yml`

- [ ] Backend hospedado (escolha uma opção):
  - [ ] Heroku
  - [ ] Vercel
  - [ ] Railway
  - [ ] Replit
  - [ ] Outro

- [ ] URL da API configurada no `script.js`

- [ ] Testar endpoints:
  ```bash
  curl https://seu-backend.com/api/health
  ```

- [ ] CORS configurado corretamente no backend:
  ```javascript
  app.use(cors({
    origin: 'https://alvesmariadefatima.github.io'
  }));
  ```

---

## 🧪 Testar em Produção

```bash
# Depois que ambos estão no ar
# Acesse https://alvesmariadefatima.github.io/carbon_calc/
# Abra DevTools (F12)
# Console deveria mostrar requisições para sua API
```

---

## 🐛 Troubleshooting

### API retorna erro CORS
```javascript
// Adicione no backend (server.js)
app.use(cors({
  origin: ['http://localhost:3000', 'https://alvesmariadefatima.github.io'],
  credentials: true
}));
```

### GitHub Pages mostra 404
- Verifique se a pasta `frontend/` está correta
- Cheque o workflow em `.github/workflows/deploy.yml`
- Vá em `Settings → Pages` e veja o status do deploy

### Mudança não aparece em produção
- GitHub Pages pode levar alguns minutos
- Force refresh: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)

---

## 📚 Documentação Adicional

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Heroku Node.js Docs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎉 Resumo

```
1. Frontend automático via GitHub Pages ✅
2. Deploy backend em: Heroku / Vercel / Railway / Replit
3. Atualizar URL da API no script.js
4. Testar em produção
5. Pronto! 🚀
```

Desenvolvido com 💓 por DIO & Maria de Fátima
