#!/bin/bash
# Test script rápido con curl para validar el flujo end-to-end

echo "=========================================="
echo "  PRUEBA DE PRE-REGISTRO (cURL)"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# TEST 1: Verificar si backend está corriendo
echo -e "${YELLOW}[TEST 1]${NC} Verificando backend..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Backend está corriendo"
else
    echo -e "${RED}❌${NC} Backend NO está corriendo en http://localhost:8000"
    echo "   Inicia con: python run_dev.py"
    exit 1
fi

echo ""

# TEST 2: Hacer POST al endpoint de pre-registro
echo -e "${YELLOW}[TEST 2]${NC} Enviando datos de pre-registro..."

RESPONSE=$(curl -s -X POST http://localhost:8000/api/registrations/pre-registro \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Curl User",
    "student_code": "202005555",
    "institutional_email": "testcurl@alumnos.udg.mx",
    "personal_email": "testcurl@email.com",
    "phone_whatsapp": "+5213311111111",
    "career": "Creatividad Digital",
    "semester": "2do",
    "programming_level": "Nulo",
    "python_experience": false,
    "operating_system": "Linux",
    "has_laptop": true,
    "motivation": "Quiero aprender Python desde cero",
    "attendance_commitment": true,
    "payment_option": "payment",
    "scholarship_reason": null
  }' \
  -w "\n%{http_code}")

# Separar response body y HTTP code
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Code: $HTTP_CODE"
echo "Response: $BODY"

echo ""

if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ Registro creado exitosamente${NC}"
    RECORD_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   ID: $RECORD_ID"
else
    echo -e "${RED}❌ Error (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "=========================================="
echo "  Próximos pasos:"
echo "=========================================="
echo "1. Abre: http://localhost:5173/preregistro"
echo "2. Llena el formulario"
echo "3. Submit"
echo "4. Verifica en Supabase Table Editor > pre_registrations"
echo ""
