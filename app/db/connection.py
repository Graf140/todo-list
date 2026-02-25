import asyncpg
from app.db.settings import settings

db_pool = None

async def create_pool():
    global db_pool

    db_pool = await asyncpg.create_pool(
        dsn=settings.DATABASE_URL,
        min_size= 10,
        max_size= 50
    )


async def close_pool():
    global db_pool
    if db_pool:
        await db_pool.close()


async def get_db():
    async with db_pool.acquire() as connection:
        yield connection