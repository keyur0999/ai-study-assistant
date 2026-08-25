from fastapi import APIRouter

router = APIRouter(
    prefix="/api/quiz",
    tags=["Quiz"]
)


@router.post("/generate")
def generate_quiz():
    return {
        "message": "Quiz generation endpoint is working"
    }


@router.get("/{quiz_id}")
def get_quiz(quiz_id: int):
    return {
        "message": "Quiz endpoint is working",
        "quiz_id": quiz_id
    }


@router.post("/{quiz_id}/submit")
def submit_quiz(quiz_id: int):
    return {
        "message": "Quiz submission endpoint is working",
        "quiz_id": quiz_id
    }
