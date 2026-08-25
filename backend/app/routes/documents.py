from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status


# ============================================================
# Router Configuration
# ============================================================

router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


# ============================================================
# Configuration
# ============================================================

UPLOAD_DIRECTORY = Path("uploads")

# Create the uploads folder automatically.
UPLOAD_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True
)

# Maximum PDF size: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024

# Currently, only PDF files are supported.
ALLOWED_CONTENT_TYPE = "application/pdf"


# ============================================================
# Temporary Document Storage
# ============================================================
#
# This is temporary and will later be replaced by PostgreSQL.
#
# PostgreSQL will eventually store information such as:
#
# - document ID
# - user ID
# - original filename
# - file path
# - upload date
# - processing status
#
# ============================================================

documents = []


# ============================================================
# Upload Document
# ============================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)
async def upload_document(
    file: UploadFile = File(...)
):
    """
    Upload a PDF document.

    Current responsibilities:
    - Validate the uploaded file
    - Check the file type
    - Check the file size
    - Save the PDF
    - Create basic document information

    Later:
    - Authenticate the user
    - Save metadata in PostgreSQL
    - Extract PDF text
    - Split text into chunks
    - Generate embeddings
    - Store embeddings in ChromaDB
    """

    # --------------------------------------------------------
    # Check filename
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file was selected."
        )

    original_filename = file.filename


    # --------------------------------------------------------
    # Check file type
    # --------------------------------------------------------

    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed."
        )


    # --------------------------------------------------------
    # Read uploaded file
    # --------------------------------------------------------

    file_data = await file.read()


    # --------------------------------------------------------
    # Check file size
    # --------------------------------------------------------

    if len(file_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size cannot exceed 10 MB."
        )


    # --------------------------------------------------------
    # Generate unique document ID
    # --------------------------------------------------------

    document_id = str(uuid4())


    # --------------------------------------------------------
    # Create stored filename
    # --------------------------------------------------------

    stored_filename = (
        f"{document_id}_{original_filename}"
    )


    # --------------------------------------------------------
    # Create file path
    # --------------------------------------------------------

    file_path = UPLOAD_DIRECTORY / stored_filename


    # --------------------------------------------------------
    # Save file
    # --------------------------------------------------------

    try:

        with open(file_path, "wb") as saved_file:
            saved_file.write(file_data)

    except OSError:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save the uploaded file."
        )


    # --------------------------------------------------------
    # Create document information
    # --------------------------------------------------------

    document = {
        "id": document_id,
        "filename": original_filename,
        "stored_filename": stored_filename,
        "file_path": str(file_path),
        "content_type": file.content_type,
        "size": len(file_data)
    }


    # Temporary storage
    documents.append(document)


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "message": "Document uploaded successfully.",
        "document": document
    }


# ============================================================
# Get All Documents
# ============================================================

@router.get("/")
async def get_documents():
    """
    Return all uploaded documents.

    Later this will return only documents
    belonging to the logged-in user.
    """

    return {
        "documents": documents,
        "total": len(documents)
    }


# ============================================================
# Get One Document
# ============================================================

@router.get("/{document_id}")
async def get_document(
    document_id: str
):
    """
    Return a single document using its ID.
    """

    for document in documents:

        if document["id"] == document_id:

            return {
                "document": document
            }


    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Document not found."
    )


# ============================================================
# Delete Document
# ============================================================

@router.delete("/{document_id}")
async def delete_document(
    document_id: str
):
    """
    Delete a document.

    Later this will also remove:
    - PostgreSQL metadata
    - ChromaDB embeddings
    """

    document_to_delete = None


    # Find the document
    for document in documents:

        if document["id"] == document_id:
            document_to_delete = document
            break


    # Document doesn't exist
    if document_to_delete is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )


    # --------------------------------------------------------
    # Delete physical file
    # --------------------------------------------------------

    file_path = Path(
        document_to_delete["file_path"]
    )

    try:

        if file_path.exists():
            file_path.unlink()

    except OSError:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete the document file."
        )


    # Remove temporary record
    documents.remove(document_to_delete)


    return {
        "message": "Document deleted successfully.",
        "document_id": document_id
    }
