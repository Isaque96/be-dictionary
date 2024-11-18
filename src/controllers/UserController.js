const EntryService = require("../services/EntryService");
const FavoriteService = require("../services/FavoriteService");
const UserService = require("../services/UserService");

module.exports = class UserController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async paginatedWordsHistory(req, res) {
    const userId = req.user.id;
    const { cursor, limit } = req.query;

    const paginatedResponse = await EntryService.getHistoryPaginated(
      userId,
      cursor,
      limit ? parseInt(limit) : null
    );

    res.status(200).json(paginatedResponse);
  }

  static async me(req, res) {
    const userId = req.user.id;

    const user = await UserService.getUserById(userId);

    res.status(200).json(user);
  }

  static async paginatedFavoriteWords(req, res) {
    const userId = req.user.id;
    const { cursor, limit } = req.query;

    const paginatedResponse = await FavoriteService.getFavoriteWords(
      userId,
      cursor,
      limit ? parseInt(limit) : null
    );

    res.status(200).json(paginatedResponse);
  }
};
