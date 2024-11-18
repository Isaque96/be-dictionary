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
    const { cursor, search, limit } = req.query;

    const langFromDb = await EntryService.verifyLanguage(language);

    if (!langFromDb) {
      return res
        .status(400)
        .json(new Message(`Language not found(${language})`));
    }

    if (!search) {
      return res
        .status(400)
        .json(new Message("Porfavor informe algum parametro de busca(search)"));
    }

    const paginatedResponse = await EntryService.getWordsPaginated(
      langFromDb.id,
      search,
      cursor,
      limit ? parseInt(limit) : null
    );

    res.status(200).json(paginatedResponse);
  }

  static async getWord(req, res) {
    const { language, word } = req.params;
    const userId = req.user.id;

    const dbLanguage = await EntryService.verifyLanguage(language);
    if (!language)
      return res
        .status(404)
        .json(new Message(`Language not found(${language})`));

    const dbWord = await EntryService.getWord(userId, dbLanguage.id, word);

    if (!language)
      return res.status(404).json(new Message(`Word not founded(${word}})`));

    res.status(200).json(dbWord);
  }

  static async saveFavorite(req, res) {
    const { language, word } = req.params;
    const userId = req.user.id;

    const dbLanguage = await EntryService.verifyLanguage(language);
    if (!dbLanguage)
      return res
        .status(404)
        .json(new Message(`Language not found(${language})`));
  }

  static async removeFavorite(req, res) {
    const { language, word } = req.params;
    const userId = req.user.id;

    const dbLanguage = await EntryService.verifyLanguage(language);
    if (!language)
      return res
        .status(404)
        .json(new Message(`Language not found(${language})`));
  }
};
