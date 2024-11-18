const { Op, Sequelize } = require("sequelize");
const WordHistory = require("../models/WordHistory");
const Word = require("../models/Word");
const Language = require("../models/Language");
const BaseService = require("./BaseService");

module.exports = class EntryService extends BaseService {
  static async getWord(userId, languageId, wordToFind) {
    const word = await Word.findOne({
      raw: true,
      where: {
        [Op.and]: [
          { languageId: languageId },
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("word")),
            Sequelize.fn("LOWER", wordToFind)
          )
        ]
      }
    });

    if (word) await WordHistory.create({ userId, wordId: word.id });

    return word;
  }

  static async verifyLanguage(language) {
    if (!language) return null;

    const dbLangEntity = await Language.findOne({
      raw: true,
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("code")),
        Sequelize.fn("LOWER", language)
      )
    });

    return dbLangEntity;
  }

  static async getHistoryPaginated(userId, cursor, limit) {
    let options = {
      where: {
        userId: userId
      },
      include: [
        {
          model: Word,
          required: true,
          attributes: ["word"]
        }
      ],
      order: [["id", "ASC"]],
      limit: limit
    };

    const historyMap = (history) => {
      return history;
    };

    const result = await this._getPaginatedResultsProxy(
      WordHistory,
      options,
      cursor,
      historyMap,
      limit
    );

    return result;
  }

  static getWordsPaginated(languageId, search, cursor, limit) {
    let options = {
      where: {
        languageId: languageId,
        word: {
          [Sequelize.Op.like]: `%${search}%`
        }
      },
      order: [["id", "ASC"]],
      limit: limit
    };

    const wordMap = (word) => {
      return word.word;
    };

    return this._getPaginatedResultsProxy(
      Word,
      options,
      cursor,
      wordMap,
      limit
    );
  }
};
