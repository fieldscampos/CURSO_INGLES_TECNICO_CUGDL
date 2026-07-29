import json
import os
from urllib.parse import urlparse, parse_qs

def handler(request):
    """Check payment status by email"""
    from supabase import create_client
    from supabase.lib.client_options import ClientOptions
    
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"status": "error", "message": "Supabase not configured"})
        }
    
    # Get email from query params
    email = None
    if hasattr(request, 'query'):
        email = request.query.get('email')
    elif hasattr(request, 'url'):
        parsed = urlparse(request.url)
        params = parse_qs(parsed.query)
        email = params.get('email', [None])[0]
    
    if not email:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"status": "error", "message": "Email required"})
        }
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(supabase_url, supabase_key, options=options)
        
        response = supabase.table("payment_records").select("id, status, rejection_reason, verified_at").eq("institutional_email", email).order("created_at", desc=True).limit(1).execute()
        
        if not response.data:
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"status": "no_payment", "message": "Aun no realizas tu pago"})
            }
        
        payment = response.data[0]
        
        if payment["status"] == "draft":
            result = {"status": "pending_verification", "message": "En proceso de verificacion"}
        elif payment["status"] == "verified":
            result = {"status": "verified", "message": "Aceptado", "verified_at": payment["verified_at"]}
        elif payment["status"] == "rejected":
            result = {"status": "rejected", "message": payment["rejection_reason"] or "Pago rechazado"}
        else:
            result = {"status": "unknown", "message": "Estado desconocido"}
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(result)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"status": "error", "message": str(e)})
        }
