from pydantic import BaseModel, EmailStr, model_validator


class LoginRequest(BaseModel):
    google_id_token: str | None = None
    email: EmailStr | None = None
    full_name: str | None = None

    @model_validator(mode="after")
    def validate_input(self) -> "LoginRequest":
        if not self.google_id_token and not self.email:
            raise ValueError("Debes enviar google_id_token o email")
        return self


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

