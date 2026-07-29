from pydantic import BaseModel, EmailStr, Field


class Question(BaseModel):
    id: int
    text: str
    type: str = "texto_libre"


class AnswerIn(BaseModel):
    question_id: int = Field(ge=1, le=4)
    answer: str = Field(min_length=1, max_length=3000)


class SurveyQuestion(BaseModel):
    key: str
    text: str
    type: str = "texto_libre"
    options: list[str] | None = None


class SurveySubmissionIn(BaseModel):
    institutional_email: EmailStr
    overall_satisfaction: int = Field(ge=1, le=5)
    content_clarity: int = Field(ge=1, le=5)
    teaching_quality: int = Field(ge=1, le=5)
    exercises_usefulness: int = Field(ge=1, le=5)
    pace_balance: int = Field(ge=1, le=5)
    recommendation_likelihood: int = Field(ge=1, le=5)
    liked_most: str = Field(min_length=1, max_length=2000)
    improvement_suggestions: str = Field(min_length=1, max_length=2000)
    proposed_courses: str = Field(min_length=1, max_length=2000)
    proposed_projects: str = Field(min_length=1, max_length=2000)
    wants_organization_participation: bool
    organization_support_areas: str | None = Field(default=None, max_length=1000)
    organization_availability: str | None = Field(default=None, max_length=1000)
    final_comments: str | None = Field(default=None, max_length=2000)
