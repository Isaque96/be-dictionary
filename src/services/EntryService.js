const { Op, Sequelize } = require("sequelize");
const WordHistory = require("../models/WordHistory");
const Word = require("../models/Word");
const Language = require("../models/Language");
const PaginatedResponse = require("../utils/PaginatedResponse");

module.exports = class EntryService {
  static async verifyLanguage(language) {
    if (!language) return null;

    const dbLangEntity = await Language.findOne({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("code")),
        Sequelize.fn("LOWER", language)
      )
    });

    return dbLangEntity;
  }

  static async getWordsPaginated(languageId, search, cursor, limit) {
    const filters = {
      languageId: languageId,
      word: {
        [Sequelize.Op.like]: `%${search}%`
      }
    };

    return this.#getPaginatedResults(Word, filters, cursor, limit);
  }

  /**
   * Retrieve paginated model by cursor
   * @param {import("sequelize").ModelCtor<Model<any,any>>} model
   * @param {import("sequelize").Filterable<Model<any,any>>.where} filters
   * @param {string} cursor
   * @param {number} limit
   * @returns {Promise<PaginatedResponse>}
   */
  static async #getPaginatedResults(model, filters, cursor, limit = 10) {
    let decodedCursor = null;
    if (cursor)
      decodedCursor = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      ).id;

    let queryOptions = {
      order: [["id", "DESC"]],
      limit: limit
    };

    if (decodedCursor) {
      filters.id = {
        [Op.lt]: decodedCursor
      };
      queryOptions.where = filters;
    }

    const results = await model.findAll(queryOptions);
    const totalDocs = await model.count();

    const nextCursor = users.length ? users[users.length - 1].id : null;
    const hasPrev = !!cursor;
    const hasNext = results.length === limit;
    const previousCursor = cursor
      ? Buffer.from(JSON.stringify({ id: decodedCursor })).toString("base64")
      : null;
    const nextCursorEncoded = nextCursor
      ? Buffer.from(JSON.stringify({ id: nextCursor })).toString("base64")
      : null;

    return new PaginatedResponse(
      results.map((r) => r.dataValues),
      totalDocs,
      previousCursor,
      nextCursorEncoded,
      hasNext,
      hasPrev
    );
  }
};
