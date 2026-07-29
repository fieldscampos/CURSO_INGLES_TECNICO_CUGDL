"""
Temporary admin utility for database migrations.
This should only be used for setup and development.
To be removed after initial deployment.
"""

from fastapi import APIRouter, HTTPException, Header
from app.config import get_settings
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

ADMIN_SECRET = os.getenv("ADMIN_MIGRATION_SECRET", "temporary-setup-key-change-me")


@router.post("/admin/execute-migration")
def execute_migration(
    migration_name: str,
    admin_key: str = Header(None, alias="X-Admin-Key")
):
    """
    Temporary endpoint to execute SQL migrations.
    Requires ADMIN_MIGRATION_SECRET header.
    
    ⚠️  SECURITY: Remove this endpoint after initial setup!
    """
    
    if not admin_key or admin_key != ADMIN_SECRET:
        logger.warning(f"Unauthorized migration attempt with key: {admin_key}")
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    settings = get_settings()
    
    # Map migration names to files
    migrations = {
        "payment_system": "database/migrations/payment_system_tables.sql"
    }
    
    if migration_name not in migrations:
        raise HTTPException(status_code=400, detail=f"Migration '{migration_name}' not found")
    
    migration_file = migrations[migration_name]
    
    # Read SQL file
    try:
        with open(migration_file, 'r') as f:
            sql_content = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Migration file not found: {migration_file}")
    
    # Execute using Supabase Python client
    try:
        from supabase import create_client
        from supabase.lib.client_options import ClientOptions
        
        # Use service role key for full access
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Split SQL into individual statements and execute
        # Note: Supabase RPC needs a function, or we need raw SQL access
        # This is a limitation of supabase-py
        
        logger.error("Supabase-py doesn't support raw SQL. Use Supabase Dashboard SQL editor instead.")
        raise HTTPException(
            status_code=500,
            detail="Raw SQL execution not available via Python client. Use Supabase Dashboard."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Migration execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")


@router.get("/admin/migration-instructions")
def get_migration_instructions():
    """Get instructions for executing pending migrations."""
    return {
        "message": "Manual migration required",
        "instructions": {
            "step_1": "Go to Supabase Dashboard",
            "step_2": "Select 'SQL Editor' from sidebar",
            "step_3": "Click 'New Query'",
            "step_4": "Copy-paste SQL from: database/migrations/payment_system_tables.sql",
            "step_5": "Click 'Run' button",
            "dashboard_url": "https://app.supabase.com/project/meyazdjyumdprexdhpxw/sql/new"
        },
        "after_migration": {
            "next_step": "Insert default payment_methods record",
            "example_sql": """
            INSERT INTO payment_methods (bank_name, account_holder, account_number, clabe, phone)
            VALUES ('Your Bank', 'Your Name', '123456789', '123456789012345678', '1234567890')
            ON CONFLICT DO NOTHING;
            """
        }
    }
