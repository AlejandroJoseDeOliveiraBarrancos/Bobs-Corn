from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from bobscorn.controllers.buy_controller import router as buy_router
from bobscorn.middlewares.rate import per_client_rate_limiter
from fastapi.middleware.cors import CORSMiddleware

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
        window_seconds=60,
        exclude_paths={"/health", "/docs", "/openapi.json", "/redoc"},
    )
)
app.include_router(buy_router)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")



