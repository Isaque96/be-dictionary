const FavoriteWords = require("../models/FavoriteWords");
const Word = require("../models/Word");
const BaseService = require("./BaseService");

module.exports = class FavoriteService extends BaseService {
  static favorite(userId, wordId) {
    return FavoriteWords.create({ userId, wordId });
  }

  static async unfavorite(userId, wordId) {
    const rowsAffected = await FavoriteWords.destroy({
      where: { userId, wordId }
    });

    return rowsAffected > 0;
  }

  static async getFavoriteWords(userId, cursor, limit) {
    let options = {
      where: {
        userId
      },
      include: [
        {
          model: Word,
          required: true,
          attributes: ["word"]
        }
      ],
      order: [["id", "DESC"]],
      limit: limit
    };

    const favoriteMap = (favorite) => {
      console.log(favorite);
      return { word: favorite.Word.word, added: favorite.createdAt };
    };

    return this._getPaginatedResultsProxy(
      FavoriteWords,
      options,
      cursor,
      favoriteMap,
      limit
    );
  }
};
