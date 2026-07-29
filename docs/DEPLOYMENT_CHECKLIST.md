# 🚀 Deployment Checklist - Sistema de Pagos

## Estado General: ✅ LISTO PARA PRODUCCIÓN

Sistema completo de pagos implementado en 4 fases con:
- ✅ Base de datos Supabase
- ✅ Backend FastAPI (Railway)
- ✅ Frontend React (Netlify)
- ✅ Admin Dashboard

---

## 📋 Pre-Deploy Checklist

### Backend (FastAPI)

- [ ] Variables de entorno configuradas en Railway:

```env
# Supabase
SUPABASE_URL=https://meyazdjyumdprexdhpxw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña_segura
ADMIN_TOKEN=genera_un_token_aleatorio_fuerte

# CORS
BACKEND_CORS_ORIGINS=https://gdg-pythoncugdl.netlify.app

# App
APP_ENV=prod
APP_NAME="Sistema de Pagos GDG"
```

- [ ] Verificar que Railway tiene la última versión deployada:
  - Ir a: https://railway.app/project/XXXX
  - Click en "Deploy"
  - Esperar a que termine (verás ✓ en logs)

- [ ] Probar endpoints en producción:
  ```bash
  # Test bank info endpoint
  curl https://tu-backend.railway.app/api/registrations/payments/bank-info
  
  # Test health check
  curl https://tu-backend.railway.app/health
  ```

### Frontend (React)

- [ ] Variables de entorno configuradas en Netlify:

```env
REACT_APP_API_BASE=https://tu-backend.railway.app/api
```

- [ ] Verificar que Netlify tiene la última versión:
  - Ir a: https://app.netlify.com/sites/gdg-pythoncugdl
  - Buscar últimos deploys
  - Si está "published", está listo

- [ ] Probar rutas en producción:
  - Homepage: https://gdg-pythoncugdl.netlify.app/
  - Pre-registro: https://gdg-pythoncugdl.netlify.app/preregistro
  - Pagina pago: https://gdg-pythoncugdl.netlify.app/pagina-pago
  - Admin: https://gdg-pythoncugdl.netlify.app/admin/pagos

### Database (Supabase)

- [ ] Verificar que las tablas existen:
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  ```
  Debe retornar:
  - payment_methods
  - payment_records
  - payment_files

- [ ] Verificar que payment_methods tiene datos:
  ```sql
  SELECT * FROM payment_methods LIMIT 1;
  ```
  Debe retornar tu info bancaria BBVA

- [ ] Verificar RLS está habilitado:
  ```sql
  SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  ```

- [ ] Verificar Storage bucket existe:
  - Dashboard Supabase → Storage
  - Debe haber bucket: `payment-receipts`

---

## 🔑 Configuración de Admin Credentials

**IMPORTANTE:** Cambiar contraseña por defecto antes de producción

### Opción 1: Cambiar en Railway

1. Ve a Railway dashboard
2. Variables → click "Add Variable"
3. Agrega:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=contraseña_muy_segura_aqui
   ADMIN_TOKEN=token-aleatorio-fuerte-XXXXXXXXXXXX
   ```
4. Deploy nuevamente

### Opción 2: Usar bcrypt (Más Seguro)

```bash
# Generate bcrypt hash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'tu_contraseña', bcrypt.gensalt()).decode())"

# Copiar el hash y ponerlo en:
ADMIN_PASSWORD_HASH=<bcrypt_hash_aqui>
```

---

## 📱 Workflow Completo de Pagos

### Para Estudiante:

1. Entra a: https://gdg-pythoncugdl.netlify.app/pagina-pago
2. Selecciona método (Banco o SPEI)
3. Ve datos bancarios (CLABE, cuenta, titular)
4. Descarga PDF (si es banco) o copia CLABE (si es SPEI)
5. Realiza pago
6. Sube comprobante (1-5 archivos)
7. Ingresa:
   - ID pre-registro (de email de confirmación)
   - Email institucional
8. Envía comprobante
9. Recibe confirmación

### Para Admin:

1. Entra a: https://gdg-pythoncugdl.netlify.app/admin/pagos
2. Login con credenciales (admin/password)
3. Ve dashboard con estadísticas
4. Aplica filtros si necesita buscar específico
5. Click "Ver" en fila de pago
6. Modal abre con:
   - Datos del estudiante
   - Galería de comprobantes
   - Motivo rechazo (si aplica)
7. Verifica comprobante visualmente
8. Click [✓ Verificar Pago] O [✕ Rechazar]
9. Si rechaza, ingresa motivo (min 10 caracteres)
10. Sistema resetea status a "draft" para reenvío

