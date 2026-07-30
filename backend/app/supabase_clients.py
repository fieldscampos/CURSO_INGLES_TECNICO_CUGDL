import requests
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


def get_prereg_rest_config() -> tuple[str, dict[str, str]]:
    settings = get_settings()
    if not settings.prereg_supabase_url or not settings.prereg_supabase_key:
        raise RuntimeError(
            "SUPABASE_PREREG_URL/SUPABASE_PREREG_KEY o SUPABASE_URL/SUPABASE_KEY no estan configurados"
        )

    endpoint = f"{settings.prereg_supabase_url}/rest/v1/{settings.supabase_prereg_table}"
    headers = {
        "apikey": settings.prereg_supabase_key,
        "Authorization": f"Bearer {settings.prereg_supabase_key}",
        "Content-Type": "application/json",
    }
    return endpoint, headers


def insert_prereg_rest_record(payload: dict) -> dict:
    endpoint, headers = get_prereg_rest_config()
    response = requests.post(
        endpoint,
        headers={**headers, "Prefer": "return=representation"},
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    if not data:
        raise RuntimeError("Supabase no devolvio filas insertadas")
    return data[0]


def get_prereg_rest_record_by_email(email: str) -> dict | None:
    endpoint, headers = get_prereg_rest_config()
    response = requests.get(
        endpoint,
        headers=headers,
        params={"select": "*", "institutional_email": f"eq.{email}", "limit": "1"},
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data[0] if data else None
