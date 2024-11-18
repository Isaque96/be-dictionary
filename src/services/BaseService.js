const { Op } = require("sequelize");
const PaginatedResponse = require("../utils/PaginatedResponse");

module.exports = class BaseService {
  /**
   * Retrieve paginated model by cursor
   * @param {import("sequelize").ModelCtor<Model<any,any>>} model
   * @param {import("sequelize").FindOptions<Model<any,any>>} options
   * @param {string} cursor
   * @param {function(any):any} mapResponse
   * @param {number} limit
   * @returns {Promise<PaginatedResponse>}
   */
  static async _getPaginatedResultsProxy(
    model,
    options,
    cursor,
    mapResponse = null,
    limit = 10
  ) {
    if (this === BaseService) {
      throw new Error(
        "This method is protected and cannot be called directly."
      );
    }

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
    options.order = [["id", "ASC"]];

    const results = await model.findAll(options);
    const nextId = results.length ? results[results.length - 1].id : null;

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
};
