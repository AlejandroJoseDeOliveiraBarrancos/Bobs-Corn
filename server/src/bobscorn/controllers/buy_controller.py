import asyncio
from fastapi import APIRouter

from bobscorn.dtos.requests import BuyRequest
from bobscorn.dtos.responses import BuyResponse

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/buy", response_model=BuyResponse, status_code=200)
async def buy(payload: BuyRequest):
    await asyncio.sleep(0.2)

    return BuyResponse(
        success=True,
        item=payload.name,
        quantity=payload.quantity,
    )