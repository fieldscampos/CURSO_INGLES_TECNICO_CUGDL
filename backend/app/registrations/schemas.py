from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class PreRegistrationIn(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    student_code: str = Field(..., min_length=1, max_length=50)
    institutional_email: EmailStr
    personal_email: Optional[EmailStr] = None
    phone_whatsapp: Optional[str] = Field(None, max_length=20)
    career: str = Field(..., min_length=1)
    semester: str = Field(..., min_length=1)
    programming_level: str = Field(..., min_length=1)
    python_experience: bool = False
    operating_system: str = Field(..., min_length=1)
    has_laptop: bool = False
    preferred_days: str = Field(..., pattern="^(weekdays|weekend|both)$")
    preferred_schedule: str = Field(..., pattern="^(afternoon|evening|both)$")
    motivation: str = Field(..., min_length=1)
    shirt_size: str = Field(..., pattern="^(S|M|L|XL|XXL)$")
    attendance_commitment: bool = True
    payment_option: str = Field(..., pattern="^(payment|scholarship)$")
    scholarship_reason: Optional[str] = None


class PreRegistrationOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[str] = None
    full_name: Optional[str] = None
    student_code: Optional[str] = None
    institutional_email: Optional[str] = None

