from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from supabase import create_client
from supabase.lib.client_options import ClientOptions
from app.registrations.payment_schemas import (
    PaymentRecordIn, PaymentRecordOut, PaymentFileIn, PaymentMethodDataOut,
    AdminVerifyPaymentIn, AdminRejectPaymentIn, CourseSessionOut, PaymentStatusOut,
    SessionSelectionIn
)
from app.config import get_settings
import logging
import uuid
from datetime import datetime
from typing import List

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/payments/bank-info", response_model=PaymentMethodDataOut)
def get_bank_info():
    """
    Get bank information for payment methods (public endpoint).
    Returns account details for both bank reference and SPEI transfer.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        logger.error("Supabase no está configurado")
        raise HTTPException(
            status_code=500,
            detail="El servidor no está configurado en este momento"
        )
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        response = supabase.table("payment_methods").select("*").limit(1).execute()
        
        if not response.data:
            logger.warning("No payment method found in database")
            raise HTTPException(
                status_code=404,
                detail="Información de pago no configurada"
            )
        
        payment_method = response.data[0]
        logger.info("Bank info retrieved successfully")
        
        return PaymentMethodDataOut(**payment_method)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching bank info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener información de pago: {str(e)}"
        )


@router.post("/payments/upload", response_model=PaymentRecordOut, status_code=201)
async def upload_payment_proof(
    institutional_email: str = Form(...),
    payment_method: str = Form(...),
    session_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """
    Upload proof of payment (screenshots/documents).
    Validates that institutional_email exists in pre_registrations.
    Creates payment_record and payment_files entries.
    Stores files in Supabase Storage.
    Assigns selected course session.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    # Validate payment_method
    if payment_method not in ['bank_reference', 'bank_transfer']:
        raise HTTPException(
            status_code=400,
            detail="payment_method debe ser 'bank_reference' o 'bank_transfer'"
        )
    
    # Validate files
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="Debe subir al menos un comprobante")
    
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Máximo 5 archivos por envío")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Verify institutional_email exists in pre_registrations
        pre_reg = supabase.table("pre_registrations").select("id").eq("institutional_email", institutional_email).execute()
        if not pre_reg.data:
            raise HTTPException(status_code=404, detail="Email no registrado en pre-registro. Verifica que sea el email institucional usado en tu pre-registro.")
        
        pre_registration_id = pre_reg.data[0]["id"]
        
        # Create payment_record
        payment_record_data = {
            "pre_registration_id": pre_registration_id,
            "institutional_email": institutional_email,
            "payment_method": payment_method,
            "session_id": session_id,
            "session_choice_at": datetime.utcnow().isoformat(),
            "status": "draft"
        }
        
        payment_record_response = supabase.table("payment_records").insert(payment_record_data).execute()
        
        if not payment_record_response.data:
            raise HTTPException(status_code=500, detail="Error creando registro de pago")
        
        payment_record = payment_record_response.data[0]
        payment_record_id = payment_record["id"]
        
        # Upload files to Storage
        uploaded_files = []
        storage_path = f"receipts/{payment_record_id}"
        
        # MIME type mapping for extensions
        mime_type_map = {
            'heic': 'image/heic',
            'heif': 'image/heif',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'pdf': 'application/pdf'
        }
        
        for idx, file in enumerate(files):
            try:
                # Validate file size (max 5MB)
                file_size_mb = len(await file.read()) / (1024 * 1024)
                await file.seek(0)  # Reset file pointer
                
                if file_size_mb > 5:
                    raise HTTPException(status_code=400, detail=f"Archivo {file.filename} excede 5MB")
                
                # Get file extension and correct MIME type
                file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'bin'
                
                # Use correct MIME type based on extension (browsers sometimes send incorrect MIME types)
                content_type = mime_type_map.get(file_ext, file.content_type)
                
                # Validate file type
                allowed_types = {'image/png', 'image/jpeg', 'application/pdf', 'image/heic', 'image/heif'}
                if content_type not in allowed_types:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Tipo de archivo no permitido: {file_ext.upper()}. Formatos válidos: PNG, JPG, PDF, HEIC"
                    )
                
                # Generate unique filename
                unique_filename = f"{uuid.uuid4()}.{file_ext}"
                file_path = f"{storage_path}/{unique_filename}"
                
                # Upload to Supabase Storage with corrected MIME type
                file_content = await file.read()
                storage_response = supabase.storage.from_("payment-receipts").upload(
                    file_path,
                    file_content,
                    {"contentType": content_type}
                )
                
                # Create payment_file record
                payment_file_data = {
                    "payment_record_id": payment_record_id,
                    "file_name": file.filename,
                    "file_path": file_path,
                    "file_type": "pdf" if content_type == "application/pdf" else "screenshot",
                    "file_size_kb": int(file_size_mb * 1024),
                    "is_primary": idx == 0  # Mark first file as primary
                }
                
                file_response = supabase.table("payment_files").insert(payment_file_data).execute()
                
                if file_response.data:
                    uploaded_files.append(file_response.data[0])
                    logger.info(f"File uploaded: {file_path}")
                
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Error uploading file {file.filename}: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error subiendo {file.filename}: {str(e)}")
        
        # Update payment_record status to 'pending' after successful uploads
        supabase.table("payment_records").update({"status": "pending"}).eq("id", payment_record_id).execute()
        
        # Fetch updated payment_record with files
        updated_record = supabase.table("payment_records").select("*").eq("id", payment_record_id).execute()
        
        logger.info(f"Payment record created: {payment_record_id} with {len(uploaded_files)} files")
        
        return PaymentRecordOut(
            **updated_record.data[0],
            files=uploaded_files
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en payment upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar pago: {str(e)}"
        )


