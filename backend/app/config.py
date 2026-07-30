from functools import lru_cache
import json
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        extra="ignore",
        json_schema_extra={
            "backend_cors_origins": ["http://localhost:5173"],
        }
    )

    app_name: str = "Curso Intensivo de Ingles Tecnico CUGDL x Growmo"
    app_env: str = "dev"
    backend_cors_origins: str = "http://localhost:5173"

    jwt_secret: str = "change_me_production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    google_client_id: str | None = None
    allow_dev_email_login: bool = True
    allowed_email_domains: str = "estudiantes.udg.mx,alumnos.udg.mx"

    supabase_url: str | None = None
    supabase_key: str | None = None
    supabase_prereg_url: str | None = None
    supabase_prereg_key: str | None = None
    supabase_prereg_table: str = "english_tech_preregistrations"

    @property
    def prereg_supabase_url(self) -> str | None:
        return self.supabase_prereg_url or self.supabase_url

    @property
    def prereg_supabase_key(self) -> str | None:
        return self.supabase_prereg_key or self.supabase_key

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from CSV or JSON-array string."""
        if isinstance(self.backend_cors_origins, list):
            return self.backend_cors_origins
        raw = (self.backend_cors_origins or "").strip()
        if not raw:
            return []

        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    return [str(item).strip() for item in parsed if str(item).strip()]
            except json.JSONDecodeError:
                pass

        return [item.strip().strip('"').strip("'") for item in raw.split(",") if item.strip()]

    @property
    def email_domains_list(self) -> List[str]:
        """Parse allowed email domains from string."""
        if isinstance(self.allowed_email_domains, list):
            return self.allowed_email_domains
        return [item.strip().lower().lstrip("@") for item in self.allowed_email_domains.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
