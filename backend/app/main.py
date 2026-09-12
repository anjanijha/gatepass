from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal, get_db
from . import models
from .schemas import UserCreate, FlatCreate, VisitorCreate,LoginRequest

from .auth import hash_password, verify_password, create_access_token, get_current_user, require_role



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Society Gate API",
    description="Backend API for Society Gate visitor approval system",
    version="1.0.0",
)



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


# -----------------------------
# USER API
# -----------------------------

@app.post("/users")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(models.User)
        .filter(models.User.mobile == user.mobile)
        .first()
    )

    if existing_user:
        return {
            "message": "User already exists"
        }

    new_user = models.User(
        name=user.name,
        mobile=user.mobile,
        password_hash=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created",
        "user_id": new_user.id
    }


# -----------------------------
# FLAT API
# -----------------------------

@app.post("/flats")
def create_flat(
    flat: FlatCreate,
    db: Session = Depends(get_db)
):
    new_flat = models.Flat(
        flat_number=flat.flat_number,
        resident_id=flat.resident_id
    )

    db.add(new_flat)
    db.commit()
    db.refresh(new_flat)

    return {
        "message": "Flat created",
        "flat_id": new_flat.id
    }


# -----------------------------
# VISITOR API
# -----------------------------


@app.post("/visitors")
def create_visitor(
    visitor: VisitorCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("GUARD")
    )
):
    new_visitor = models.VisitorRequest(
        visitor_name=visitor.visitor_name,
        visitor_mobile=visitor.visitor_mobile,
        purpose=visitor.purpose,
        flat_id=visitor.flat_id,
        status="PENDING"
    )

    db.add(new_visitor)
    db.commit()
    db.refresh(new_visitor)

    return {
        "message": "Visitor request created",
        "visitor_id": new_visitor.id,
        "status": new_visitor.status
    }


# -----------------------------
# GET VISITORS FOR A FLAT
# -----------------------------

@app.get("/visitors/flat/{flat_id}")
def get_visitors(
    flat_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    visitors = (
        db.query(models.VisitorRequest)
        .filter(
            models.VisitorRequest.flat_id == flat_id
        )
        .all()
    )

    return visitors


# -----------------------------
# APPROVE VISITOR
# -----------------------------

@app.put("/visitors/{visitor_id}/approve")
def approve_visitor(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("RESIDENT")
    )
):
    visitor = (
        db.query(models.VisitorRequest)
        .filter(
            models.VisitorRequest.id == visitor_id
        )
        .first()
    )

    if not visitor:
        return {
            "message": "Visitor not found"
        }

    visitor.status = "APPROVED"

    db.commit()
    db.refresh(visitor)

    return {
        "message": "Visitor approved",
        "visitor_id": visitor.id,
        "status": visitor.status
    }


# -----------------------------
# DECLINE VISITOR
# -----------------------------

@app.put("/visitors/{visitor_id}/decline")
def decline_visitor(
    visitor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("RESIDENT")
    )
):
    visitor = (
        db.query(models.VisitorRequest)
        .filter(
            models.VisitorRequest.id == visitor_id
        )
        .first()
    )

    if not visitor:
        return {
            "message": "Visitor not found"
        }

    visitor.status = "DECLINED"

    db.commit()
    db.refresh(visitor)

    return {
        "message": "Visitor declined",
        "visitor_id": visitor.id,
        "status": visitor.status
    }


# -----------------------------
# Create Login API
# -----------------------------

@app.post("/auth/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(models.User)
        .filter(
            models.User.mobile == login_data.mobile
        )
        .first()
    )

    if not user:
        return {
            "message": "Invalid mobile or password"
        }

    if not user.password_hash:
        return {
            "message": "User password is not configured"
        }

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        return {
            "message": "Invalid mobile or password"
        }

    access_token = create_access_token(
        user_id=user.id,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }