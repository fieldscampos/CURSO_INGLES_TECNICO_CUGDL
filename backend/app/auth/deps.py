from fastapi import Header, HTTPException, status

from app.auth.security import get_user_id_from_token


def get_current_user_id(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta token Bearer")
    token = authorization.split(" ", 1)[1].strip()
    return get_user_id_from_token(token)

