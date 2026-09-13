from fastapi import FastAPI, Depends
from app.db.base import Base
from app.db.session import engine, SessionLocal, get_db
from app.models.user import User

from app.core.dependencies import get_current_user, require_role 
from app.api.routes import auth,users,flats,visitors

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Society Gate API",
    description="Backend API for Society Gate visitor approval system",
    version="1.0.0",
)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(flats.router)
app.include_router(visitors.router)


@app.get("/admin/test")
def admin_test(
    current_user: User = Depends(
        require_role("ADMIN")
    ),
):
    return {
        "message": "Admin access granted",
        "user_id": current_user.id,
    }


# -----------------------------
# Basic APIs
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "Society Gate API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "UP"
    }

