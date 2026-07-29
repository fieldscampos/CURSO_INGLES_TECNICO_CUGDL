from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from supabase import create_client

from app.auth.routes import router as auth_router
from app.config import get_settings
from app.courses.routes import router as courses_router
from app.questionnaires.routes import router as questionnaires_router
from app.registrations.routes import router as registrations_router
from app.registrations.payment_routes import router as payment_router
from app.registrations.admin_payment_routes import router as admin_payment_router
from app.admin_migrations import router as admin_migrations_router

settings = get_settings()

# Ensure we have valid CORS origins
cors_origins = settings.cors_origins_list if settings.cors_origins_list else ["*"]

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    docs_url="/api/docs" if settings.app_env == "dev" else None,
)

# Agregar CORS middleware PRIMERO (será ejecutado SEGUNDO)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agregar middleware HTTP personalizado SEGUNDO (será ejecutado PRIMERO)
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    """Handle CORS preflight requests before validation."""
    if request.method == "OPTIONS":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "3600",
            },
        )
    response = await call_next(request)
    return response


@app.options("/{full_path:path}", include_in_schema=False)
async def preflight(full_path: str):
    """Universal preflight endpoint."""
    return {}


@app.get("/")
def root() -> dict:
    return {"message": settings.app_name, "env": settings.app_env}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/health/deps")
def health_deps() -> dict:
    deps = {
        "google": {
            "configured": bool(settings.google_client_id),
            "client_id_preview": (settings.google_client_id[:16] + "...") if settings.google_client_id else None,
        },
        "supabase": {
            "configured": bool(settings.supabase_url and settings.supabase_key),
            "connected": False,
            "error": None,
        },
    }

    if deps["supabase"]["configured"]:
        try:
            client = create_client(settings.supabase_url, settings.supabase_key)
            client.table("questionnaire_questions").select("id").limit(1).execute()
            deps["supabase"]["connected"] = True
        except Exception as exc:  # pragma: no cover - depende de entorno externo
            deps["supabase"]["error"] = str(exc)

    return deps


app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(courses_router, prefix="/api/courses", tags=["courses"])
app.include_router(registrations_router, prefix="/api/registrations", tags=["registrations"])
app.include_router(payment_router, prefix="/api/registrations", tags=["payments"])
app.include_router(admin_payment_router, prefix="/api", tags=["admin-payments"])
app.include_router(questionnaires_router, prefix="/api/questionnaires", tags=["questionnaires"])
app.include_router(admin_migrations_router, prefix="/api", tags=["admin"])

