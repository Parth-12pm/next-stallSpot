import { LRUCache } from "lru-cache"

const cache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
})

export { cache }

