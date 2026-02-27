from limits import storage, strategies
from limits import RateLimitItemPerMinute
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

redis_storage = storage.RedisStorage(REDIS_URL)
rate_limiter = strategies.MovingWindowRateLimiter(redis_storage)


def hit(key: str, rate_per_minute: int) -> bool:
    item = RateLimitItemPerMinute(rate_per_minute)
    return rate_limiter.hit(item, key)