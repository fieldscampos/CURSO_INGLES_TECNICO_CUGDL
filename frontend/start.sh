#!/bin/bash
# Script para iniciar el frontend de forma correcta

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           Iniciando Frontend - Python Curso GDG            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Navegar a directorio frontend
cd frontend

echo "📍 Ubicación: $(pwd)"
echo ""

# Verificar Node
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no encontrado"
    exit 1
fi

echo "✅ Node.js disponible: $(node --version)"
echo ""

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no encontrado"
    exit 1
fi

echo "✅ npm disponible: $(npm --version)"
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "🚀 Iniciando servidor..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Frontend disponible en: http://localhost:5173"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
