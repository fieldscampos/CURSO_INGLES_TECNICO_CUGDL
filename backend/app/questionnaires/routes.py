from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.deps import get_current_user_id
from app.config import get_settings
from app.questionnaires.schemas import AnswerIn, Question, SurveyQuestion, SurveySubmissionIn
from app.schemas.common import MessageResponse
from app.storage.repository import get_repository

router = APIRouter()

QUESTIONS = [
    Question(id=1, text="Por que tu interes en este curso?"),
    Question(id=2, text="Cual es tu expectativa en este curso?"),
    Question(
        id=3,
        text="Crees necesario que el CUGDL tenga materia de verano en programacion y base de datos?",
    ),
    Question(
        id=4,
        text="Cuales son tus recomendaciones acerca de lo que sucede con las materias y temas en el CUGDL?",
    ),
]

SURVEY_QUESTIONS = [
    SurveyQuestion(
        key="overall_satisfaction",
        text="¿Cómo calificarías tu experiencia general en el curso?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
    SurveyQuestion(
        key="content_clarity",
        text="¿Qué tan claro te pareció el contenido y la explicación del curso?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
    SurveyQuestion(
        key="teaching_quality",
        text="¿Qué tan útil te pareció la forma de enseñar y acompañar el aprendizaje?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
    SurveyQuestion(
        key="exercises_usefulness",
        text="¿Qué tan útiles fueron los ejercicios y prácticas?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
    SurveyQuestion(
        key="pace_balance",
        text="¿Qué tan adecuado fue el ritmo del curso?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
    SurveyQuestion(
        key="recommendation_likelihood",
        text="¿Qué tan probable es que recomiendes el curso a otra persona?",
        type="rating",
        options=["1", "2", "3", "4", "5"],
    ),
]


@router.get("/questions", response_model=list[Question])
def get_questions() -> list[Question]:
    return QUESTIONS


@router.get("/survey/questions", response_model=list[SurveyQuestion])
def get_survey_questions() -> list[SurveyQuestion]:
    return SURVEY_QUESTIONS


@router.post("/responses", response_model=MessageResponse)
def submit_responses(answers: list[AnswerIn], user_id: str = Depends(get_current_user_id)) -> MessageResponse:
    repo = get_repository()
    if len(answers) != len(QUESTIONS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debes responder las 4 preguntas",
        )

    expected = {q.id for q in QUESTIONS}
    received = {a.question_id for a in answers}
    if expected != received:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="IDs de preguntas invalidos o repetidos",
        )

    payload = [
        {"question_id": a.question_id, "answer": a.answer.strip()}
        for a in sorted(answers, key=lambda x: x.question_id)
    ]
    repo.save_questionnaire(user_id=user_id, answers=payload)
    return MessageResponse(message="Respuestas guardadas correctamente")


@router.post("/survey/responses", response_model=MessageResponse)
def submit_survey_responses(payload: SurveySubmissionIn) -> MessageResponse:
    settings = get_settings()
    allowed_suffixes = tuple(f"@{domain}" for domain in settings.email_domains_list)
    email = str(payload.institutional_email).strip().lower()

    if allowed_suffixes and not email.endswith(allowed_suffixes):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Solo se permite correo institucional UDG ({', '.join(allowed_suffixes)})",
        )

    repo = get_repository()
    survey_payload = payload.model_dump()
    survey_payload["institutional_email"] = email

    for key in (
        "liked_most",
        "improvement_suggestions",
        "proposed_courses",
        "proposed_projects",
        "organization_support_areas",
        "organization_availability",
        "final_comments",
    ):
        value = survey_payload.get(key)
        if isinstance(value, str):
            cleaned = value.strip()
            survey_payload[key] = cleaned or None

    if not survey_payload.get("wants_organization_participation"):
        survey_payload["organization_support_areas"] = None
        survey_payload["organization_availability"] = None

    repo.save_course_survey(survey_payload)
    return MessageResponse(message="Encuesta guardada correctamente")


@router.get("/my-responses")
def get_my_responses(user_id: str = Depends(get_current_user_id)) -> dict:
    repo = get_repository()
    return {"answers": repo.get_questionnaire(user_id)}
