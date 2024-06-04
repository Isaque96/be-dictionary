const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Message = require("../utils/responseMessage");

/**
 * @type {import("passport-jwt").StrategyOptionsWithoutRequest}
 */
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
  ignoreExpiration: false
};

passport.use(
  new JwtStrategy(opts, function (jwtPayload, done) {
    try {
      const user = { id: jwtPayload.id, email: jwtPayload.email };

      if (!user.id || !user.name)
        return done(null, false, new Message("Missing information!"));

      return done(null, user, new Message("Authorized user!"));
    } catch (error) {
      return done(error, false, new Message("Unexpected error!"));
    }
  })
);

module.exports = passport;
