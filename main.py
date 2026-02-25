import uvicorn
from fastapi import FastAPI
from app.api.users import router as users_router
from app.db.connection import create_pool, close_pool
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_pool()
    yield
    await close_pool()


app = FastAPI(lifespan=lifespan)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
