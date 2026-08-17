from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User, DashboardStat, LearningProgress, Activity
from app.schemas.auth import DashboardResponse
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Connects to the frontend fetch('http://localhost:8000/api/dashboard')
    stats = db.query(DashboardStat).filter(DashboardStat.user_id == current_user.id).first()
    progress = db.query(LearningProgress).filter(LearningProgress.user_id == current_user.id).all()
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    
    return {
        "stats": stats,
        "progress": progress,
        "activities": activities
    }
