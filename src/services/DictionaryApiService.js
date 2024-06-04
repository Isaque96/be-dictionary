module.exports = class DictionaryApiService {
  /**
   * Retrieve response from Dictionary API
   * @param {string} word
   * @param {string} language
   * @returns {Promise<DictionaryApiResponse[]>} response form dictionary API
   */
  static async getWordInfo(word, language = "en") {
    if (!word) return null;

    const response = await (
      await fetch(`${process.env.DICTIONARY_API}/entries/${language}/${word}`)
    ).json();

    return response;
  }
};

// Mapping was not necessary
/**
 * @typedef {object} DictionaryApiResponse
 * @property {string} word
 * @property {string} phonetic
 * @property {object[]} phonetics
 * @property {string} phonetics.text
 * @property {string} phonetics.audio
 * @property {string} phonetics.sourceUrl
 * @property {object} phonetics.license
 * @property {string} phonetics.license.name
 * @property {string} phonetics.license.url
 * @property {object[]} meanings
 * @property {string} meanings.partOfSpeech
 * @property {object[]} meanings.definitions
 * @property {string} meanings.definitions.definition
 * @property {} meanings.definitions.synonyms
 * @property {} meanings.definitions.antonyms
 * @property {string} meanings.definitions.example
 * @property {string[]} meanings.synonyms
 * @property {} meanings.antonyms
 * @property {object} license
 * @property {string} license.name
 * @property {string} license.url
 * @property {string[]} sourceUrls
 */
