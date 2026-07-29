# 🔧 Solución: Error de Build en Render

## ❌ Problema

```
Preparing metadata (pyproject.toml): finished with status 'error'
error: subprocess-exited-with-error
maturin failed - Read-only file system
```

**Causa:** Render Free Tier tiene limitaciones en el sistema de archivos. `pydantic-core` intenta compilar código Rust y falla.

---

## ✅ SOLUCIÓN 1: Arreglar en Render (Rápido - 5 min)

### Paso 1: Actualizar requirements.txt
✓ Ya hecho. Removí `google-auth` que no se usa.

### Paso 2: Vuelve a Render
1. Ve a tu servicio en Render
2. Click: **Clear Build Cache** (en el menu)
3. Click: **Redeploy**
4. Espera ~3 minutos

Si sigue fallando → usa **SOLUCIÓN 2**

---

## ✅ SOLUCIÓN 2: Cambiar a Railway (Recomendado - 10 min)

Railway es más confiable para Free Tier porque usa Docker nativamente.

### Paso 1: Crear cuenta Railway
1. Ve a: https://railway.app
2. Sign up con GitHub
3. Conecta tu cuenta

### Paso 2: Crear nuevo proyecto
1. Click: **New Project**
2. **Deploy from GitHub repo**
3. Selecciona: tu repo Python GDG
4. Click: **Connect**

### Paso 3: Configurar variables
1. Click en el servicio
2. **Variables** → Agrega:

```
SUPABASE_URL = tu_url
SUPABASE_KEY = tu_key
BACKEND_CORS_ORIGINS = https://curso-python-gdg.vercel.app
PORT = 8000
```

### Paso 4: Esperar deploy
- Railway mostrará progreso
- Espera a ver: "✓ Deployed"
- Tu URL será: `https://xxxxx.railway.app`

### Paso 5: Actualizar Vercel
En Vercel, actualiza:
```
VITE_API_URL = https://xxxxx.railway.app
```

---

## 📊 Comparación: Render vs Railway

| Aspecto | Render | Railway |
|---------|--------|---------|
| Free Tier | ⚠️ Limitado | ✅ Generoso |
| Python | ⚠️ Problemas | ✅ Perfecto |
| Docker | ❌ No nativo | ✅ Nativo |
| Compile | ❌ Problemas Rust | ✅ Funciona |
| Deploy | 10 min | 5 min |
| **Recomendación** | ❌ No hoy | ✅ **Usa este** |

---

## 🚀 Archivos Preparados

✓ **requirements.txt** - Actualizado (removí google-auth)
✓ **Dockerfile** - Para Railway/Docker
✓ **railway.json** - Configuración Railway

---

## 🎯 Próximos Pasos

**Opción A: Intentar arreglar Render**
1. Clear build cache en Render
2. Redeploy
3. Si funciona → Listo

**Opción B: Cambiar a Railway** (Recomendado)
1. railway.app → Sign up
2. New Project → Tu repo
3. Agrega env vars
4. Espera deploy
5. Copy URL a Vercel

---

**Recomendación:** Railway es más confiable para Python en Free Tier.

¿Cuál prefieres?
