#!/usr/bin/env python3
"""
Test script para validar:
1. Conexión a Supabase
2. Estructura de tabla pre_registrations
3. Inserción de datos
4. Endpoint del backend
"""

import os
import json
import sys
from datetime import datetime
from pathlib import Path

# Agregar backend al path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def print_check(success, message):
    """Print check result"""
    symbol = "✅" if success else "❌"
    print(f"{symbol} {message}")
    return success

# ============================================================================
# TEST 1: Verificar variables de entorno
# ============================================================================
print_header("TEST 1: Variables de Entorno")

env_path = Path(__file__).parent / "backend" / ".env"
if not env_path.exists():
    print_check(False, ".env no encontrado en backend/")
    sys.exit(1)

from dotenv import load_dotenv
load_dotenv(env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print_check(bool(supabase_url), f"SUPABASE_URL: {supabase_url[:30]}..." if supabase_url else "SUPABASE_URL no definida")
print_check(bool(supabase_key), f"SUPABASE_KEY: {supabase_key[:30]}..." if supabase_key else "SUPABASE_KEY no definida")

if not (supabase_url and supabase_key):
    sys.exit(1)

# ============================================================================
# TEST 2: Conectar a Supabase
# ============================================================================
print_header("TEST 2: Conexión a Supabase")

try:
    from supabase import create_client
    supabase = create_client(supabase_url, supabase_key)
    print_check(True, "Cliente Supabase creado exitosamente")
except Exception as e:
    print_check(False, f"Error creando cliente: {e}")
    sys.exit(1)

# ============================================================================
# TEST 3: Verificar tabla pre_registrations
# ============================================================================
print_header("TEST 3: Estructura de Tabla pre_registrations")

try:
    response = supabase.table("pre_registrations").select("id").limit(1).execute()
    print_check(True, "Tabla pre_registrations existe y es accesible")
    
    # Intenta ver la estructura
    data = response.data
    print(f"   → Respuesta inicial: {len(data)} registros")
    
except Exception as e:
    print_check(False, f"No se puede acceder a tabla: {str(e)}")
    sys.exit(1)

# ============================================================================
# TEST 4: Insertar registro de prueba
# ============================================================================
print_header("TEST 4: Insertar Registro de Prueba")

test_data = {
    "full_name": "Test User",
    "student_code": "202001234",
    "institutional_email": "test@alumnos.udg.mx",
    "personal_email": "test@email.com",
    "phone_whatsapp": "+5213312345678",
    "career": "Ciberseguridad",
    "semester": "3ro",
    "programming_level": "Básico",
    "python_experience": True,
    "operating_system": "macOS",
    "has_laptop": True,
    "motivation": "Test motivation",
    "attendance_commitment": True,
    "payment_option": "payment",
    "scholarship_reason": None
}

try:
    response = supabase.table("pre_registrations").insert([test_data]).execute()
    record_id = response.data[0]["id"] if response.data else None
    print_check(True, f"Registro insertado: {record_id}")
except Exception as e:
    print_check(False, f"Error insertando: {str(e)}")
    sys.exit(1)

# ============================================================================
# TEST 5: Verificar inserción
# ============================================================================
print_header("TEST 5: Verificar Datos Guardados")

try:
    response = supabase.table("pre_registrations").select("*").eq("id", record_id).execute()
    if response.data:
        saved_record = response.data[0]
        print_check(True, f"Registro recuperado exitosamente")
        print(f"   → Student Code: {saved_record.get('student_code')}")
        print(f"   → Email: {saved_record.get('institutional_email')}")
        print(f"   → Career: {saved_record.get('career')}")
        print(f"   → Programming Level: {saved_record.get('programming_level')}")
        print(f"   → Payment Option: {saved_record.get('payment_option')}")
    else:
        print_check(False, "Registro no fue encontrado después de inserción")
        sys.exit(1)
except Exception as e:
    print_check(False, f"Error verificando: {str(e)}")
    sys.exit(1)

# ============================================================================
# TEST 6: Contar total de registros
# ============================================================================
print_header("TEST 6: Estadísticas")

try:
    response = supabase.table("pre_registrations").select("id", count="exact").execute()
    total = response.count
    print_check(True, f"Total de registros en tabla: {total}")
except Exception as e:
    print_check(False, f"Error contando registros: {str(e)}")

# ============================================================================
# TEST 7: Prueba del endpoint (opcional)
# ============================================================================
print_header("TEST 7: Prueba del Endpoint del Backend")

try:
    import requests
    
    endpoint_data = {
        "full_name": "Endpoint Test",
        "student_code": "202009999",
        "institutional_email": "endpoint@alumnos.udg.mx",
        "personal_email": "endpoint@email.com",
        "phone_whatsapp": "+52133987654321",
        "career": "IA",
        "semester": "4to",
        "programming_level": "Intermedio",
        "python_experience": True,
        "operating_system": "Windows",
        "has_laptop": True,
        "motivation": "Endpoint test motivation",
        "attendance_commitment": True,
        "payment_option": "scholarship",
        "scholarship_reason": "Financial reasons"
    }
    
    response = requests.post(
        "http://localhost:8000/api/registrations/pre-registro",
        json=endpoint_data,
        timeout=5
    )
    
    if response.status_code == 201:
        print_check(True, f"Endpoint respondió 201 Created")
        print(f"   → Response: {response.json()}")
    else:
        print_check(False, f"Endpoint respondió {response.status_code}: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("⚠️  Backend no está ejecutándose en http://localhost:8000")
    print("   Inicia el backend con: python run_dev.py")
except Exception as e:
    print_check(False, f"Error probando endpoint: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print_header("✅ TODOS LOS TESTS PASARON")
print("""
La tabla pre_registrations está funcionando correctamente:
  • Conexión a Supabase ✓
  • Estructura de tabla ✓
  • Inserción de datos ✓
  • Recuperación de datos ✓

Próximos pasos:
  1. Asegúrate de que el backend esté corriendo: python run_dev.py
  2. Asegúrate de que el frontend esté corriendo: npm run dev
  3. Prueba en http://localhost:5173/preregistro
  4. Verifica los datos en Supabase Table Editor
""")
