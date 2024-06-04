module.exports = class LoginMessage {
  /**
   * Standard return message for login
   * @param {string} id
   * @param {string} name
   * @param {string} token
   */
  constructor(id, name, token) {
    this.id = id;
    this.name = name;
    this.token = "Bearer " + token;
  }
};
