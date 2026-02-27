from pydantic import BaseModel

class BuyResponse(BaseModel):
    success: bool
    item: str
    quantity: int
    error: str | None = None