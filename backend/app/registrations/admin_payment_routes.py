"""
Admin routes for payment verification and management.
These endpoints require admin authentication.
"""

from fastapi import APIRouter, HTTPException, Header, Query
from supabase import create_client
from supabase.lib.client_options import ClientOptions
from app.config import get_settings
from app.registrations.payment_schemas import (
    AdminVerifyPaymentIn, AdminRejectPaymentIn
)
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

# Admin credentials from environment
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")


def get_file_signed_url(supabase, bucket_name: str, file_path: str) -> str:
    """Generate a signed URL for a private file in Supabase Storage."""
    try:
        # Try to generate a signed URL valid for 1 hour
        signed_url = supabase.storage.from_(bucket_name).create_signed_url(
            file_path,
            3600  # 1 hour validity
        )
        return signed_url
    except Exception as e:
        logger.warning(f"Could not generate signed URL for {file_path}: {str(e)}, using public URL fallback")
        # Fallback: return the file_path as-is for frontend to construct URL
        return file_path


def verify_admin_token(token: str) -> bool:
    """Verify admin authentication token."""
    # Simple token verification - in production, use JWT
    expected_token = os.getenv("ADMIN_TOKEN", "temp-admin-token-change-me")
    return token == expected_token


def verify_admin_credentials(username: str, password: str) -> str:
    """Verify admin username/password and return token."""
    admin_user = os.getenv("ADMIN_USERNAME", "admin")
    admin_pass = os.getenv("ADMIN_PASSWORD", "password")
    
    if username == admin_user and password == admin_pass:
        # In production, generate JWT token
        return os.getenv("ADMIN_TOKEN", "temp-admin-token-change-me")
    
    return None


@router.post("/admin/login")
def admin_login(username: str, password: str):
    """
    Admin login endpoint.
    Returns authentication token if credentials are valid.
    """
    token = verify_admin_credentials(username, password)
    
    if not token:
        logger.warning(f"Failed admin login attempt for user: {username}")
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    logger.info(f"Admin login successful for user: {username}")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 86400  # 24 hours
    }


def get_admin_token(auth_header: str = Header(None, alias="Authorization")) -> str:
    """Extract and verify admin token from Authorization header."""
    if not auth_header:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Formato de token inválido")
    
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return token


