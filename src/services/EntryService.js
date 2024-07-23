const { Op, Sequelize } = require("sequelize");
const WordHistory = require("../models/WordHistory");
const Word = require("../models/Word");
const Language = require("../models/Language");
const PaginatedResponse = require("../utils/PaginatedResponse");

module.exports = class EntryService {
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

    const result = await this.#getPaginatedResults(
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

    return this.#getPaginatedResults(Word, options, cursor, wordMap, limit);
  }

  /**
   * Retrieve paginated model by cursor
   * @param {import("sequelize").ModelCtor<Model<any,any>>} model
   * @param {import("sequelize").FindOptions<Model<any,any>>} options
   * @param {string} cursor
   * @param {function(any):any} mapResponse
   * @param {number} limit
   * @returns {Promise<PaginatedResponse>}
   */
  static async #getPaginatedResults(
    model,
    options,
    cursor,
    mapResponse = null,
    limit = 10
  ) {
    let previousId = 0;
    const totalDocs = await model.count(options);

    if (cursor) {
      previousId = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      ).id;

      options.where = {
        ...options.where,
        id: {
          [Op.gt]: previousId
        }
      };
    }

    options.limit = limit;
    options.order = [["id", "ASC"]]; // Ordenando por ID em ordem ascendente

    const results = await model.findAll(options);
    const nextId = results.length ? results[results.length - 1].id : null;

    // Calculando o cursor anterior
    let previousCursor = null;
    if (cursor) {
      const previousResults = await model.findAll({
        ...options,
        where: {
          ...options.where,
          id: {
            [Op.lt]: previousId
          }
        },
        limit: limit,
        order: [["id", "DESC"]]
      });

      if (previousResults.length) {
        previousCursor = Buffer.from(
          JSON.stringify({
            id: previousResults[previousResults.length - 1].id
          })
        ).toString("base64");
      }
    }

    const nextCursor = nextId
      ? Buffer.from(
          JSON.stringify({
            id: nextId
          })
        ).toString("base64")
      : null;

    const hasNext = results.length === limit;
    const hasPrev = previousCursor !== null;

    let mappedValues = results.map((r) => r.dataValues);
    if (mapResponse) mappedValues = mappedValues.map(mapResponse);

    return new PaginatedResponse(
      mappedValues,
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
