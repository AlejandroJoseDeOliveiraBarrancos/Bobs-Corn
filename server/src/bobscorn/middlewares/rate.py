from fastapi import Request
from fastapi.responses import JSONResponse
from bobscorn.middlewares.limits_wrapper import hit

def per_client_rate_limiter(
    rate_per_minute: int,
    exclude_paths: set[str] | None = None,
):
    exclude_paths = exclude_paths or set()

    async def middleware(request: Request, call_next):
        if request.method.upper() == "OPTIONS":
            return await call_next(request)

        if request.url.path in exclude_paths:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"

        allowed = hit(key=client_ip, rate_per_minute=rate_per_minute)

        if not allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
            )

        return await call_next(request)

    return middleware