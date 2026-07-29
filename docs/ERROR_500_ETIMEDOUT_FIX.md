# 🔧 Fix: Error 500 - ETIMEDOUT

## Problema

```
[vite] http proxy error: /api/registrations/pre-registro
AggregateError [ETIMEDOUT]
```

## ¿Qué significa?

**El frontend está intentando conectarse al backend pero la conexión está expirando.**

Causa probable: El backend no está corriendo o no está respondiendo en `http://localhost:8000`.

---

## ✅ Solución Paso a Paso

### Paso 1: Verifica que Backend Está Corriendo

```bash
# Opción A: Abre una nueva terminal
cd backend
python3 run_dev.py
```

**Deberías ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Si NO ves esto:**
- El backend no se inició correctamente
- Revisa si hay errores en la terminal (abajo)

### Paso 2: Verifica que el Backend Responde

En otra terminal, prueba:

```bash
curl http://localhost:8000/health
```

**Esperado:**
```json
{"status":"ok"}
```

**Si ves error:**
- Backend no está accesible
- Verifica que puerto 8000 está disponible

### Paso 3: Verifica CORS

El backend necesita permitir solicitudes desde `http://localhost:5173`.

En `backend/.env`, verifica:

```
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:8000"]
```

**Si NO está:** Agrega esta línea y reinicia backend

### Paso 4: Reinicia Frontend

Una vez backend esté corriendo:

```bash
# Detén Vite (Ctrl+C)
cd frontend
npm run dev
```

---

## 🧪 Test Rápido

### Terminal 1: Backend

```bash
cd backend
python3 run_dev.py
```

**Espera a ver:**
```
INFO:     Application startup complete
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

**Espera a ver:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

### Terminal 3: Test curl

```bash
curl -X POST http://localhost:8000/api/registrations/pre-registro \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test",
    "student_code": "202012345",
    "institutional_email": "test@alumnos.udg.mx",
    "personal_email": "test@email.com",
    "phone_whatsapp": "+5213312345678",
    "career": "Ciberseguridad",
    "semester": "3ro",
    "programming_level": "Básico",
    "python_experience": true,
    "operating_system": "macOS",
    "has_laptop": true,
    "motivation": "Test",
    "attendance_commitment": true,
    "payment_option": "payment",
    "scholarship_reason": null
  }'
```

**Esperado: Status 201**
```json
{
  "id": "...",
  "full_name": "Test",
  "student_code": "202012345",
  ...
}
```

---

## 🔍 Troubleshooting

### Error: "Port 8000 is already in use"

```bash
# Encuentra qué está usando puerto 8000
lsof -i :8000

# Mata el proceso (reemplaza PID)
kill -9 <PID>

# Reinicia backend
python3 run_dev.py
```

### Error: "Connection refused"

Backend no está corriendo:

```bash
cd backend
python3 run_dev.py
```

### Error: "Module not found"

Faltan dependencias:

```bash
cd backend
pip install -r requirements.txt
python3 run_dev.py
```

### Error: "CORS error"

Backend rechaza solicitudes de frontend. Actualiza `backend/.env`:

```
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:8000"]
```

Reinicia backend.

---

## 📊 Checklist de Diagnosis

- [ ] Backend está corriendo en `http://localhost:8000`
- [ ] `curl http://localhost:8000/health` responde con `{"status":"ok"}`
- [ ] Frontend está en `http://localhost:5173`
- [ ] No hay errores en terminal del backend
- [ ] No hay errores en terminal del frontend
- [ ] `.env` tiene configuración correcta
- [ ] CORS permite `localhost:5173`

---

## 🎯 Flujo Correcto

```
1. Terminal 1:
   cd backend && python3 run_dev.py
   ✅ "Application startup complete"

2. Terminal 2:
   cd frontend && npm run dev
   ✅ "Local: http://localhost:5173/"

3. Browser:
   http://localhost:5173/preregistro
   ✅ Formulario carga correctamente

4. Envía formulario:
   ✅ Status 201 en Network tab
   ✅ Mensaje: "¡Pre-registro completado!"
```

---

## 📝 Resumen

| Error | Causa | Solución |
|-------|-------|----------|
| ETIMEDOUT | Backend no responde | Verifica que backend está corriendo |
| Connection refused | Backend no escucha | Inicia: `python3 run_dev.py` |
| CORS error | Frontend rechazado | Actualiza CORS en `.env` |
| Port in use | Otro proceso usa :8000 | `kill -9` y reinicia |

---

*Documento: 2026-05-05 23:06 UTC*
