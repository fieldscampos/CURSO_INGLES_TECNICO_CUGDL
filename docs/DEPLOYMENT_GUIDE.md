# 🚀 Guía de Deployment: Curso Python GDG

## 📊 Arquitectura de Producción

```
┌────────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                              │
│                     (Navegador)                               │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ↓
                   ┌──────────────────────┐
                   │   Frontend (React)   │
                   │   https://vercel.app │
                   │  - Landing page      │
                   │  - Pre-reg form      │
                   │  - CDN global        │
                   └──────────┬───────────┘
                              │ fetch()
                              ↓
                   ┌──────────────────────┐
                   │  Backend (FastAPI)   │
                   │  https://render.com  │
                   │  - API endpoints     │
                   │  - Validaciones      │
                   │  - Health checks     │
                   └──────────┬───────────┘
                              │
                              ↓
                   ┌──────────────────────┐
                   │     Supabase         │
                   │  - PostgreSQL DB     │
                   │  - Auth (optional)   │
                   │  - RLS policies      │
                   └──────────────────────┘
```

---

## ✅ PASO 1: Preparar Código para Producción

### 1.1 Verificar que todo funciona localmente

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Probar
curl http://localhost:8000/health
# Debe responder: {"status": "ok"}
```

### 1.2 Crear archivo `.env.production` para frontend

Archivo: `frontend/.env.production`
```
VITE_API_URL=https://curso-python-gdg-api.onrender.com
VITE_ENV=production
```

### 1.3 Versionar código

```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

## 📝 PASO 2: Configurar Backend en Render

### 2.1 Crear cuenta en Render
- Ve a: https://render.com
- Sign up → GitHub (más fácil)
- Autoriza acceso a tus repos

### 2.2 Crear Web Service

1. Click: **New** → **Web Service**
2. Conecta tu repo del curso
3. Completa:
   ```
   Name:                curso-python-gdg-api
   Environment:         Python 3
   Region:              Oregon (USA) o tu región
   Branch:              main
   Root Directory:      backend
   Build Command:       pip install -r requirements.txt
   Start Command:       uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Plan:                Free
   ```

4. Click: **Advanced** → agregar Environment Variables:

| Key | Value |
|-----|-------|
| `APP_ENV` | `production` |
| `SUPABASE_URL` | Tu URL de Supabase |
| `SUPABASE_KEY` | Tu anon key de Supabase |
| `BACKEND_CORS_ORIGINS` | `https://curso-python-gdg.vercel.app` |

5. Click: **Create Web Service**

### 2.3 Esperar Deploy

- Render mostrará logs en tiempo real
- Espera a ver: `Uvicorn running on http://0.0.0.0:PORT`
- Tu URL será: `https://curso-python-gdg-api.onrender.com`

### 2.4 Verificar que funciona

```bash
curl https://curso-python-gdg-api.onrender.com/health
# Deberías ver: {"status": "ok"}
```

---

## 🌐 PASO 3: Desplegar Frontend en Vercel

### 3.1 Crear cuenta en Vercel
- Ve a: https://vercel.com
- Sign up → GitHub
- Autoriza acceso

### 3.2 Importar Proyecto

1. Click: **Add New Project**
2. Selecciona tu repo `python-curso-gdg`
3. Vercel detectará automáticamente:
   - Framework: Vite ✓
   - Build Command: `npm run build` ✓

4. Configura:
   ```
   Project Name:  curso-python-gdg
   Framework:     Vite (auto-detectado)
   Root Directory: frontend/
   ```

5. En **Environment Variables**, agrega:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://curso-python-gdg-api.onrender.com` |

6. Click: **Deploy**

### 3.3 Esperar Deploy

- Vercel mostrará progreso
- Espera a ver: ✓ Production Deployment Ready
- Tu URL será: `https://curso-python-gdg.vercel.app`

---

## 🔄 PASO 4: Conectar Frontend ↔ Backend

### 4.1 Actualizar CORS en Backend

Vuelve a Render y actualiza:
```
BACKEND_CORS_ORIGINS = https://curso-python-gdg.vercel.app
```

Render redesplegará automáticamente.

### 4.2 Verificar que frontend puede alcanzar backend

```bash
# En consola del navegador (F12):
fetch('https://curso-python-gdg-api.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
# Deberías ver: {status: "ok"}
```

---

## 🧪 PASO 5: Pruebas Completas End-to-End

