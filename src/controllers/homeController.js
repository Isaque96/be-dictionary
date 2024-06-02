const Message = require("../utils/responseMessage");

module.exports = class HomeController {
  /**
   * Home endpoint to check if API is running
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static home(req, res) {
    res.json(new Message("Fullstack Challenge 🏅 - Dictionary"));
  }
};
