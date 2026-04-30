from fastapi import APIRouter, HTTPException
from models.item import ItemCreate
from database import execute_query

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/categories")
def get_categories():
    rows = execute_query(
        "SELECT category_id, cat_name FROM category ORDER BY cat_name", fetch="all"
    )
    return rows if rows else []


@router.get("/search")
def search_items(keyword: str = "", category_id: int = None, location: str = ""):
    query = """
        SELECT i.item_id, i.title, i.description, i.location_found,
               i.found_at, i.status, i.registered_at,
               c.cat_name AS category
        FROM item i
        LEFT JOIN category c ON i.category_id = c.category_id
        WHERE i.is_public = TRUE AND i.status = 'found'
    """
    params = []

    if keyword:
        query += " AND (i.title ILIKE %s OR i.description ILIKE %s)"
        params.extend([f"%{keyword}%", f"%{keyword}%"])

    if category_id:
        query += " AND i.category_id = %s"
        params.append(category_id)

    if location:
        query += " AND i.location_found ILIKE %s"
        params.append(f"%{location}%")

    query += " ORDER BY i.registered_at DESC"

    rows = execute_query(query, params=tuple(params) if params else None, fetch="all")
    return rows if rows else []


@router.get("/")
def get_public_items():
    rows = execute_query(
        """
        SELECT i.item_id, i.title, i.description, i.location_found,
               i.found_at, i.status, i.registered_at,
               c.cat_name AS category
        FROM item i
        LEFT JOIN category c ON i.category_id = c.category_id
        WHERE i.is_public = TRUE AND i.status = 'found'
        ORDER BY i.registered_at DESC
        """,
        fetch="all",
    )
    return rows if rows else []


@router.get("/{item_id}")
def get_item(item_id: int):
    row = execute_query(
        "SELECT * FROM item WHERE item_id = %s", params=(item_id,), fetch="one"
    )
    if not row:
        raise HTTPException(status_code=404, detail="Item not found")
    return row


@router.post("/", status_code=201)
def register_item(item: ItemCreate):
    execute_query(
        """
        INSERT INTO item
          (title, description, category_id, location_found,
           found_at, status, is_public, submitted_by, registered_at)
        VALUES (%s, %s, %s, %s, %s, 'found', TRUE, %s, NOW())
        """,
        params=(
            item.title,
            item.description,
            item.category_id,
            item.location_found,
            item.found_at,
            item.submitted_by,
        ),
    )
    return {"message": "Item registered successfully"}
