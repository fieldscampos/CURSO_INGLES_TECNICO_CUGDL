# 🎯 RESUMEN EJECUTIVO: Deployment en 5 Pasos

## Para Iniciar Pre-Registros AHORA

### ✅ Recomendación
**Vercel (Frontend) + Render (Backend) + Supabase (BD)**
- ✓ Gratis
- ✓ HTTPS incluido
- ✓ Deploy automático
- ✓ Listo en ~30 minutos

---

## 📋 Checklist Rápido

```
1. [ ] Repo en GitHub (main branch)
2. [ ] Backend en Render
   - [ ] Conectar GitHub
   - [ ] Env vars: SUPABASE_URL, SUPABASE_KEY
   - [ ] Copy URL: https://curso-python-gdg-api.onrender.com
3. [ ] Frontend en Vercel  
   - [ ] Conectar GitHub
   - [ ] Env var: VITE_API_URL = (URL de Render)
   - [ ] Copy URL: https://curso-python-gdg.vercel.app
4. [ ] Actualizar CORS en Render
   - [ ] BACKEND_CORS_ORIGINS = URL de Vercel
5. [ ] Probar:
   - [ ] https://curso-python-gdg.vercel.app
   - [ ] Llenar formulario
   - [ ] Verificar en Supabase
```

---

## 🔗 URLs a Usar

| Plataforma | URL |
|-----------|-----|
| **Render** (Backend) | https://render.com |
| **Vercel** (Frontend) | https://vercel.com |
| **Supabase** (DB) | https://supabase.com/dashboard |
| **GitHub** | Tu repo |

---

## 📝 Environment Variables

### Backend (Render)
```
APP_ENV = production
SUPABASE_URL = [Tu URL]
SUPABASE_KEY = [Tu Anon Key]
BACKEND_CORS_ORIGINS = https://curso-python-gdg.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL = https://curso-python-gdg-api.onrender.com
```

---

## ⏱️ Tiempo Estimado

| Tarea | Tiempo |
|-------|--------|
| Preparar código | 5 min |
| Deploy backend | 10 min |
| Deploy frontend | 10 min |
| Configurar CORS | 2 min |
| Pruebas | 5 min |
| **TOTAL** | **~32 min** |

---

## 🎯 Resultado Final

```
https://curso-python-gdg.vercel.app
│
├─ Landing page ✓
├─ Botón pre-registro ✓
├─ Formulario ✓
└─ Guarda en Supabase ✓
```

**URL para compartir:**
```
https://curso-python-gdg.vercel.app
```

---

**Guía completa:** `/docs/DEPLOYMENT_GUIDE.md`

Necesitas ayuda en algún paso específico?
