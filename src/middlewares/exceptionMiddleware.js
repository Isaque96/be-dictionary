const Message = require("../utils/Message");

/**
 * Dealing with exceptions
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Continue the request
 */
function excetpionMiddleware(req, res, next) {
  try {
    next();
  } catch (error) {
    console.error("error caught in global middleware", error);

    res.status(500).json(new Message(error.toString()));
  }
}

module.exports = excetpionMiddleware;
