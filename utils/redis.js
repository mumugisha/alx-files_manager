const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Promisify the 'get' method for async/await support
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Handle connection errors
    this.client.on('error', (err) => {
      console.error('Redis client not connected to the server:', err);
    });

    // Optional: Log a successful connection
    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });
  }

  /**
   * Check if Redis connection is alive
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key from Redis
   * @param {string} key - The key to retrieve
   * @return {Promise<string|null>}
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      console.error(`Error getting key "${key}":`, err);
      return null;
    }
  }

  /**
   * Set a key-value pair in Redis with an expiration time
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   */
  set(key, value, duration) {
    this.client.setex(key, duration, value, (err) => {
      if (err) {
        console.error(`Error setting key "${key}" with expiration:`, err);
      }
    });
  }

  /**
   * Delete a key from Redis
   * @param {string} key - The key to delete
   */
  del(key) {
    this.client.del(key, (err) => {
      if (err) {
        console.error(`Error deleting key "${key}":`, err);
      }
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
