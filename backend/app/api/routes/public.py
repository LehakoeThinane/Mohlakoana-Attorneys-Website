from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientOut

router = APIRouter(prefix="/api/v1/public", tags=["public"])


@router.post("/contact", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def submit_contact_form(body: ClientCreate, db: Session = Depends(get_db)) -> Client:
    """Public, unauthenticated contact-form endpoint (Phase 2).

    Rate limiting belongs here before this goes live (Phase 6) — this
    endpoint has no auth, so it's the most exposed write path in the system.
    An existing client submitting again just gets their existing record back
    rather than erroring or duplicating.
    """
    existing = db.query(Client).filter(Client.email == body.email).first()
    if existing is not None:
        return existing

    client = Client(email=body.email, full_name=body.full_name, phone=body.phone)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client
