const EntryService = require("../services/EntryService");
const Message = require("../utils/Message");

module.exports = class EntryController {
  /**
   * Paginated words
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async paginatedWords(req, res) {
    const language = req.params.language;
    const cursor = req.query.cursor;
    const search = req.query.search;
    const limit = req.query.limit;

    const langFromDb = await EntryService.verifyLanguage(language);

    if (!langFromDb) {
      res.status(400).json(new Message(`Language not found(${language})`));
      return;
    }

    if (!search) {
      res
        .status(400)
        .json(new Message("Porfavor informe algum parametro de busca(search)"));
      return;
    }

    const paginatedResponse = await EntryService.getWordsPaginated(
      langFromDb.id,
      search,
      cursor,
      limit
    );

    res.status(200).json(paginatedResponse);
  }
};