@router.get("/payments/status/{institutional_email}")
def get_payment_status(institutional_email: str):
    """
    Get payment status for a student (identified by institutional email).
    Returns latest payment record and all associated files.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Get all payment records for this email
        records_response = supabase.table("payment_records").select("*").eq(
            "institutional_email", institutional_email
        ).order("created_at", desc=True).execute()
        
        if not records_response.data:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron pagos para este email"
            )
        
        # Get files for each record
        records_with_files = []
        for record in records_response.data:
            files_response = supabase.table("payment_files").select("*").eq(
                "payment_record_id", record["id"]
            ).execute()
            
            records_with_files.append({
                **record,
                "files": files_response.data if files_response.data else []
            })
        
        return {
            "count": len(records_with_files),
            "records": records_with_files
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener estatus de pago: {str(e)}"
        )


@router.post("/payments/admin/apply-migration")
def apply_migration_endpoint():
    """
    Apply course_sessions migration. 
    Admin-only endpoint to bootstrap the database schema.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Read migration SQL
        import os
        migration_path = os.path.join(
            os.path.dirname(__file__),
            '../../../database/migrations/20260518_add_course_sessions_and_scheduling.sql'
        )
        
        with open(migration_path, 'r') as f:
            migration_sql = f.read()
        
        # Try to execute using rpc
        # Note: This requires a custom function in Postgres
        # For now, we'll execute individual statements
        
        # Split by comments and execute
        statements = []
        current = ""
        for line in migration_sql.split('\n'):
            if not line.strip().startswith('--'):
                current += line + "\n"
                if line.strip().endswith(';'):
                    statements.append(current.strip())
                    current = ""
        
        if current.strip():
            statements.append(current.strip())
        
        # Execute via direct API (won't work for SQL but we try)
        executed = 0
        errors = []
        
        for stmt in statements:
            if not stmt.strip():
                continue
            try:
                # Try to execute using rpc if it exists
                result = supabase.rpc('execute_sql', {'query': stmt}).execute()
                executed += 1
            except Exception as e:
                error_msg = str(e)
                # Check if it's an RLS or access error (expected)
                if 'PGRST205' in error_msg or 'not found' in error_msg.lower():
                    errors.append(error_msg)
                elif 'execute_sql' in error_msg:
                    # Expected - function doesn't exist
                    pass
                else:
                    errors.append(error_msg)
        
        logger.info(f"Migration application attempted: {executed} statements executed")
        
        return {
            "status": "migration_triggered",
            "message": "Please execute the migration SQL manually in Supabase SQL Editor",
            "migration_file": migration_path,
            "statements_count": len(statements)
        }
        
    except Exception as e:
        logger.error(f"Error applying migration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/payments/sessions")
