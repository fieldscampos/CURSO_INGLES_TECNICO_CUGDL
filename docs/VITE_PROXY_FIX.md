# 🔧 Fix: Error 404 en Form Submission

## Problema

Al completar el formulario de pre-registro, recibías:
```
Error 404: Not Found
```

## ¿Qué pasaba?

El frontend (Vite) no sabía dónde enviar la solicitud API:

```
Frontend (puerto 5173)
    ↓
    Fetch /api/registrations/pre-registro
    ↓
    ❌ Vite intenta servir localmente
    ↓
    Error 404: /api/registrations/pre-registro not found in static files
```

**El problema:** Vite no tenía configurado un proxy hacia el backend en `:8000`

## ✅ Lo que se arregló

**Archivo:** `frontend/vite.config.js`

**Antes:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

**Después:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### Qué hace el proxy:

- **Solicitud:** `POST /api/registrations/pre-registro`
- **Vite intercepta:** La ruta comienza con `/api`
- **Redirecciona:** A `http://localhost:8000/api/registrations/pre-registro`
- **Respuesta:** Vuelve al frontend

---

## 🚀 Cómo Probar

### Paso 1: Reinicia Frontend

**⚠️ IMPORTANTE:** Debes detener y reiniciar Vite para que aplique la nueva configuración

```bash
# Detén Vite (Ctrl+C si está corriendo)

# Reinicia
cd frontend
npm run dev
```

### Paso 2: Verifica Backend

```bash
cd backend
python3 run_dev.py
```

Deberías ver:
```
Uvicorn running on http://127.0.0.1:8000
```

### Paso 3: Abre Formulario

```
http://localhost:5173/preregistro
```

### Paso 4: Completa y Envía

1. Llena todos los campos
2. Click "Completar Pre-Registro"
3. Deberías ver: **"¡Pre-registro completado!"** ✅

---

## 🧪 Verificación

### DevTools (F12) → Network

Busca la solicitud `pre-registro`:

| Campo | Valor Esperado |
|-------|----------------|
| **URL** | http://localhost:5173/api/registrations/pre-registro |
| **Method** | POST |
| **Status** | 201 Created ✅ |

### DevTools (F12) → Console

No debe haber errores rojos. Deberías ver:
```
✅ Form submission successful
```

### Supabase Table Editor

- Ve a: `pre_registrations`
- Debe mostrar tu nuevo registro

---

## 📊 Diagrama del Flujo Corregido

```
┌─────────────────────────────────────┐
│      Frontend (Vite)                │
│      http://localhost:5173          │
│                                     │
│  Formulario → onClick               │
│              ↓                      │
│      Fetch /api/registrations/...   │
└──────────────┬──────────────────────┘
               │
               │ 🔄 PROXY (nuevo)
               │ Redirecciona a :8000
               ↓
┌──────────────────────────────────────┐
│    Backend (FastAPI)                 │
│    http://localhost:8000             │
│                                      │
│  POST /api/registrations/pre-registro│
│    ↓                                 │
│  Validate (Pydantic)                 │
│    ↓                                 │
│  Insert Supabase                     │
│    ↓                                 │
│  Return 201 Created ✅               │
└──────────────┬───────────────────────┘
               │
               │ 🔄 Response
               ↓
┌──────────────────────────────────────┐
│    Frontend (Browser)                │
│                                      │
│  Status 201 → Success Message ✅     │
└──────────────────────────────────────┘
```

---

## 💡 Por qué fue necesario

En desarrollo, Vite sirve archivos estáticos desde `:5173`. Sin un proxy configurado, cualquier solicitud a `/api` intenta servir desde el filesystem.

El proxy le dice a Vite: **"Si ves /api, manda eso al backend en :8000"**

---

## 📝 Resumen

| Problema | Causa | Solución |
|----------|-------|----------|
| 404 en form submission | Sin proxy en Vite | Configurar `proxy` en `vite.config.js` |

**Cambio:** Una línea de código en config

**Resultado:** Formulario funciona sin errores ✅

---

*Fix aplicado: 2026-05-05 23:04 UTC*
