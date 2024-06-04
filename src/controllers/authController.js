const Message = require("../utils/responseMessage");
const UserService = require("../services/userService");

module.exports = class AuthController {
  /**
   * Home endpoint to check if API is running
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  static async signin(req, res) {
    if (!req.body.email || !req.body.password) {
      res
        .status(400)
        .json(new Message("Both email and password are required fields!"));
      return;
    }

    const login = await UserService.authorizeUser(
      req.body.email,
      req.body.password
    );

    if (login == null) {
      res.status(400).json(new Message("Invalid email or password!"));
      return;
    }

    res.status(200).json(login);
  }

  static async signup(req, res) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    if (!user.name || !user.email || !user.password) {
      res
        .status(400)
        .json(new Message("Email, password and name are required fields!"));
      return;
    }

    const registeredUser = await UserService.createUser(user);

    res.status(200).json(registeredUser);
  }
};
