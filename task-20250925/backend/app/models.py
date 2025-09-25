from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task = Column(String, nullable=False)
    priority = Column(Integer, nullable=False)
    created_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    done = Column(Boolean, default=False, nullable=False)
    update_time = Column(DateTime(timezone=True), onupdate=func.now())
