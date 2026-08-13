from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

import models, schemas, auth
from database import engine, SessionLocal, get_db

# Create the database tables
models.Base.metadata.create_all(bind=engine)

# Startup logic to seed the database
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == "student@example.com").first()
    if not user:
        # Seed Demo User
        hashed_pw = auth.get_password_hash("123456")
        new_user = models.User(email="student@example.com", name="Student", hashed_password=hashed_pw)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Seed Dashboard Stats
        stats = models.DashboardStat(
            user_id=new_user.id, study_time_hrs=12.5,
            skills_learning_pct=64, quiz_average_pct=82, current_streak_days=7
        )
        db.add(stats)

        # Seed Progress
        p1 = models.LearningProgress(user_id=new_user.id, course_name="Python", progress_pct=64, current_topic="Functions")
        p2 = models.LearningProgress(user_id=new_user.id, course_name="C++", progress_pct=42, current_topic="Classes")
        db.add_all([p1, p2])

        # Seed Activity
        a1 = models.Activity(user_id=new_user.id, description="Completed Python Quiz — 8/10", is_success=True)
        a2 = models.Activity(user_id=new_user.id, description="Studied C++ Classes", is_success=False)
        db.add_all([a1, a2])

        db.commit()
    db.close()
    yield

app = FastAPI(title="AI Study Assistant API", lifespan=lifespan)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard_data(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    stats = db.query(models.DashboardStat).filter(models.DashboardStat.user_id == current_user.id).first()
    progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == current_user.id).all()
    activities = db.query(models.Activity).filter(models.Activity.user_id == current_user.id).all()
    
    return {
        "stats": stats,
        "progress": progress,
        "activities": activities
    }
