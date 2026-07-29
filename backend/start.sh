#!/bin/bash
# Script para iniciar el backend de forma correcta

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           Iniciando Backend - Python Curso GDG             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Navegar a directorio backend
cd backend

echo "📍 Ubicación: $(pwd)"
echo ""

# Verificar que .env existe
if [ ! -f ".env" ]; then
    echo "❌ Error: Archivo .env no encontrado"
    echo "   Crea backend/.env con tus credenciales de Supabase"
    exit 1
fi

echo "✅ Archivo .env encontrado"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 no encontrado"
    exit 1
fi

echo "✅ Python3 disponible: $(python3 --version)"
echo ""

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
python3 -m pip install -q -r requirements.txt

echo "✅ Dependencias instaladas"
echo ""

# Iniciar servidor
echo "🚀 Iniciando servidor..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 run_dev.py

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
