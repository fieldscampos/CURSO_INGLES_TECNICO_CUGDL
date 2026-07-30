from supabase import Client, create_client
from supabase.lib.client_options import ClientOptions

from app.config import get_settings


def _build_client(url: str, key: str) -> Client:
    options = ClientOptions(persist_session=False)
    return create_client(url, key, options=options)


def get_main_supabase_client() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError("SUPABASE_URL y SUPABASE_KEY no estan configurados")
    return _build_client(settings.supabase_url, settings.supabase_key)


def get_prereg_supabase_client() -> tuple[Client, str]:
    settings = get_settings()
    if not settings.prereg_supabase_url or not settings.prereg_supabase_key:
        raise RuntimeError(
            "SUPABASE_PREREG_URL/SUPABASE_PREREG_KEY o SUPABASE_URL/SUPABASE_KEY no estan configurados"
        )
    return _build_client(settings.prereg_supabase_url, settings.prereg_supabase_key), settings.supabase_prereg_table