### 5.1 Test de Carga de Página
```bash
# Verifica que la página carga
curl -I https://curso-python-gdg.vercel.app
# Debe ser 200 OK
```

### 5.2 Test de Formulario

1. Abre: https://curso-python-gdg.vercel.app
2. Click: "Iniciar Pre-Registro"
3. Llena el formulario completo
4. Clickea: "Completar Pre-Registro"
5. Deberías ver: ✅ "¡Pre-registro completado!"

### 5.3 Verificar en Supabase

1. Ve a: https://supabase.com/dashboard
2. Abre tu proyecto
3. Ve a: **Table Editor** → `pre_registrations`
4. Deberías ver el registro que acabas de crear

---

## ⚙️ Configuración Avanzada

### Auto-Deploy en Push

Tanto Render como Vercel lo hacen automáticamente:

1. Haces cambio local
2. Haces `git push` a `main`
3. Automáticamente:
   - ✓ Render compila y despliega backend
   - ✓ Vercel compila y despliega frontend
4. Tu app está updated en ~2-5 minutos

### Monitoreo

**Render Dashboard:**
- Logs en tiempo real
- CPU/Memory usage
- Deploy history

**Vercel Dashboard:**
- Analytics
- Performance metrics
- Error tracking

---

## 🆘 Troubleshooting

### Error: CORS bloqueado

**Síntomas:** En console del navegador ves error CORS

**Solución:**
1. Verifica que `BACKEND_CORS_ORIGINS` en Render es correcto
2. Espera 5 minutos después de actualizar env vars
3. Hard refresh del navegador (Ctrl+Shift+R)

### Error: 502 Bad Gateway

**Síntomas:** Página no carga, error 502

**Solución:**
1. Verifica logs en Render
2. Puede ser que `SUPABASE_URL` o `SUPABASE_KEY` sean inválidos
3. Revisa que las env vars estén correctas

### Backend no responde

**Síntomas:** API timeout o error de conexión

**Solución:**
1. Ve a Render dashboard
2. Verifica que el servicio dice "Running" (no "Deploying")
3. Revisa logs para errores de Python

---

## 📊 Costos Mensuales

| Servicio | Tier | Costo |
|----------|------|-------|
| **Render Backend** | Free | $0 |
| **Vercel Frontend** | Pro | $0 (free tier) |
| **Supabase DB** | Free | $0 (hasta 500k rows) |
| **TOTAL** | | **$0** |

> **Nota:** Conforme crezca, upgrade a Render Standard ($7/mes) + Vercel Pro ($20/mes)

---

## 🎯 Checklist de Deployment

- [ ] Código versionado en GitHub (`main` branch)
- [ ] `backend/requirements.txt` actualizado
- [ ] `frontend/package.json` actualizado
- [ ] `render.yaml` configurado
- [ ] `vercel.json` configurado
- [ ] Backend deployado en Render
  - [ ] URL funciona
  - [ ] Health check OK
  - [ ] Env vars correctas
- [ ] Frontend deployado en Vercel
  - [ ] URL funciona
  - [ ] VITE_API_URL correcto
  - [ ] Build sin errores
- [ ] CORS configurado correctamente
- [ ] Formulario funciona end-to-end
- [ ] Registro visible en Supabase
- [ ] Share URLs con equipo ✅

---

## 📞 URLs Productivas

Una vez completado:

| Servicio | URL |
|----------|-----|
| **Frontend (Usuario)** | https://curso-python-gdg.vercel.app |
| **Backend (Admin)** | https://curso-python-gdg-api.onrender.com |
| **Base de Datos** | Supabase Dashboard |

**Compartir:**
- Publicar en CUGDL/GDG Guadalajara
- Enviar por WhatsApp
- Publicar en redes sociales

---

## 🚀 Próximos Pasos (Futuro)

1. **Notificaciones por Email**
   - SendGrid integration
   - Enviar confirmación a estudiantes

2. **Admin Dashboard**
   - Ver registros en tiempo real
   - Exportar a CSV
   - Estadísticas

3. **Validación de Dominio**
   - Verificar emails `@alumnos.udg.mx`
   - Evitar registros duplicados

4. **Analytics**
   - Track conversión de pre-registros
   - Hotjar para UX testing

---

**Creado:** 2024-05-06
**Estado:** Listo para ejecutar
**Tiempo estimado:** 30 minutos
