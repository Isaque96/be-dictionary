const passport = require("../config/passport");
const Message = require("../utils/Message");

/**
 * Middleware to add authentication information to the request object
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @param {import("express").NextFunction} next - The next middleware function
 */
const authInfo = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json(new Message("Unauthorized user or missing token!"));
  }

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(403)
        .json(new Message(info ?? "Unauthorized user or missing token!"));
    }

    req.user = user;

    next();
  })(req, res, next);
};

module.exports = authInfo;
