const EntryService = require("../services/EntryService");
const UserService = require("../services/UserService");

module.exports = class UserController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async paginatedWordsHistory(req, res) {
    const userId = req.user.id;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const paginatedResponse = await EntryService.getHistoryPaginated(
      userId,
      cursor,
      limit
    );

    res.status(200).json(paginatedResponse);
  }

  static async me(req, res) {
    const userId = req.user.id;

    const user = await UserService.getUserById(userId);

    res.status(200).json(user);
  }
};
