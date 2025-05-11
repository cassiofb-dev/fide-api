"""
Redis cache implementation for the FIDE scraper.
This module provides functionality to cache API responses in Redis
to avoid making repeated requests to the FIDE website.
"""
import os
import json
import time

# Redis configuration - can be moved to environment variables
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
REDIS_DB = int(os.environ.get('REDIS_DB', 0))
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)
CACHE_EXPIRY = int(os.environ.get('CACHE_EXPIRY', 3600))  # Default: 1 hour

# Initialize Redis client
try:
    import redis
    redis_client = redis.Redis(
        host=REDIS_HOST, 
        port=REDIS_PORT,
        db=REDIS_DB,
        password=REDIS_PASSWORD,
        decode_responses=True
    )
    # Test connection
    redis_client.ping()
    redis_enabled = True
    print("Redis cache enabled")
except ImportError:
    print("Redis package not installed. Running without cache.")
    redis_enabled = False
except Exception as e:
    print(f"Redis connection failed: {e}. Running without cache.")
    redis_enabled = False

def get_from_cache(key):
    """Get data from Redis cache if available"""
    if not redis_enabled:
        return None
    
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Error retrieving from cache: {e}")
    
    return None

def save_to_cache(key, data, expiry=CACHE_EXPIRY):
    """Save data to Redis cache"""
    if not redis_enabled:
        return
    
    try:
        redis_client.setex(key, expiry, json.dumps(data))
    except Exception as e:
        print(f"Error saving to cache: {e}")
