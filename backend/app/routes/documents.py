from fastapi import APIRouter

router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


@router.get("/")
def get_documents():
    return {
        "message": "Documents endpoint is working"
    }


@router.post("/upload")
def upload_document():
    return {
        "message": "Document upload endpoint is working"
    }


@router.get("/{document_id}")
def get_document(document_id: int):
    return {
        "message": "Document endpoint is working",
        "document_id": document_id
    }


@router.delete("/{document_id}")
def delete_document(document_id: int):
    return {
        "message": "Document deleted successfully",
        "document_id": document_id
    }
