const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

// TODO-current: add score
const Resource = sequelize.define("resource", {
  nodeId: {
    type: DataTypes.STRING,
    references: { model: "nodes", key: "nodeId", },
  },
  url: {
    type: DataTypes.STRING,
    validate: { isUrl: true },
    allowNull: false,
    unique: true,
  }
});

module.exports = Resource;