from fastapi import APIRouter, Depends, HTTPException
from app.auth.deps import get_current_user_id
from app.registrations.schemas import PreRegistrationOut, PreRegistrationIn
from app.registrations.academic_schemas import AcademicRegistrationIn, AcademicRegistrationOut
from app.storage.repository import get_repository
from app.config import get_settings
from app.supabase_clients import (
    get_main_supabase_client,
    insert_prereg_rest_record,
    get_prereg_rest_record_by_email,
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/pre-register", response_model=PreRegistrationOut)
def pre_register(user_id: str = Depends(get_current_user_id)) -> PreRegistrationOut:
    repo = get_repository()
    pre = repo.create_pre_registration(user_id)
    return PreRegistrationOut(id=pre.id, user_id=pre.user_id, status=pre.status, created_at=pre.created_at)


@router.get("/status", response_model=PreRegistrationOut)
def status(user_id: str = Depends(get_current_user_id)) -> PreRegistrationOut:
    repo = get_repository()
    pre = repo.get_pre_registration_by_user(user_id)
    if not pre:
        pre = repo.create_pre_registration(user_id)
    return PreRegistrationOut(id=pre.id, user_id=pre.user_id, status=pre.status, created_at=pre.created_at)


@router.post("/pre-registro", response_model=PreRegistrationOut, status_code=201)
def create_pre_registro(data: PreRegistrationIn) -> PreRegistrationOut:
    """
    Endpoint publico para el pre-registro del curso de ingles tecnico.
    No requiere autenticación.
    Guarda los datos en Supabase.
    """
    settings = get_settings()
    
    if not settings.prereg_supabase_url or not settings.prereg_supabase_key:
        logger.error("Supabase de pre-registro no esta configurado")
        raise HTTPException(
            status_code=500,
            detail="El servidor no está configurado para guardar registros en este momento"
        )
    
    try:
        # Preparar datos para Supabase
        registration_data = {
            "full_name": data.full_name,
            "student_code": data.student_code,
            "institutional_email": data.institutional_email,
            "personal_email": data.personal_email,
            "phone_whatsapp": data.phone_whatsapp,
            "career": data.career,
            "semester": data.semester,
            "technical_background": data.technical_background,
            "english_level": data.english_level,
            "english_exposure": data.english_exposure,
            "speaking_confidence": data.speaking_confidence,
            "learning_goal": data.learning_goal,
            "has_laptop": data.has_laptop,
            "preferred_days": data.preferred_days,
            "preferred_schedule": data.preferred_schedule,
            "motivation": data.motivation,
            "attendance_commitment": data.attendance_commitment,
            "payment_option": data.payment_option,
            "scholarship_reason": data.scholarship_reason if data.payment_option == "scholarship" else None
        }
        
        inserted_data = insert_prereg_rest_record(registration_data)
        logger.info(f"Pre-registration created: {inserted_data.get('id')}")
        
        return PreRegistrationOut(
            id=inserted_data.get("id"),
            user_id=None,
            status=None,
            created_at=None,
            full_name=inserted_data.get("full_name"),
            student_code=inserted_data.get("student_code"),
            institutional_email=inserted_data.get("institutional_email")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en pre-registro: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el pre-registro: {str(e)}"
        )


@router.post("/academic-registro", response_model=AcademicRegistrationOut, status_code=201)
def create_academic_registro(data: AcademicRegistrationIn) -> AcademicRegistrationOut:
    """
    Endpoint público para el registro de académicos CUGDL.
    No requiere autenticación.
    Guarda los datos en Supabase.
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        logger.error("Supabase no está configurado")
        raise HTTPException(
            status_code=500,
            detail="El servidor no está configurado para guardar registros en este momento"
        )
    
    try:
        supabase = get_main_supabase_client()
        
        # Preparar datos para Supabase
        registration_data = {
            "full_name": data.full_name,
            "personnel_type": data.personnel_type,
            "department": data.department,
            "email": data.email,
            "phone_extension": data.phone_extension,
            "shirt_size": data.shirt_size,
            "course_interest": data.course_interest,
            "preferred_schedule": data.preferred_schedule if data.course_interest else None
        }
        
        # Insertar en Supabase
        response = supabase.table("academic_registrations").insert(registration_data).execute()
        
        if not response.data:
            logger.error(f"Error inserting into Supabase: {response}")
            raise HTTPException(
                status_code=500,
                detail="Error al guardar el registro"
            )
        
        inserted_data = response.data[0]
        logger.info(f"Academic registration created: {inserted_data.get('id')}")
        
        return AcademicRegistrationOut(
            id=inserted_data.get("id"),
            full_name=inserted_data.get("full_name"),
            email=inserted_data.get("email"),
            personnel_type=inserted_data.get("personnel_type"),
            created_at=inserted_data.get("created_at")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en registro académico: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el registro académico: {str(e)}"
        )


@router.get("/pre-registro-by-email")
def get_pre_registro_by_email(email: str):
    """
    Obtener pre-registro por correo electrónico para verificación de beca.
    """
    settings = get_settings()
    
    if not settings.prereg_supabase_url or not settings.prereg_supabase_key:
        raise HTTPException(
            status_code=500,
            detail="Supabase de pre-registro no esta configurado"
        )
    
    try:
        record = get_prereg_rest_record_by_email(email)

        if not record:
            raise HTTPException(
                status_code=404,
                detail="No se encontró registro con ese correo"
            )
        
        return record
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener pre-registro por email: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la solicitud: {str(e)}"
        )


@router.post("/scholarship-enrollment")
def scholarship_enrollment(data: dict):
    """
    Confirmar inscripción con beca 100%.
    Requiere: email, selected_schedule, commitment_confirmed
    """
    settings = get_settings()
    
    if not settings.supabase_url or not settings.supabase_key:
        raise HTTPException(
            status_code=500,
            detail="Supabase no está configurado"
        )
    
    try:
        email = data.get("email")
        selected_schedule = data.get("selected_schedule")
        commitment = data.get("commitment_confirmed")
        
        if not email or not selected_schedule:
            raise HTTPException(
                status_code=400,
                detail="Email y horario son requeridos"
            )
        
        if not commitment:
            raise HTTPException(
                status_code=400,
                detail="Debes confirmar el compromiso de asistencia"
            )
        
        supabase = get_main_supabase_client()
        
        # Crear registro de beca confirmada en tabla scholarship_enrollments
        enrollment_data = {
            "email": email,
            "selected_schedule": selected_schedule,
            "commitment_confirmed": commitment,
            "status": "approved"
        }
        
        response = supabase.table("scholarship_enrollments").insert(enrollment_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Error al confirmar la beca"
            )
        
        return {
            "status": "success",
            "message": "Beca confirmada exitosamente",
            "data": response.data[0]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en confirmación de beca: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la solicitud: {str(e)}"
        )
