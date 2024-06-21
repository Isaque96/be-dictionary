const User = require("../../models/User");
const Language = require("../../models/Language");
const Word = require("../../models/Word");
const WordHistory = require("../../models/WordHistory");
const FavoriteWords = require("../../models/FavoriteWords");

async function associations() {
  Word.belongsTo(Language, { foreignKey: "languageId" });

  Language.hasMany(Word, { foreignKey: "languageId" });

  FavoriteWords.belongsTo(User, { foreignKey: "userId" });
  FavoriteWords.belongsTo(Word, { foreignKey: "wordId" });

  WordHistory.belongsTo(User, { foreignKey: "userId" });
  WordHistory.belongsTo(Word, { foreignKey: "wordId" });
}

module.exports = associations;
