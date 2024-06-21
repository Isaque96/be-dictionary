const Message = require("../utils/Message");

/**
 * Dealing with exceptions
 * @param {Error} err - Error
 * @param {import("express").Request} req - Request
 * @param {import("express").Response} res - Response
 * @param {import("express").NextFunction} next - Continue the request
 */
function errorMiddleware(err, req, res, next) {
  if (err) {
    console.error("error middleware", err);

    res.status(500).json(new Message(err.toString()));

    return;
  }

  next();
}

module.exports = errorMiddleware;
