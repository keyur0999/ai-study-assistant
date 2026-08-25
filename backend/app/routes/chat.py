from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field


# ============================================================
# Router Configuration
# ============================================================

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


# ============================================================
# Request Schemas
# ============================================================

class ChatRequest(BaseModel):
    """
    Data received when the user sends a message.
    """

    message: str = Field(
        ...,
        min_length=1,
        max_length=5000
    )

    document_id: str | None = None

    conversation_id: str | None = None


# ============================================================
# Response Schema
# ============================================================

class ChatResponse(BaseModel):
    """
    Response returned by the chat API.
    """

    answer: str

    conversation_id: str | None = None

    sources: list[str] = []


# ============================================================
# Temporary Conversations
# ============================================================

conversations = []


# ============================================================
# Send Chat Message
# ============================================================

@router.post(
    "/",
    response_model=ChatResponse
)
async def send_message(
    request: ChatRequest
):
    """
    Receive a student's question.

    Current version:
    - Receives the message
    - Returns a temporary response

    Later:
    - Authenticate user
    - Find user's document
    - Search ChromaDB
    - Retrieve relevant chunks
    - Send context to the LLM
    - Generate an answer
    - Save conversation history
    """

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    message = request.message.strip()

    if not message:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )


    # --------------------------------------------------------
    # Temporary response
    # --------------------------------------------------------
    #
    # This is NOT the final AI response.
    #
    # Later this will come from:
    #
    # chat_service.py
    #       ↓
    # rag_service.py
    #       ↓
    # ChromaDB
    #       ↓
    # LLM
    #

    answer = (
        "The AI study assistant is not connected yet. "
        "Your message was received successfully."
    )


    return ChatResponse(
        answer=answer,
        conversation_id=request.conversation_id,
        sources=[]
    )


# ============================================================
# Get Conversations
# ============================================================

@router.get("/conversations")
async def get_conversations():
    """
    Return the user's conversations.

    This will later retrieve data from PostgreSQL.
    """

    return {
        "conversations": conversations
    }


# ============================================================
# Get One Conversation
# ============================================================

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str
):
    """
    Return a specific conversation.
    """

    for conversation in conversations:

        if conversation["id"] == conversation_id:

            return {
                "conversation": conversation
            }


    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Conversation not found."
    )


# ============================================================
# Delete Conversation
# ============================================================

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str
):
    """
    Delete a conversation.

    Later this will delete the conversation
    from PostgreSQL.
    """

    for conversation in conversations:

        if conversation["id"] == conversation_id:

            conversations.remove(conversation)

            return {
                "message": "Conversation deleted successfully."
            }


    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Conversation not found."
    )
