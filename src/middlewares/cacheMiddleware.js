const client = require("../config/redisClient");

// This endpoint was set for tests only
const cacheableEndpoints = ["entries/en"];

/**
 * Dealing with exceptions
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Continue the request
 */
async function cacheMiddleware(req, res, next) {
  const { method, originalUrl } = req;

  if (method !== "GET" && !cacheableEndpoints.includes(originalUrl))
    return next();

  const cacheKey = originalUrl;

  try {
    const data = await client.get(cacheKey);

    if (data) {
      res.setHeader("X-Cache", "HIT");

      return res.status(200).json(JSON.parse(data));
    }

    res.setHeader("X-Cache", "MISS");

    res.sendResponse = res.send;
    res.send = async (body) => {
      await client.setEx(cacheKey, 3600, JSON.stringify(body));
      res.sendResponse(body);
    };

    return next();
  } catch (error) {
    console.error("Error in cache middleware", error);

    return next();
  }
}

module.exports = cacheMiddleware;
