from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AcademicRegistrationIn(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    personnel_type: str = Field(..., pattern="^(academic|administrative|directive)$")
    department: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone_extension: Optional[str] = Field(None, max_length=50)
    shirt_size: str = Field(..., pattern="^(S|M|L|XL|XXL)$")
    course_interest: bool = False
    preferred_schedule: Optional[str] = Field(None, pattern="^(tuesday|saturday|both)$")


class AcademicRegistrationOut(BaseModel):
    id: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    personnel_type: Optional[str] = None
    created_at: Optional[str] = None
