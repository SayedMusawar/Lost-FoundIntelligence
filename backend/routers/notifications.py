from fastapi import APIRouter
from database import execute_query

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/{user_id}")
def get_notifications(user_id: int):
    rows = execute_query(
        """
        SELECT n.notification_id, n.message, n.is_read,
               n.created_at, n.related_claim_id
        FROM notification n
        WHERE n.user_id = %s
        ORDER BY n.created_at DESC
        """,
        params=(user_id,),
        fetch="all",
    )
    return rows if rows else []


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int):
    execute_query(
        "UPDATE notification SET is_read = TRUE WHERE notification_id = %s",
        params=(notification_id,),
    )
    return {"message": "Marked as read"}


@router.patch("/read-all/{user_id}")
def mark_all_read(user_id: int):
    execute_query(
        "UPDATE notification SET is_read = TRUE WHERE user_id = %s", params=(user_id,)
    )
    return {"message": "All marked as read"}
