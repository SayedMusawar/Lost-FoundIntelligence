from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import execute_query

router = APIRouter(prefix="/receipts", tags=["Receipts"])


class ReceiptCreate(BaseModel):
    claim_id: int
    issued_by: int
    receiver_name: str
    receiver_phone: str
    condition_at_handover: Optional[str] = None
    notes: Optional[str] = None


@router.post("/", status_code=201)
def create_receipt(data: ReceiptCreate):
    claim = execute_query(
        "SELECT * FROM claim_request WHERE claim_id = %s",
        params=(data.claim_id,),
        fetch="one",
    )
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim["status"] != "approved":
        raise HTTPException(
            status_code=400, detail="Can only issue receipt for approved claims"
        )

    existing = execute_query(
        "SELECT * FROM receipt WHERE claim_id = %s",
        params=(data.claim_id,),
        fetch="one",
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="Receipt already issued for this claim"
        )

    execute_query(
        """
        INSERT INTO receipt
          (claim_id, issued_to, issued_by, receiver_name,
           receiver_phone, condition_at_handover, notes, issued_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
        """,
        params=(
            data.claim_id,
            claim["claimant_id"],
            data.issued_by,
            data.receiver_name,
            data.receiver_phone,
            data.condition_at_handover,
            data.notes,
        ),
    )
    return {"message": "Receipt issued successfully"}


@router.get("/{claim_id}")
def get_receipt(claim_id: int):
    row = execute_query(
        """
        SELECT r.receipt_id, r.issued_at, r.receiver_name,
               r.receiver_phone, r.condition_at_handover, r.notes,
               i.title, i.description, i.location_found, i.found_at,
               u.name AS issued_by_name,
               u2.name AS claimant_name, u2.email AS claimant_email,
               u2.roll_number
        FROM receipt r
        JOIN claim_request cr ON r.claim_id = cr.claim_id
        JOIN item i ON cr.item_id = i.item_id
        JOIN "USER" u ON r.issued_by = u.user_id
        JOIN "USER" u2 ON r.issued_to = u2.user_id
        WHERE r.claim_id = %s
        """,
        params=(claim_id,),
        fetch="one",
    )
    if not row:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return row
