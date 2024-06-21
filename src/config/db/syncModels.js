const User = require("../../models/User");
const Language = require("../../models/Language");
const Word = require("../../models/Word");
const WordHistory = require("../../models/WordHistory");
const FavoriteWords = require("../../models/FavoriteWords");
const association = require("./associations");

async function syncModels() {
  await User.sync();
  await Language.sync();
  await Word.sync();
  await WordHistory.sync();
  await FavoriteWords.sync();
  association();
}

module.exports = syncModels;
