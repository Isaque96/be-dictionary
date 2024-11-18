/**
 * Response Time
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Continue the request
 */
function responseTimeMiddleware(req, res, next) {
  const start = process.hrtime();

  next();

  const diff = process.hrtime(start);
  const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(3);
  res.set("X-Response-Time", `${responseTime}ms`);
}

module.exports = responseTimeMiddleware;
