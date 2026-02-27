import os
import time
import redis
from limits import storage, strategies
from limits import RateLimitItemPerMinute

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
REDIS_TIMEOUT_SECONDS = float(os.getenv("REDIS_TIMEOUT_SECONDS", "1"))

redis_client = redis.Redis.from_url(
    REDIS_URL,
    socket_connect_timeout=REDIS_TIMEOUT_SECONDS,
    socket_timeout=REDIS_TIMEOUT_SECONDS,
)

redis_storage = storage.RedisStorage(redis_client)
rate_limiter = strategies.MovingWindowRateLimiter(redis_storage)


def hit(key: str, rate_per_minute: int) -> bool:
    try:
        item = RateLimitItemPerMinute(int(rate_per_minute))
        return rate_limiter.hit(item, key)
    except (redis.exceptions.RedisError, OSError):
        return True