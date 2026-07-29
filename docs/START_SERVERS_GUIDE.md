# 🚀 Guía Definitiva: Iniciar Backend y Frontend

## ⚠️ Problema

El error **ETIMEDOUT** significa que el backend **NO está escuchando en puerto 8000**.

Verificación realizada:
```
❌ Puerto 8000 NO está respondiendo
   Posibles causas:
   1. Backend no está corriendo ← ESTO ES LO MÁS PROBABLE
   2. Backend no escucha en 127.0.0.1:8000
   3. Proceso tiene error y se crasheó
```

---

## ✅ SOLUCIÓN: Iniciar Backend Correctamente

### Opción 1: Script Automatizado (Recomendado)

```bash
cd backend
bash start.sh
```

Deberías ver:
```
🚀 Iniciando servidor...

Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

### Opción 2: Manualmente

**Terminal 1:**
```bash
cd backend
python3 run_dev.py
```

**Espera exactamente a ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

Si ves algo diferente o menos, el backend **tiene error**.

---

## 🚀 Iniciar Frontend Correctamente

### Opción 1: Script Automatizado (Recomendado)

En **OTRA terminal** (no cierres la del backend):

```bash
cd frontend
bash start.sh
```

Deberías ver:
```
🚀 Iniciando servidor...

  VITE v5.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Opción 2: Manualmente

```bash
cd frontend
npm run dev
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Backend

- [ ] Terminal abierta en carpeta `backend`
- [ ] Ejecuté `python3 run_dev.py` o `bash start.sh`
- [ ] Veo "Uvicorn running on http://127.0.0.1:8000"
- [ ] Veo "Application startup complete"
- [ ] NO cierro esta terminal

### Frontend

- [ ] Terminal DIFERENTE, abierta en carpeta `frontend`
- [ ] Ejecuté `npm run dev` o `bash start.sh`
- [ ] Veo "Local: http://localhost:5173"
- [ ] NO cierro esta terminal

### Browser

- [ ] Abrí http://localhost:5173/preregistro
- [ ] Formulario carga sin errores
- [ ] Completo el formulario
- [ ] Click "Completar Pre-Registro"

### Resultado

- [ ] Veo "¡Pre-registro completado!" en navegador
- [ ] DevTools (F12) → Network → Status: 201
- [ ] Sin errores rojos en consola

---

## 🧪 TEST RÁPIDO

Si el backend está corriendo, desde **otra terminal**:

```bash
curl http://localhost:8000/health
```

Deberías ver:
```json
{"status":"ok"}
```

Si ves error, el backend **NO está respondiendo**.

---

## 🔴 Si Aún Hay Error

### Error: "Conexión rechazada"

Backend NO está corriendo:
```bash
cd backend
python3 run_dev.py
```

### Error: "Uvicorn error"

Revisa los logs. Ejemplos comunes:

**Error: `ModuleNotFoundError`**
```bash
cd backend
pip install -r requirements.txt
python3 run_dev.py
```

**Error: `Port 8000 already in use`**
```bash
# Encuentra el proceso
lsof -i :8000

# Mata el proceso (reemplaza PID)
kill -9 <PID>

# Reinicia
python3 run_dev.py
```

**Error: `SUPABASE_URL or SUPABASE_KEY not configured`**
Verifica `backend/.env`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJI...
```

### Error: "Frontend no se conecta"

Si backend está corriendo pero frontend dice ETIMEDOUT:
```bash
# Detén frontend (Ctrl+C)
cd frontend
npm run dev
```

---

## 📊 Diagrama Correcto

```
TERMINAL 1                TERMINAL 2              BROWSER
═══════════════════════════════════════════════════════════════

cd backend
python3 run_dev.py        cd frontend
                          npm run dev
                                                 http://localhost:5173
✅ Port 8000              ✅ Port 5173            
   running                   running

   ↓                                                ↓
   │←─── Vite Proxy ─────────────┤
   │  (localhost:5173 → :8000)    │
   │                              │
   ↓                              ↓
  POST /api/registrations/pre-registro
                                       ↓
                               Supabase
                               (insert)
                                       ↓
                               Status 201 ✅
```

---

## 💡 Resumen de Comandos

```bash
# TERMINAL 1: Backend
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/backend
python3 run_dev.py
# Espera: "Application startup complete"

# TERMINAL 2: Frontend
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/frontend
npm run dev
# Espera: "Local: http://localhost:5173/"

# BROWSER: Test
http://localhost:5173/preregistro
# Completa y envía
```

---

## 🎯 Resultado Final

```
✅ Backend escuchando en :8000
✅ Frontend corriendo en :5173
✅ Proxy configurado en Vite
✅ Formulario funciona
✅ Datos se guardan en Supabase
```

---

*Guía: 2026-05-05 23:11 UTC*
