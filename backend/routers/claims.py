# claims.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import execute_query

router = APIRouter(prefix="/claims", tags=["Claims"])


class ClaimCreate(BaseModel):
    item_id: int
    claimant_id: int
    claim_description: str


@router.post("/", status_code=201)
def submit_claim(claim: ClaimCreate):
    item = execute_query(
        "SELECT * FROM item WHERE item_id = %s", params=(claim.item_id,), fetch="one"
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item["status"] != "found":
        raise HTTPException(
            status_code=400, detail="Item is no longer available for claiming"
        )

    existing = execute_query(
        "SELECT * FROM claim_request WHERE item_id = %s AND claimant_id = %s",
        params=(claim.item_id, claim.claimant_id),
        fetch="one",
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="You have already submitted a claim for this item"
        )

    execute_query(
        """
        INSERT INTO claim_request
          (item_id, claimant_id, claim_description, status, submitted_at)
        VALUES (%s, %s, %s, 'pending', NOW())
        """,
        params=(claim.item_id, claim.claimant_id, claim.claim_description),
    )
    return {"message": "Claim submitted successfully"}


@router.get("/my/{user_id}")
def get_my_claims(user_id: int):
    rows = execute_query(
        """
        SELECT cr.claim_id, cr.status, cr.submitted_at, cr.claim_description,
               i.title, i.location_found
        FROM claim_request cr
        JOIN item i ON cr.item_id = i.item_id
        WHERE cr.claimant_id = %s
        ORDER BY cr.submitted_at DESC
        """,
        params=(user_id,),
        fetch="all",
    )
    return rows if rows else []


@router.get("/pending")
def get_pending_claims():
    rows = execute_query(
        """
        SELECT cr.claim_id, cr.claim_description, cr.submitted_at,
               cr.status, i.title, i.location_found,
               u.name AS claimant_name, u.email AS claimant_email,
               u.roll_number, cr.item_id, cr.claimant_id
        FROM claim_request cr
        JOIN item i ON cr.item_id = i.item_id
        JOIN "USER" u ON cr.claimant_id = u.user_id
        WHERE cr.status = 'pending'
        ORDER BY cr.submitted_at ASC
        """,
        fetch="all",
    )
    return rows if rows else []


@router.get("/approved")
def get_approved_no_receipt():
    rows = execute_query(
        """
        SELECT cr.claim_id, cr.claimant_id, cr.item_id,
               cr.claim_description, cr.reviewed_at,
               i.title, i.location_found,
               u.name AS claimant_name, u.email AS claimant_email,
               u.roll_number
        FROM claim_request cr
        JOIN item i ON cr.item_id = i.item_id
        JOIN "USER" u ON cr.claimant_id = u.user_id
        LEFT JOIN receipt r ON cr.claim_id = r.claim_id
        WHERE cr.status = 'approved' AND r.receipt_id IS NULL
        ORDER BY cr.reviewed_at DESC
        """,
        fetch="all",
    )
    return rows if rows else []


@router.patch("/{claim_id}/review")
def review_claim(claim_id: int, action: str, reviewed_by: int):
    if action not in ("approved", "rejected"):
        raise HTTPException(
            status_code=400, detail="Action must be 'approved' or 'rejected'"
        )

    claim = execute_query(
        "SELECT * FROM claim_request WHERE claim_id = %s",
        params=(claim_id,),
        fetch="one",
    )
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    execute_query(
        """
        UPDATE claim_request
        SET status = %s, reviewed_at = NOW(), reviewed_by = %s
        WHERE claim_id = %s
        """,
        params=(action, reviewed_by, claim_id),
    )

    if action == "approved":
        execute_query(
            "UPDATE item SET status = 'claimed' WHERE item_id = %s",
            params=(claim["item_id"],),
        )

    item = execute_query(
        "SELECT title FROM item WHERE item_id = %s",
        params=(claim["item_id"],),
        fetch="one",
    )
    item_title = item["title"] if item else "your item"

    if action == "approved":
        message = f"✅ Your claim for '{item_title}' has been approved! Please visit Student Affairs to collect it."
    else:
        message = f"❌ Your claim for '{item_title}' was not approved. Contact Student Affairs for more info."

    execute_query(
        """
        INSERT INTO notification (user_id, message, is_read, related_claim_id)
        VALUES (%s, %s, FALSE, %s)
        """,
        params=(claim["claimant_id"], message, claim_id),
    )

    return {"message": f"Claim {action} successfully"}
