from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemCreate(BaseModel):
    title: str
    description: str
    category_id: int
    location_found: str
    found_at: datetime
    submitted_by: Optional[int] = None

class ItemResponse(BaseModel):
    item_id: int
    title: str
    description: str
    location_found: str
    found_at: datetime
    status: str
    registered_at: datetime