import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    this.client.on('error', (err) => {
      console.log('Redis client not connected to the server:', err);
    });
  }

  /**
   * Method that checks if the connection is alive
   * @return {boolean} true if the connection is alive or false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Method to get the value of a key
   * @param {string} key The key to retrieve
   * @return {string|null} The value of the key, or null if not found
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Method to set a key-value pair with expiration
   * @param {string} key The key to set
   * @param {string} value The value to set
   * @param {number} duration The expiration time in seconds
   */
  set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Method to delete a key
   * @param {string} key The key to delete
   * @return {void}
   */
  delete(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
