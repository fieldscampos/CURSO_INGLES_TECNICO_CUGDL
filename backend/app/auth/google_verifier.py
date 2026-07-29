from google.auth.transport import requests
from google.oauth2 import id_token


def verify_google_id_token(token: str, client_id: str) -> dict:
    return id_token.verify_oauth2_token(token, requests.Request(), client_id)

