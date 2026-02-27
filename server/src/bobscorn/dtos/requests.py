from pydantic import BaseModel

class BuyRequest(BaseModel):
    name: str
    quantity: int = 1