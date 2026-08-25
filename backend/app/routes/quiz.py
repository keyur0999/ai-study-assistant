from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field


# ============================================================
# Router Configuration
# ============================================================

router = APIRouter(
    prefix="/api/quiz",
    tags=["Quiz"]
)


# ============================================================
# Request Schemas
# ============================================================

class QuizGenerationRequest(BaseModel):
    """
    Data required to generate a quiz.
    """

    document_id: str

    number_of_questions: int = Field(
        default=5,
        ge=1,
        le=20
    )

    difficulty: str = Field(
        default="medium"
    )


class QuizSubmissionRequest(BaseModel):
    """
    Student's submitted answers.
    """

    answers: dict[str, str]


# ============================================================
# Temporary Quiz Storage
# ============================================================

quizzes = []


# ============================================================
# Generate Quiz
# ============================================================

@router.post(
    "/generate",
    status_code=status.HTTP_201_CREATED
)
async def generate_quiz(
    request: QuizGenerationRequest
):
    """
    Generate a quiz from a study document.

    Current version:
    - Validates the request
    - Returns a temporary response

    Later:
    - Authenticate user
    - Retrieve document
    - Retrieve relevant content
    - Send content to LLM
    - Generate questions
    - Store quiz in PostgreSQL
    """

    # --------------------------------------------------------
    # Validate difficulty
    # --------------------------------------------------------

    allowed_difficulties = {
        "easy",
        "medium",
        "hard"
    }

    if request.difficulty.lower() not in allowed_difficulties:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Difficulty must be easy, medium, or hard."
            )
        )


    # --------------------------------------------------------
    # Temporary response
    # --------------------------------------------------------

    return {
        "message": "Quiz generation endpoint is working.",
        "document_id": request.document_id,
        "number_of_questions": request.number_of_questions,
        "difficulty": request.difficulty
    }


# ============================================================
# Get Quiz
# ============================================================

@router.get("/{quiz_id}")
async def get_quiz(
    quiz_id: str
):
    """
    Return a quiz using its ID.

    Later this will retrieve the quiz from PostgreSQL.
    """

    for quiz in quizzes:

        if quiz["id"] == quiz_id:

            return {
                "quiz": quiz
            }


    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Quiz not found."
    )


# ============================================================
# Submit Quiz
# ============================================================

@router.post("/{quiz_id}/submit")
async def submit_quiz(
    quiz_id: str,
    request: QuizSubmissionRequest
):
    """
    Submit answers for a quiz.

    Later this will:
    1. Find the quiz.
    2. Check the submitted answers.
    3. Calculate the score.
    4. Store the result.
    5. Identify weak topics.
    """

    # --------------------------------------------------------
    # Check whether quiz exists
    # --------------------------------------------------------

    quiz_exists = False

    for quiz in quizzes:

        if quiz["id"] == quiz_id:
            quiz_exists = True
            break


    if not quiz_exists:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found."
        )


    # --------------------------------------------------------
    # Temporary response
    # --------------------------------------------------------

    return {
        "message": "Quiz submission received.",
        "quiz_id": quiz_id,
        "answers": request.answers
    }
