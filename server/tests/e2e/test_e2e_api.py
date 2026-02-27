import asyncio
import pytest
import httpx

from bobscorn.main import app


@pytest.mark.anyio
async def test_buy_returns_429_when_concurrency_exceeded():
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        task1 = asyncio.create_task(client.post("/buy", json={"name": "corn", "quantity": 1}))
        await asyncio.sleep(0.05)
        task2 = asyncio.create_task(client.post("/buy", json={"name": "corn", "quantity": 1}))
        r1, r2 = await asyncio.gather(task1, task2)
        statuses = sorted([r1.status_code, r2.status_code])
        assert statuses == [200, 429]
        limited = r1 if r1.status_code == 429 else r2
        assert "Too Many Requests" in limited.text