def get_available_sessions():
    """
    Get all available course sessions.
    Returns list of sessions with enrollment counts.
    Public endpoint.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Fetch all sessions
        sessions_response = supabase.table("course_sessions").select("*").execute()
        
        if not sessions_response.data:
            logger.warning("No sessions found in database")
            raise HTTPException(
                status_code=404,
                detail="No hay sesiones disponibles"
            )
        
        # For each session, count enrolled students
        sessions_with_count = []
        for session in sessions_response.data:
            enrolled_response = supabase.table("payment_records").select(
                "id", 
                count="exact"
            ).eq("session_id", session["id"]).eq("status", "verified").execute()
            
            session["enrolled_count"] = enrolled_response.count or 0
            session["available_slots"] = session["max_capacity"] - session["enrolled_count"]
            sessions_with_count.append(session)
        
        logger.info(f"Retrieved {len(sessions_with_count)} sessions")
        return sessions_with_count
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sessions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener sesiones: {str(e)}"
        )


@router.get("/payments/check-status")
def check_payment_status(email: str):
    """
    Check payment status by email (for payment page status checker).
    Returns: status, rejection_reason, session info, files count.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    if not email or not "@" in email:
        raise HTTPException(status_code=400, detail="Email inválido")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Find latest payment record for this email
        payment_response = supabase.table("payment_records").select(
            "*"
        ).eq("institutional_email", email).order("created_at", desc=True).limit(1).execute()
        
        if not payment_response.data:
            # No payment found - return "no payment" status
            return {
                "status": "no_payment",
                "rejection_reason": None,
                "session_id": None,
                "session_day": None,
                "session_time": None,
                "files_count": 0
            }
        
        payment = payment_response.data[0]
        
        # Count files
        files_response = supabase.table("payment_files").select(
            "id",
            count="exact"
        ).eq("payment_record_id", payment["id"]).execute()
        
        files_count = files_response.count or 0
        
        # If payment has session, get session details
        session_day = None
        session_time = None
        if payment.get("session_id"):
            session_response = supabase.table("course_sessions").select(
                "day_of_week, start_time, end_time"
            ).eq("id", payment["session_id"]).limit(1).execute()
            
            if session_response.data:
                session = session_response.data[0]
                session_day = session["day_of_week"]
                session_time = f"{session['start_time']} - {session['end_time']}"
        
        return {
            "status": payment["status"],
            "rejection_reason": payment.get("rejection_reason"),
            "session_id": payment.get("session_id"),
            "session_day": session_day,
            "session_time": session_time,
            "files_count": files_count
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al verificar estatus: {str(e)}"
        )


@router.post("/payments/select-session")
def select_session(email: str, session_id: str):
    """
    Student selects a course session (before uploading payment proof).
    Updates payment_records with session_id and session_choice_at timestamp.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(status_code=500, detail="Supabase no configurado")
    
    if not email or not session_id:
        raise HTTPException(status_code=400, detail="Email y session_id requeridos")
    
    try:
        options = ClientOptions(persist_session=False)
        supabase = create_client(settings.supabase_url, settings.supabase_key, options=options)
        
        # Verify session exists
        session_response = supabase.table("course_sessions").select(
            "id"
        ).eq("id", session_id).limit(1).execute()
        
        if not session_response.data:
            raise HTTPException(status_code=404, detail="Sesión no encontrada")
        
        # Find or create payment record for this email
        payment_response = supabase.table("payment_records").select(
            "id"
        ).eq("institutional_email", email).eq("status", "draft").limit(1).execute()
        
        if payment_response.data:
            # Update existing draft record
            payment_id = payment_response.data[0]["id"]
            update_response = supabase.table("payment_records").update({
                "session_id": session_id,
                "session_choice_at": datetime.utcnow().isoformat()
            }).eq("id", payment_id).execute()
            
            logger.info(f"Session selected for existing payment: {payment_id}")
        else:
            # Create new draft payment record with session selected
            # First get pre_registration_id
            pre_reg = supabase.table("pre_registrations").select(
                "id"
            ).eq("institutional_email", email).limit(1).execute()
            
            if not pre_reg.data:
                raise HTTPException(
                    status_code=404,
                    detail="Email no registrado en pre-registro"
                )
            
            pre_registration_id = pre_reg.data[0]["id"]
            
            create_response = supabase.table("payment_records").insert({
                "pre_registration_id": pre_registration_id,
                "institutional_email": email,
                "payment_method": "bank_reference",
                "status": "draft",
                "session_id": session_id,
                "session_choice_at": datetime.utcnow().isoformat()
            }).execute()
            
            if not create_response.data:
                raise HTTPException(
                    status_code=500,
                    detail="Error creating payment record"
                )
            
            logger.info(f"Session selected with new payment record created: {create_response.data[0]['id']}")
        
        return {
            "success": True,
            "message": "Sesión seleccionada correctamente"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error selecting session: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al seleccionar sesión: {str(e)}"
        )
