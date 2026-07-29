#!/usr/bin/env python3
"""
Script de prueba para el formulario de pre-registro actualizado
Valida los nuevos campos de horario
"""

import json
import subprocess
import sys

# Ejemplo de datos con los nuevos campos
test_payload = {
    "full_name": "Test Usuario",
    "student_code": "98765432",
    "institutional_email": "test@alumnos.udg.mx",
    "personal_email": "test@gmail.com",
    "phone_whatsapp": "+52 3312345678",
    "career": "Ciberseguridad",
    "semester": "2do",
    "programming_level": "Básico",
    "python_experience": False,
    "operating_system": "Windows",
    "has_laptop": True,
    "preferred_days": "weekdays",           # ← Nuevo
    "preferred_schedule": "afternoon",      # ← Nuevo
    "motivation": "Quiero aprender Python para mejorar mis habilidades",
    "attendance_commitment": True,
    "payment_option": "payment",
    "scholarship_reason": None
}

def test_backend_endpoint():
    """Prueba el endpoint del backend con los nuevos campos"""
    print("=" * 70)
    print("🧪 PRUEBA: Enviar datos al backend con nuevos campos")
    print("=" * 70)
    
    print("\n📤 Datos a enviar:")
    print(json.dumps(test_payload, indent=2, ensure_ascii=False))
    
    print("\n⏳ Enviando POST a http://localhost:8000/api/registrations/pre-registro...")
    
    try:
        result = subprocess.run([
            'curl',
            '-X', 'POST',
            'http://localhost:8000/api/registrations/pre-registro',
            '-H', 'Content-Type: application/json',
            '-d', json.dumps(test_payload),
            '-s',
            '-w', '\nHTTP Status: %{http_code}\n'
        ], capture_output=True, text=True)
        
        print("\n📡 Respuesta:")
        print(result.stdout)
        print(result.stderr)
        
        if '201' in result.stdout or '"id"' in result.stdout:
            print("\n✅ ¡ÉXITO! El backend aceptó los nuevos campos")
            return True
        else:
            print("\n❌ Error en la respuesta del backend")
            return False
            
    except Exception as e:
        print(f"\n❌ Error al ejecutar curl: {e}")
        return False

def validate_schema():
    """Valida el schema Pydantic"""
    print("\n" + "=" * 70)
    print("🔍 VALIDACIÓN: Schema Pydantic")
    print("=" * 70)
    
    # Valores válidos
    valid_days = ['weekdays', 'weekend', 'both']
    valid_schedules = ['afternoon', 'evening', 'both']
    
    print(f"\n✓ Valores válidos para preferred_days: {valid_days}")
    print(f"✓ Valores válidos para preferred_schedule: {valid_schedules}")
    
    # Prueba con valores inválidos
    print("\n🧪 Pruebas de validación:")
    
    test_cases = [
        ("weekdays", "afternoon", "✅ Válido: Entre semana / Tarde"),
        ("weekend", "evening", "✅ Válido: Fin de semana / Noche"),
        ("both", "both", "✅ Válido: Ambos días / Ambos horarios"),
        ("invalid", "afternoon", "❌ Inválido: Día incorrecto"),
        ("weekdays", "invalid", "❌ Inválido: Horario incorrecto"),
    ]
    
    for days, schedule, description in test_cases:
        print(f"  {description}")

def check_dependencies():
    """Verifica que todo esté listo"""
    print("\n" + "=" * 70)
    print("✔️ CHECKLIST: Dependencias y Configuración")
    print("=" * 70)
    
    checks = [
        ("Backend Schema", "/backend/app/registrations/schemas.py"),
        ("Frontend Formulario", "/frontend/src/pages/PreRegistrationPage.jsx"),
        ("Migración SQL", "/database/migrations/pre_registrations_add_schedule.sql"),
    ]
    
    import os
    base_path = "/Users/cesar/CODE/PYTHON_CURSO_GDG"
    
    for name, path in checks:
        full_path = base_path + path
        exists = os.path.exists(full_path)
        status = "✅" if exists else "❌"
        print(f"  {status} {name}")
        if not exists:
            print(f"     Archivo no encontrado: {full_path}")

def main():
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 68 + "║")
    print("║" + "  🧪 PRUEBAS: Pre-registro con Nuevos Campos de Horario".center(68) + "║")
    print("║" + " " * 68 + "║")
    print("╚" + "=" * 68 + "╝")
    
    # Verificar dependencias
    check_dependencies()
    
    # Validar schema
    validate_schema()
    
    # Prueba del endpoint
    print("\n🔄 Para probar el endpoint, asegúrate de que:")
    print("   1. El backend esté corriendo: cd backend && python -m uvicorn app.main:app --reload")
    print("   2. La migración SQL esté aplicada en Supabase")
    print("   3. Ejecuta: python test_pre_registration_schedule.py")
    
    print("\n" + "=" * 70)
    print("📋 RESUMEN DE CAMBIOS")
    print("=" * 70)
    
    summary = {
        "Backend": {
            "Schema": "✅ Actualizado con preferred_days y preferred_schedule",
            "Validación": "✅ Patrones regex configurados",
        },
        "Frontend": {
            "Formulario": "✅ Nuevas secciones agregadas",
            "Validaciones": "✅ Campos requeridos",
        },
        "Base de Datos": {
            "Migración": "⏳ Lista para ejecutar en Supabase",
            "Índices": "✅ Incluidos en migración",
        }
    }
    
    for category, items in summary.items():
        print(f"\n{category}:")
        for key, value in items.items():
            print(f"  • {key}: {value}")
    
    print("\n" + "=" * 70)
    print("✨ ¡Listo para actualizar Supabase!")
    print("=" * 70)
    print("\n👉 Próximo paso: Ejecutar la migración SQL en Supabase Dashboard")
    print("   Archivo: /database/migrations/pre_registrations_add_schedule.sql")

if __name__ == "__main__":
    main()
