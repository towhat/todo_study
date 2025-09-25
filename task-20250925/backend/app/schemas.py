from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    task: str = Field(..., min_length=1)
    priority: int = Field(..., ge=0, le=5)

class TaskUpdate(BaseModel):
    done: bool

class TaskOut(BaseModel):
    id: int
    task: str
    priority: int
    created_time: datetime
    done: bool
    update_time: Optional[datetime] = None

    class Config:
        orm_mode = True
