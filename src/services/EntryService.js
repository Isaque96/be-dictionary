const { Op, Sequelize } = require("sequelize");
const WordHistory = require("../models/WordHistory");
const Word = require("../models/Word");
const Language = require("../models/Language");
const PaginatedResponse = require("../utils/PaginatedResponse");

module.exports = class EntryService {
  static async getWord(userId, languageId, word) {
    const word = await Word.findOne({
      raw: true,
      where: {
        [Op.and]: [
          { languageId: languageId },
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("word")),
            Sequelize.fn("LOWER", word)
          )
        ]
      }
    });

    if (word) {
      await WordHistory.create({ userId, wordId: word.id });
    }

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
      includes: [
        {
          model: Word,
          attributes: ["word"]
        }
      ],
      order: [["id", "ASC"]],
      limit: limit
    };

    const result = await this.#getPaginatedResults(
      WordHistory,
      options,
      cursor,
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

    return this.#getPaginatedResults(Word, options, cursor, limit);
  }

  /**
   * Retrieve paginated model by cursor
   * @param {import("sequelize").ModelCtor<Model<any,any>>} model
   * @param {import("sequelize").FindOptions<Model<any,any>>} options
   * @param {string} cursor
   * @param {number} limit
   * @returns {Promise<PaginatedResponse>}
   */
  static async #getPaginatedResults(model, options, cursor, limit = 10) {
    let previousId = 0;

    const totalDocs = await model.count(options);

    if (cursor) {
      previousId = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      ).id;

      options.where.id = {
        [Op.gt]: previousId
      };
    }

    const results = await model.findAll(options);

    const nextId = results.length ? results[results.length - 1].id : null;

    const previousCursor = previousId
      ? Buffer.from(
          JSON.stringify({
            id: await this.#getPreviousId(model, previousId, options)
          })
        ).toString("base64")
      : null;

    const nextCursor = nextId
      ? Buffer.from(
          JSON.stringify({
            id: nextId
          })
        ).toString("base64")
      : null;

    const hasNext = results.length === limit;
    const hasPrev = previousCursor !== null;

    return new PaginatedResponse(
      results.map((r) => r.dataValues),
      totalDocs,
      previousCursor,
      nextCursor,
      hasNext,
      hasPrev
    );
  }

  /**
   * Retrieve the previous id for backward cursor
   * @param {import("sequelize").ModelCtor<Model<any,any>>} model
   * @param {number} previousId
   * @param {import("sequelize").FindOptions<Model<any,any>>} options
   * @returns {Promise<number>}
   */
  static async #getPreviousId(model, previousId, options) {
    options.where.id = { [Op.lt]: previousId };
    let backwardQueryOptions = {
      attributes: ["id"],
      where: options.where,
      order: [["id", "ASC"]],
      limit: options.limit + 1,
      raw: true
    };

    const ids = await model.findAll(backwardQueryOptions);

    return ids.length === backwardQueryOptions.limit ? ids[0].id : 0;
  }
};
