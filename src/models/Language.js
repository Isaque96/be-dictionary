const sequelize = require("../db/conn");
const { DataTypes } = require("sequelize");

const Language = sequelize.define(
  "Language",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "languages",
    timestamps: false
  }
);

module.exports = Language;
