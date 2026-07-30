from __future__ import annotations

from typing import Any, Dict

import requests

from app.config import get_settings


class PreregistrationConflictError(Exception):
    pass


def get_prereg_rest_config() -> tuple[str, str, str]:
    settings = get_settings()
    url = settings.prereg_supabase_url
    key = settings.prereg_supabase_key
    table = settings.supabase_prereg_table

    if not url or not key:
        raise ValueError("Supabase de pre-registro no esta configurado")

    return url.rstrip("/"), key, table


def _rest_headers(api_key: str) -> Dict[str, str]:
    return {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def insert_prereg_rest_record(payload: Dict[str, Any]) -> Dict[str, Any]:
    base_url, api_key, table = get_prereg_rest_config()
    response = requests.post(
        f"{base_url}/rest/v1/{table}",
        headers={
            **_rest_headers(api_key),
            "Prefer": "return=representation",
        },
        json=payload,
        timeout=20,
    )

    if response.status_code == 409:
        raise PreregistrationConflictError("Conflicto por registro duplicado")

    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        detail = _extract_response_detail(response)
        raise requests.HTTPError(detail or str(exc), response=response) from exc

    data = response.json()
    if isinstance(data, list) and data:
        return data[0]
    if isinstance(data, dict):
        return data
    raise ValueError("Supabase no devolvio un registro insertado")


def get_prereg_rest_record_by_email(email: str) -> Dict[str, Any] | None:
    base_url, api_key, table = get_prereg_rest_config()
    response = requests.get(
        f"{base_url}/rest/v1/{table}",
        headers=_rest_headers(api_key),
        params={
            "institutional_email": f"eq.{email.strip().lower()}",
            "select": "*",
            "limit": 1,
        },
        timeout=20,
    )
    response.raise_for_status()

    data = response.json()
    if isinstance(data, list) and data:
        return data[0]
    return None


def _extract_response_detail(response: requests.Response) -> str | None:
    try:
        data = response.json()
    except ValueError:
        return response.text.strip() or None

    if isinstance(data, dict):
        for key in ("message", "detail", "hint", "code"):
            value = data.get(key)
            if value:
                return str(value)
    return response.text.strip() or None
