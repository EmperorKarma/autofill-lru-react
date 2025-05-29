export default class LRUCache {
  constructor(limit = 10) {
    if (limit <= 0) throw new Error("Limit must be greater than 0");
    this.limit = limit;
    this.cache = new Map(); // Stores key-value pairs
    this.accessOrder = new Set(); // Tracks access order (alternative: doubly linked list)
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Update access order
    this.accessOrder.delete(key);
    this.accessOrder.add(key);

    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // Update existing key (re-insert to maintain order)
      this.accessOrder.delete(key);
    } else {
      // Evict least recently used if limit reached
      if (this.accessOrder.size >= this.limit) {
        const oldestKey = this.accessOrder.values().next().value;
        this.cache.delete(oldestKey);
        this.accessOrder.delete(oldestKey);
      }
    }

    // Insert/update key
    this.cache.set(key, value);
    this.accessOrder.add(key);
  }

  // Optional: Clear cache
  clear() {
    this.cache.clear();
    this.accessOrder.clear();
  }

  // Optional: Get current size
  size() {
    return this.cache.size;
  }
}