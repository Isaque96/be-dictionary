const redis = require("redis");

const client = redis.createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}`,
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED")
      return new Error("The server refused the connection");

    if (options.total_retry_time > 1000 * 60 * 60)
      return new Error("Retry time exhausted");

    if (options.attempt > 10) return undefined;

    return Math.min(options.attempt * 100, 3000);
  }
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", async (err) => {
  console.error("Redis error", err);
  await client.discard();
});

module.exports = client;
