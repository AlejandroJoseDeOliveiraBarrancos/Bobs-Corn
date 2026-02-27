import asyncio
import time
from fastapi import Request
from fastapi.responses import JSONResponse

_lock = asyncio.Lock()
_last_request_time: dict[str, float] = {}

def per_client_rate_limiter(window_seconds: float = 1.0, exclude_paths: list[str] = []):
    async def middleware(request: Request, call_next):

        if request.method.upper() == "OPTIONS":
            return await call_next(request)

        if request.url.path in [path.lower() for path in exclude_paths]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()

        async with _lock:
            last_time = _last_request_time.get(client_ip)

            if last_time and (now - last_time) < window_seconds:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too Many Requests"},
                )

            _last_request_time[client_ip] = now

        return await call_next(request)

    return middleware