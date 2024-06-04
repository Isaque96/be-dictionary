require("dotenv").config({ path: ".env.local" });
const User = require("../models/User");
const Language = require("../models/Language");
const Word = require("../models/Word");
const WordHistory = require("../models/WordHistory");
const FavoriteWords = require("../models/FavoriteWords");

User.sync();
Language.sync();
Word.sync();
WordHistory.sync();
FavoriteWords.sync();
