# Configuracion real: Google + Supabase + Deploy

Esta guia te lleva de "local" a "produccion" para el proyecto.

## 1) Supabase

1. Crea proyecto en Supabase.
2. Ve a SQL Editor y ejecuta en orden:
   - `database/schema.sql`
   - `database/seed.sql`
3. En `Project Settings > API`, copia:
   - `Project URL` -> `SUPABASE_URL`
   - `service_role key` -> `SUPABASE_KEY` (solo backend, nunca frontend)

## 2) Google Cloud OAuth (Google Identity Services)

1. En Google Cloud Console crea/selecciona proyecto.
2. Configura OAuth Consent Screen (tipo External o Internal segun aplique).
3. Crea credencial **OAuth 2.0 Client ID** tipo **Web application**.
4. Agrega `Authorized JavaScript origins`:
   - `http://localhost:5173`
   - `https://curso-python-gdg.vercel.app` (o tu dominio final)
5. Copia Client ID y configuralo en:
   - Backend: `GOOGLE_CLIENT_ID`
   - Frontend: `VITE_GOOGLE_CLIENT_ID`

## 3) Variables de entorno local

### Backend (`backend/.env`)

```dotenv
APP_NAME=Curso de Python GDG Guadalajara x CUGDL
APP_ENV=dev
BACKEND_CORS_ORIGINS=http://localhost:5173
JWT_SECRET=pon_un_secreto_largo
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GOOGLE_CLIENT_ID=tu_google_client_id
ALLOW_DEV_EMAIL_LOGIN=false
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=tu_service_role_key
```

### Frontend (`frontend/.env`)

```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

## 4) Prueba local de dependencias

1. Levanta backend y frontend.
2. Verifica endpoint de diagnostico:

```bash
curl http://localhost:8000/health/deps
```

Esperado:
- `google.configured = true`
- `supabase.configured = true`
- `supabase.connected = true`

## 5) Deploy recomendado

- Backend: Render (`render.yaml` en raiz)
- Frontend: Vercel (`frontend/vercel.json`)

### 5.1 Deploy backend en Render

1. Conecta repo y crea servicio desde `render.yaml`.
2. Define env vars secretas en Render:
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
3. Ajusta `BACKEND_CORS_ORIGINS` al dominio real del frontend.

### 5.2 Deploy frontend en Vercel

1. Importa carpeta `frontend` como proyecto.
2. Configura env vars:
   - `VITE_API_URL=https://<tu-backend>.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID=<tu_google_client_id>`
3. Deploy.

## 6) Smoke test en produccion

1. Abre frontend desplegado.
2. Inicia sesion con Google institucional UDG.
3. Completa pre-registro y cuestionario.
4. Revisa en Supabase:
   - `users`
   - `pre_registrations`
   - `questionnaire_responses`

## 7) Seguridad minima para go-live

- `ALLOW_DEV_EMAIL_LOGIN=false`
- `SUPABASE_KEY` solo en backend
- Rotar `JWT_SECRET` fuerte
- Restringir CORS al dominio real

