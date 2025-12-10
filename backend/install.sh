#!/bin/bash
# Script de Setup Rápido para Calculadora de CO2

echo "🌍 Instalador - Calculadora de Emissões de CO2"
echo "================================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale Node.js 16+ em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"
echo "✅ npm encontrado: $(npm -v)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "✨ Instalação concluída com sucesso!"
echo ""
echo "🚀 Para iniciar o servidor, execute:"
echo ""
echo "   npm start"
echo ""
echo "Ou para desenvolvimento com auto-reload:"
echo ""
echo "   npm run dev"
echo ""
echo "📖 Documentação da API: veja API.md"
echo "🧪 Exemplos de requisições: veja requests.http"
echo ""
echo "✨ Abra a aplicação em: http://localhost:3000"
echo ""