@router.get("/admin/payments")
def list_payments(
    status: str = Query(None, description="Filter by status: draft, pending, verified, rejected, completed"),
    email: str = Query(None, description="Search by institutional email"),
    pre_registration_id: str = Query(None, description="Filter by pre-registration ID"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    authorization: str = Header(None, alias="Authorization")
):
    """
    List all payment records with optional filters.
    Requires admin authentication.
    Returns paginated results with total count.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Build query for count
        count_query = supabase.table("payment_records").select("id", count="exact")
        
        # Apply same filters to count query
        if status:
            count_query = count_query.eq("status", status)
        if email:
            count_query = count_query.ilike("institutional_email", f"%{email}%")
        if pre_registration_id:
            count_query = count_query.eq("pre_registration_id", pre_registration_id)
        
        # Get total count
        count_response = count_query.execute()
        total_count = count_response.count if count_response.count is not None else 0
        
        logger.info(f"Count query: total_count={total_count}")
        
        # Build main query for data
        query = supabase.table("payment_records").select(
            "id, pre_registration_id, institutional_email, payment_method, status, rejection_reason, verified_by, verified_at, created_at, updated_at, session_id"
        )
        
        # Apply filters
        if status:
            query = query.eq("status", status)
        if email:
            query = query.ilike("institutional_email", f"%{email}%")
        if pre_registration_id:
            query = query.eq("pre_registration_id", pre_registration_id)
        
        # Order by latest first
        query = query.order("created_at", desc=True)
        
        # Pagination
        query = query.range(offset, offset + limit - 1)
        
        response = query.execute()
        
        logger.info(f"Admin fetched {len(response.data)} payment records (total: {total_count})")
        
        return {
            "count": len(response.data),
            "limit": limit,
            "offset": offset,
            "total": total_count,
            "records": response.data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing payments: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/admin/payments/{payment_record_id}")
def get_payment_detail(
    payment_record_id: str,
    authorization: str = Header(None, alias="Authorization")
):
    """
    Get detailed payment record with all associated files.
    Requires admin authentication.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Get payment record
        record_response = supabase.table("payment_records").select("*").eq("id", payment_record_id).execute()
        
        if not record_response.data:
            raise HTTPException(status_code=404, detail="Registro de pago no encontrado")
        
        payment_record = record_response.data[0]
        
        # Get associated files
        files_response = supabase.table("payment_files").select("*").eq(
            "payment_record_id", payment_record_id
        ).order("uploaded_at", desc=False).execute()
        
        # Generate signed URLs or fallback URLs for file preview
        files_with_urls = []
        if files_response.data:
            for file in files_response.data:
                file_path = file["file_path"]
                try:
                    logger.info(f"Generating signed URL for file_path: {file_path}")
                    signed_url = supabase.storage.from_("payment-receipts").create_signed_url(
                        file_path,
                        3600  # 1 hour validity
                    )
                    logger.info(f"Signed URL generated successfully for {file_path}")
                    file["file_path"] = signed_url
                except Exception as e:
                    logger.warning(f"Signed URL failed for {file_path}, returning file_path for client-side processing: {str(e)}")
                    # Return just the file_path - frontend will handle URL construction
                    file["file_path"] = file_path
                files_with_urls.append(file)
        
        payment_record["files"] = files_with_urls
        
        # Get pre-registration info for context
        pre_reg_response = supabase.table("pre_registrations").select(
            "id, full_name, institutional_email, personal_email, phone_whatsapp, student_code"
        ).eq("id", payment_record["pre_registration_id"]).execute()
        
        if pre_reg_response.data:
            payment_record["pre_registration"] = pre_reg_response.data[0]
        
        logger.info(f"Admin fetched payment details: {payment_record_id}")
        
        return payment_record
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment detail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/admin/payments/{payment_record_id}/verify")
def verify_payment(
    payment_record_id: str,
    data: AdminVerifyPaymentIn,
    authorization: str = Header(None, alias="Authorization")
):
    """
    Mark payment as verified.
    Updates status to 'verified' and records admin info.
    Requires admin authentication.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Verify record exists
        record_response = supabase.table("payment_records").select("*").eq("id", payment_record_id).execute()
        if not record_response.data:
            raise HTTPException(status_code=404, detail="Registro no encontrado")
        
        # Update status
        update_response = supabase.table("payment_records").update({
            "status": "verified",
            "verified_by": data.verified_by,
            "verified_at": "NOW()"  # Will be handled by server timestamp
        }).eq("id", payment_record_id).execute()
        
        if update_response.data:
            logger.info(f"Payment verified: {payment_record_id} by {data.verified_by}")
            
            return {
                "success": True,
                "message": "Pago verificado exitosamente",
                "payment_record": update_response.data[0]
            }
        else:
            raise HTTPException(status_code=500, detail="Error actualizando registro")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/admin/payments/{payment_record_id}/reject")
def reject_payment(
    payment_record_id: str,
    data: AdminRejectPaymentIn,
    authorization: str = Header(None, alias="Authorization")
):
    """
    Mark payment as rejected.
    Updates status to 'rejected' and stores rejection reason.
    Requires admin authentication.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    if not data.rejection_reason or len(data.rejection_reason.strip()) < 10:
        raise HTTPException(status_code=400, detail="Motivo de rechazo debe tener al menos 10 caracteres")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Verify record exists
        record_response = supabase.table("payment_records").select("*").eq("id", payment_record_id).execute()
        if not record_response.data:
            raise HTTPException(status_code=404, detail="Registro no encontrado")
        
        # Update status - reset to draft to allow re-submission
        update_response = supabase.table("payment_records").update({
            "status": "draft",
            "rejection_reason": data.rejection_reason,
            "verified_by": data.verified_by,
            "verified_at": "NOW()"
        }).eq("id", payment_record_id).execute()
        
        if update_response.data:
            logger.info(f"Payment rejected: {payment_record_id} by {data.verified_by}")
            
            return {
                "success": True,
                "message": "Pago rechazado. Estudiante puede reenviar comprobante",
                "payment_record": update_response.data[0]
            }
        else:
            raise HTTPException(status_code=500, detail="Error actualizando registro")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error rejecting payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/admin/payments/{payment_record_id}/files")
def get_payment_files(
    payment_record_id: str,
    authorization: str = Header(None, alias="Authorization")
):
    """
    Get all files associated with a payment record.
    Includes download URLs for viewing.
    Requires admin authentication.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Verify payment record exists
        record_response = supabase.table("payment_records").select("id").eq("id", payment_record_id).execute()
        if not record_response.data:
            raise HTTPException(status_code=404, detail="Registro de pago no encontrado")
        
        # Get files
        files_response = supabase.table("payment_files").select("*").eq(
            "payment_record_id", payment_record_id
        ).order("is_primary", desc=True).order("uploaded_at", desc=False).execute()
        
        # Generate signed URLs for each file (valid for 1 hour)
        files_with_urls = []
        for file in files_response.data:
            try:
                signed_url = supabase.storage.from_("payment-receipts").create_signed_url(
                    file["file_path"],
                    3600  # 1 hour expiry
                )
                file["download_url"] = signed_url
            except Exception as e:
                logger.warning(f"Could not generate signed URL for {file['file_path']}: {e}")
                file["download_url"] = None
            
            files_with_urls.append(file)
        
        logger.info(f"Admin fetched {len(files_with_urls)} files for payment: {payment_record_id}")
        
        return {
            "count": len(files_with_urls),
            "files": files_with_urls
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/admin/payments/summary/stats")
def get_payment_stats(authorization: str = Header(None, alias="Authorization")):
    """
    Get payment statistics summary.
    Requires admin authentication.
    """
    admin_token = get_admin_token(authorization)
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Get count by status
        response = supabase.table("payment_records").select("status").execute()
        
        stats = {
            "total": len(response.data),
            "by_status": {}
        }
        
        for record in response.data:
            status = record["status"]
            stats["by_status"][status] = stats["by_status"].get(status, 0) + 1
        
        logger.info(f"Admin fetched payment stats")
        
        return stats
        
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
