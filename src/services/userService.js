const User = require("../models/User");
const LoginMessage = require("../utils/loginMessage");
const HashService = require("./hashService");
const TokenService = require("./tokenService");

module.exports = class UserService {
  /**
   * Use for user registration
   * @param {{ id: number, email: string, password: string }} user User for registration
   * @returns {Promise<LoginMessage>} model for response
   */
  static async createUser(user) {
    user.password = await HashService.createPassword(user.password);
    const registeredUser = await User.create(user);

    return new LoginMessage(
      registeredUser.id,
      registeredUser.name,
      TokenService.generateToken(registeredUser)
    );
  }

  /**
   * Validate the user and return the token
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginMessage>} model for response
   */
  static async authorizeUser(email, password) {
    const userFromDb = await User.findOne({
      raw: true,
      where: { email: email }
    });
    if (!userFromDb) return null;

    const comparePassword = await HashService.checkPassword(
      password,
      userFromDb.password
    );

    if (!comparePassword) return null;

    return new LoginMessage(
      userFromDb.id,
      userFromDb.name,
      TokenService.generateToken(userFromDb)
    );
  }
};
