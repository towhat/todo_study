import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, get_db
from .models import Task
from .schemas import TaskCreate, TaskUpdate, TaskOut

app = FastAPI(title="Todo Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.post("/tasks", response_model=dict)
async def create_task(payload: TaskCreate, db: AsyncSession = Depends(get_db)):
    new_task = Task(task=payload.task, priority=payload.priority)
    try:
        db.add(new_task)
        await db.flush()
        await db.commit()
        await db.refresh(new_task)
        msg = f"{new_task.id}, {new_task.task}, {new_task.priority}, {new_task.created_time} 추가 완료"
        return {"message": msg, "task": TaskOut.from_orm(new_task)}
    except SQLAlchemyError:
        await db.rollback()
        return {"message": "실패"}

@app.put("/tasks/{task_id}", response_model=dict)
async def update_task(task_id: int, payload: TaskUpdate, db: AsyncSession = Depends(get_db)):
    try:
        q = await db.execute(select(Task).where(Task.id == task_id))
        task = q.scalars().first()
        if not task:
            raise HTTPException(status_code=404, detail="Not found")
        task.done = payload.done
        db.add(task)
        await db.commit()
        await db.refresh(task)
        msg = f"{task.id}, {task.task}, {task.done}, {task.update_time} 갱신 완료"
        return {"message": msg, "task": TaskOut.from_orm(task)}
    except SQLAlchemyError:
        await db.rollback()
        return {"message": "실패"}

@app.get("/tasks", response_model=list[TaskOut])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(Task).order_by(Task.priority.desc(), Task.created_time.asc()))
    tasks = q.scalars().all()
    return tasks

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
