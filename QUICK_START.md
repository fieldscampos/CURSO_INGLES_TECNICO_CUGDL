# Quick Start - Pre-Registro Supabase

## 🚀 Activación en 3 Pasos

### 1️⃣ Crear Tabla en Supabase (2 min)

```
1. Abre: https://supabase.com/dashboard
2. SQL Editor
3. Copia: /database/migrations/pre_registrations_table.sql
4. Pega en editor
5. Click RUN (▶)
6. ✅ Verifica "pre_registrations" en Tables
```

### 2️⃣ Iniciar Servidores (1 min)

**Terminal 1 - Backend:**
```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/backend
python run_dev.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/frontend
npm run dev
```

### 3️⃣ Prueba (2 min)

1. Abre: http://localhost:5173/preregistro
2. Llena formulario:
   - Nombre: Juan Pérez
   - Código: 12345
   - Email: juan@alumnos.udg.mx
   - Carrera: Ciberseguridad
   - Semestre: 1ro
   - Experiencia: Básico
   - Python: No
   - SO: Windows
   - Laptop: Sí
   - Motivación: Quiero aprender
   - Compromiso: ✓
   - Pago: Puedo pagar $100

3. Submit
4. Espera: "¡Pre-registro completado!"
5. Verifica en Supabase: Table Editor > pre_registrations

---

## ✅ Verificación

```bash
# Verificar frontend build
cd frontend && npm run build

# Verificar backend connection
curl http://localhost:8000/health

# Verificar logs
tail -f backend.log
```

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "Email debe terminar en @alumnos.udg.mx" | Usa: nombre@alumnos.udg.mx |
| "Código debe ser números" | Usa: 12345 (no letras) |
| "Error al guardar" | Verifica Supabase config en .env |
| Tabla no aparece | Ejecuta SQL en Supabase SQL Editor |

---

## 📚 Documentación Completa

Ver: `/docs/SUPABASE_INTEGRATION_GUIDE.md`

---

✨ **¡Listo para producción!** 🎉
