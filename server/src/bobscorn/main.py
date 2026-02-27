import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from bobscorn.controllers.buy_controller import router as buy_router
from bobscorn.middlewares.rate import per_client_rate_limiter

def env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return float(raw)
    except ValueError:
        return default

RATE_LIMIT_PER_MINUTE = env_float("RATE_LIMIT_PER_MINUTE", 1)

app = FastAPI(title="Bobs Corn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(
    per_client_rate_limiter(
        rate_per_minute=RATE_LIMIT_PER_MINUTE,
        exclude_paths=["/health", "/docs", "/openapi.json", "/redoc"],
    )
)

app.include_router(buy_router)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")