# Curso de Python GDG Guadalajara x CUGDL

Aplicacion web para pre-registro de estudiantes al curso patrocinado por GDG Guadalajara y avalado por CUGDL.

## Que incluye

- Backend en FastAPI con endpoints para:
  - login real con Google ID token (GIS)
  - pre-registro
  - cuestionario de preguntas abiertas
  - consulta de syllabus
- Frontend en React + Vite con flujo completo:
  - landing
  - login
  - pre-registro
  - cuestionario
  - dashboard con plan de estudio
- SQL base para Supabase en `database/schema.sql` y `database/seed.sql`
- Pruebas de API en `backend/tests/test_api.py`

## Estructura

- `backend/`: API FastAPI
- `frontend/`: UI React
- `database/`: scripts SQL para Supabase

## Variables de entorno

1. Backend: copiar `backend/.env.example` a `backend/.env`
2. Frontend: copiar `frontend/.env.example` a `frontend/.env`

### Variables nuevas importantes

- Backend (`backend/.env`):
  - `GOOGLE_CLIENT_ID`: client id de Google Cloud (OAuth Web)
  - `ALLOW_DEV_EMAIL_LOGIN=true|false`: fallback local sin token Google
  - `SUPABASE_URL` y `SUPABASE_KEY`: habilitan persistencia real en Supabase
- Frontend (`frontend/.env`):
  - `VITE_GOOGLE_CLIENT_ID`: client id para renderizar `GoogleLogin`

## Try it (local)

### 1) Backend

```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run_dev.py
```

### 2) Frontend

```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/frontend
npm install
cp .env.example .env
npm run dev
```

- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Ejecutar pruebas

```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG/backend
source .venv/bin/activate
pytest -q
```

## Nota sobre Google OAuth real

Ahora el backend acepta `google_id_token` y valida el token contra `GOOGLE_CLIENT_ID`.
Si no configuras Client ID, puedes usar fallback de desarrollo por email (si `ALLOW_DEV_EMAIL_LOGIN=true`).

## Nota sobre Supabase

Cuando defines `SUPABASE_URL` y `SUPABASE_KEY`, el backend cambia automaticamente de almacenamiento en memoria a tablas reales en Supabase.
Si esas variables no estan definidas, usa repositorio local en memoria.

## Configuracion y deploy guiado

Sigue la guia completa en `docs/GOOGLE_SUPABASE_DEPLOY.md`.
Incluye:
- configuracion real de Google OAuth (GIS)
- setup SQL en Supabase
- validacion por `/health/deps`
- deploy backend en Render + frontend en Vercel

Archivos de deploy incluidos:
- `render.yaml` (backend en Render)
- `frontend/vercel.json` (SPA frontend en Vercel)

Smoke test basico (local o prod):

```bash
cd /Users/cesar/CODE/PYTHON_CURSO_GDG
API_BASE_URL=http://localhost:8000 bash scripts/smoke_test.sh
```