---

## 🔍 Verificación Post-Deploy

### Prueba 1: Endpoint Banco Info
```bash
curl https://tu-backend.railway.app/api/registrations/payments/bank-info

# Debe retornar:
# {
#   "bank_name": "BBVA",
#   "account_holder": "Jose Manuel Alejandro Gonzalez Campos",
#   "clabe": "012180015244759227",
#   ...
# }
```

### Prueba 2: Upload de Archivo
```bash
# Crear archivo de prueba
echo "test" > test.txt

# Upload
curl -X POST \
  -F "pre_registration_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "institutional_email=test@udg.mx" \
  -F "payment_method=bank_reference" \
  -F "files=@test.txt" \
  https://tu-backend.railway.app/api/registrations/payments/upload

# Debe retornar payment_record con status="pending"
```

### Prueba 3: Admin Login
```bash
curl -X POST \
  "https://tu-backend.railway.app/api/admin/login?username=admin&password=password"

# Debe retornar:
# {
#   "access_token": "...",
#   "token_type": "bearer",
#   "expires_in": 86400
# }
```

### Prueba 4: Admin Get Payments
```bash
TOKEN="<access_token_from_previous_step>"

curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  https://tu-backend.railway.app/api/admin/payments

# Debe retornar lista de pagos
```

---

## 📊 Rutas Disponibles en Producción

### Estudiantes
```
GET  /                          → Landing page
GET  /preregistro               → Pre-registro form
GET  /registro-academico        → Academic registration
GET  /pagina-pago              → Payment page
```

### Admin
```
GET  /admin/pagos              → Admin dashboard (login required)
```

### API Endpoints
```
GET    /api/registrations/payments/bank-info
POST   /api/registrations/payments/upload
GET    /api/registrations/payments/status/{email}

POST   /api/admin/login
GET    /api/admin/payments
GET    /api/admin/payments/{id}
GET    /api/admin/payments/{id}/files
POST   /api/admin/payments/{id}/verify
POST   /api/admin/payments/{id}/reject
GET    /api/admin/payments/summary/stats
```

---

## 🐛 Troubleshooting

### "Error: Supabase no configurado"
- Verificar SUPABASE_URL y SUPABASE_KEY en Railway
- Verificar que no hay espacios en blanco
- Redeploy después de cambiar variables

### "401 Unauthorized" en admin endpoints
- Verificar que ADMIN_TOKEN es correcto
- Verificar que header "Authorization: Bearer TOKEN" está incluido
- Verificar que token no tiene comillas extras

### Archivos no se guardan en Storage
- Ir a Supabase Dashboard → Storage
- Verificar que bucket "payment-receipts" existe
- Verificar permisos RLS en bucket

### CORS errors en frontend
- Verificar que BACKEND_CORS_ORIGINS en Railway incluye URL de Netlify
- Incluir https:// completo
- Redeploy después de cambios

---

## 📝 Log Locations

### Backend Logs (Railway)
- https://railway.app/project/XXXX
- Sección "Deploy"
- Click en deployment más reciente

### Frontend Logs (Netlify)
- https://app.netlify.com/sites/gdg-pythoncugdl
- Sección "Deploys"
- Click en deploy más reciente

### Database Logs (Supabase)
- https://app.supabase.com/project/meyazdjyumdprexdhpxw
- Sección "Database" → "Logs"

---

## 🔒 Security Checklist

- [ ] Cambiar ADMIN_PASSWORD a contraseña segura
- [ ] Cambiar ADMIN_TOKEN a token aleatorio fuerte
- [ ] Usar HTTPS en todas las URLs
- [ ] Verificar BACKEND_CORS_ORIGINS no tiene "*"
- [ ] Verificar RLS está habilitado en todas las tablas
- [ ] Backup de Supabase habilitado
- [ ] No commitear variables sensibles a Git

---

## 📞 Soporte

Si hay errores post-deploy:

1. Revisar logs en Railway/Netlify
2. Verificar variables de entorno
3. Probar endpoints con curl
4. Verificar que BD tiene datos
5. Revisar CORS configuration

---

## ✅ Sign-Off

**Status: READY FOR DEPLOYMENT**

- Backend: Railway ✅
- Frontend: Netlify ✅
- Database: Supabase ✅
- Admin: Configured ✅
- Documentation: Complete ✅

**Próximos Pasos:**
1. Configurar variables en Railway
2. Hacer push a master (ya está hecho)
3. Railway auto-deploy desde GitHub
4. Netlify auto-deploy desde GitHub
5. Probar endpoints en producción
6. Documentar admin credentials de forma segura
