const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

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
      const user = { id: jwtPayload?.id, email: jwtPayload?.email };

      if (!user.id || !user.email) {
        return done(null, false, "Unauthorized user!");
      }

      return done(null, user, "Authorized user!");
    } catch (error) {
      return done(error, false, "Unexpected error!");
    }
  })
);

module.exports = passport;
