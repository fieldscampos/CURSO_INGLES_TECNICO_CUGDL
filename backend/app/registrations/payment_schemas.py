from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PaymentMethodEnum(str, Enum):
    BANK_REFERENCE = "bank_reference"
    BANK_TRANSFER = "bank_transfer"


class PaymentStatusEnum(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    COMPLETED = "completed"


class FileTypeEnum(str, Enum):
    SCREENSHOT = "screenshot"
    PDF = "pdf"
    RECEIPT = "receipt"


class DayOfWeekEnum(str, Enum):
    TUESDAY = "tuesday"
    SATURDAY = "saturday"


# ==================== Course Sessions ====================

class CourseSessionOut(BaseModel):
    id: str
    day_of_week: str
    start_time: str
    end_time: str
    max_capacity: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentStatusOut(BaseModel):
    status: str
    rejection_reason: Optional[str] = None
    session_id: Optional[str] = None
    session_day: Optional[str] = None
    session_time: Optional[str] = None
    files_count: int = 0


class SessionSelectionIn(BaseModel):
    email: str = Field(..., description="Institutional email")
    session_id: str = Field(..., description="Course session UUID")


# ==================== Payment Methods ====================

class PaymentMethodDataOut(BaseModel):
    id: str = Field(..., alias="id")
    bank_name: str
    account_holder: str
    account_number: str
    clabe: str
    phone: Optional[str] = None
    reference_pdf_path: Optional[str] = None

    class Config:
        from_attributes = True


# ==================== Payment Files ====================

class PaymentFileOut(BaseModel):
    id: str
    payment_record_id: str
    file_name: str
    file_path: str
    file_type: str
    file_size_kb: Optional[int] = None
    is_primary: bool = False
    uploaded_at: datetime

    class Config:
        from_attributes = True


class PaymentFileIn(BaseModel):
    file_name: str
    file_path: str
    file_type: FileTypeEnum
    file_size_kb: Optional[int] = None
    is_primary: bool = False


# ==================== Payment Records ====================

class PaymentRecordIn(BaseModel):
    institutional_email: EmailStr
    payment_method: PaymentMethodEnum
    files: List[PaymentFileIn] = Field(default_factory=list, description="List of uploaded proof files")

    class Config:
        from_attributes = True


class PaymentRecordOut(BaseModel):
    id: str
    pre_registration_id: str
    institutional_email: str
    payment_method: str
    status: str
    rejection_reason: Optional[str] = None
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None
    session_id: Optional[str] = None
    session_choice_at: Optional[datetime] = None
    files: Optional[List[PaymentFileOut]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaymentRecordUpdate(BaseModel):
    status: PaymentStatusEnum
    rejection_reason: Optional[str] = None
    verified_by: Optional[str] = None


# ==================== Admin Actions ====================

class AdminVerifyPaymentIn(BaseModel):
    verified_by: str = Field(..., description="Admin email or identifier")


class AdminRejectPaymentIn(BaseModel):
    rejection_reason: str = Field(..., min_length=10, description="Reason why payment was rejected")
    verified_by: str = Field(..., description="Admin email or identifier")


# ==================== Admin Login ====================

class AdminLoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400  # 24 hours


class AdminSessionData(BaseModel):
    username: str
    logged_in_at: datetime
