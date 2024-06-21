const sequelize = require("../config/db/conn");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Word = require("./Word");

const FavoriteWords = sequelize.define(
  "FavoriteWord",
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
    tableName: "favorite_words",
    timestamps: true,
    updatedAt: false,
    indexes: [{ unique: true, fields: ["userId", "wordId"] }]
  }
);

module.exports = FavoriteWords;
