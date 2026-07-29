import json
import os

def handler(request):
    """Get available course sessions"""
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
        
        sessions_response = supabase.table("course_sessions").select("*").execute()
        
        if not sessions_response.data:
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps([])
            }
        
        sessions = []
        for session in sessions_response.data:
            enrolled = supabase.table("payment_records").select("id", count="exact").eq("session_id", session["id"]).eq("status", "verified").execute()
            enrolled_count = enrolled.count if enrolled.count else 0
            available_slots = session["max_capacity"] - enrolled_count
            
            sessions.append({
                "id": session["id"],
                "day_of_week": session["day_of_week"],
                "start_time": session["start_time"],
                "end_time": session["end_time"],
                "max_capacity": session["max_capacity"],
                "available_slots": available_slots
            })
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(sessions)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
