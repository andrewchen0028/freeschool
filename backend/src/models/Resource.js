const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Resource = sequelize.define("resource", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Resource;