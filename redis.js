const { Redis } = require("ioredis");

class RedisClient {
  static instance = null;

  /**
   * @returns {Redis}
   */
  static getInstance(){
    if (RedisClient.instance == null) {
      RedisClient.instance = new Redis(6379, process.env.REDIS_HOST);
    }
    
    return RedisClient.instance;
  }
}

module.exports = RedisClient