# Simple in-memory cache fallback when Redis is not available
class InMemoryCache:
    def __init__(self):
        self._cache = {}
    
    def get(self, key):
        return self._cache.get(key)
    
    def setex(self, key, time, value):
        self._cache[key] = value
    
    def delete(self, key):
        self._cache.pop(key, None)
    
    def ping(self):
        return True
