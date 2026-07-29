import json
import os

def handler(request):
    """Get bank payment info"""
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
            "body": json.dumps({"error": "Supabase not configured"})
        }
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(supabase_url, supabase_key, options=options)
        response = supabase.table("payment_methods").select("*").limit(1).execute()
        
        if not response.data:
            return {
                "statusCode": 404,
                "headers": headers,
                "body": json.dumps({"error": "Payment method not found"})
            }
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(response.data[0])
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
