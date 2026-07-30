import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_client, get_current_staff
from app.database import get_db
from app.models.client import Client
from app.models.matter import Matter
from app.schemas.matter import MatterCreate, MatterOut, MatterStatusUpdate

router = APIRouter(prefix="/api/v1/matters", tags=["matters"])


@router.post("", response_model=MatterOut, status_code=status.HTTP_201_CREATED)
def create_matter(body: MatterCreate, db: Session = Depends(get_db), _staff=Depends(get_current_staff)) -> Matter:
    if db.get(Client, body.client_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    if db.query(Matter).filter(Matter.reference == body.reference).first() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A matter with this reference already exists")

    matter = Matter(
        client_id=body.client_id,
        staff_id=body.staff_id,
        reference=body.reference,
        title=body.title,
    )
    db.add(matter)
    db.commit()
    db.refresh(matter)
    return matter


@router.get("", response_model=list[MatterOut])
def list_matters(db: Session = Depends(get_db), _staff=Depends(get_current_staff)) -> list[Matter]:
    return db.query(Matter).order_by(Matter.created_at.desc()).all()


@router.patch("/{matter_id}/status", response_model=MatterOut)
def update_matter_status(
    matter_id: uuid.UUID,
    body: MatterStatusUpdate,
    db: Session = Depends(get_db),
    _staff=Depends(get_current_staff),
) -> Matter:
    matter = db.get(Matter, matter_id)
    if matter is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Matter not found")
    matter.status = body.status
    db.commit()
    db.refresh(matter)
    return matter


@router.get("/mine", response_model=list[MatterOut])
def list_my_matters(db: Session = Depends(get_db), client=Depends(get_current_client)) -> list[Matter]:
    return db.query(Matter).filter(Matter.client_id == client.id).order_by(Matter.created_at.desc()).all()
