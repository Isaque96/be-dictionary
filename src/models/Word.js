const conn = require("../config/db/conn");
const { DataTypes } = require("sequelize");
const Language = require("./Language");

const Word = conn.define(
  "Word",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    word: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Language,
        key: "id"
      }
    }
  },
  {
    tableName: "words",
    timestamps: true,
    indexes: [{ unique: true, fields: ["word", "languageId"] }]
  }
);

module.exports = Word;
