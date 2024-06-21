const sequelize = require("../config/db/conn");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Word = require("./Word");

const WordHistory = sequelize.define(
  "WordHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      field: "userId",
      references: {
        model: User,
        key: "id"
      }
    },
    wordId: {
      type: DataTypes.INTEGER,
      field: "wordId",
      references: {
        model: Word,
        key: "id"
      }
    }
  },
  {
    tableName: "words_history",
    timestamps: true,
    updatedAt: false
  }
);

module.exports = WordHistory;
