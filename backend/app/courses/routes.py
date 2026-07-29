from fastapi import APIRouter

from app.courses.data import COURSE_INFO, SYLLABUS

router = APIRouter()


@router.get("/overview")
def overview() -> dict:
    return COURSE_INFO


@router.get("/syllabus")
def syllabus() -> dict:
    return {"course": COURSE_INFO, "modules": SYLLABUS}

