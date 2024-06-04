const bcrypt = require("bcrypt");

module.exports = class HashService {
  /**
   * Create a hash based on the password
   * @param {string} password
   * @returns {Promise<string>} hashed password
   */
  static async createPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Check that the password is valid
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {Promise<boolean>} is valid password
   */
  static async checkPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
};
