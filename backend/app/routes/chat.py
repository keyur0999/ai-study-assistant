from fastapi import APIRouter

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


@router.post("/")
def send_message():
    return {
        "message": "Chat endpoint is working"
    }


@router.get("/conversations")
def get_conversations():
    return {
        "message": "Conversations endpoint is working"
    }


@router.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: int):
    return {
        "message": "Conversation endpoint is working",
        "conversation_id": conversation_id
    }


@router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int):
    return {
        "message": "Conversation deleted successfully",
        "conversation_id": conversation_id
    }
