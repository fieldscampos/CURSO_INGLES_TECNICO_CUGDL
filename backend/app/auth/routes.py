from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.deps import get_current_user_id
from app.auth.google_verifier import verify_google_id_token
from app.auth.schemas import AuthResponse, LoginRequest, UserOut
from app.auth.security import create_access_token
from app.config import get_settings
from app.storage.repository import get_repository

router = APIRouter()

@router.post("/google-login", response_model=AuthResponse)
def google_login(payload: LoginRequest) -> AuthResponse:
    settings = get_settings()
    repo = get_repository()

    # Prioridad: login real via Google One Tap / GIS token.
    if payload.google_id_token:
        if not settings.google_client_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Falta configurar GOOGLE_CLIENT_ID en backend",
            )
        google_payload = verify_google_id_token(payload.google_id_token, settings.google_client_id)
        email = str(google_payload.get("email", "")).strip().lower()
        full_name = str(google_payload.get("name") or payload.full_name or "").strip() or None
    else:
        if not settings.allow_dev_email_login:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Login por email deshabilitado. Usa Google Sign-In.",
            )
        email = str(payload.email).strip().lower() if payload.email else ""
        full_name = payload.full_name

    allowed_suffixes = tuple(f"@{domain}" for domain in settings.email_domains_list)
    if not email.endswith(allowed_suffixes):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Solo se permite correo institucional UDG "
                f"({', '.join(allowed_suffixes)})"
            ),
        )

    user = repo.get_or_create_user(email=email, full_name=full_name)
    token = create_access_token(user.id)

    return AuthResponse(
        access_token=token,
        user=UserOut(id=user.id, email=user.email, full_name=user.full_name),
    )


@router.get("/me", response_model=UserOut)
def me(user_id: str = Depends(get_current_user_id)) -> UserOut:
    repo = get_repository()
    user = repo.get_user(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return UserOut(id=user.id, email=user.email, full_name=user.full_name)

