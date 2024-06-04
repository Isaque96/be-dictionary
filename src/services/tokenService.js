const jwt = require("jsonwebtoken");

module.exports = class TokenService {
  static generateToken(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    return token;
  }
};
