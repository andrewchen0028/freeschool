// TODO-deprecate: yeet this out of codebase
const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Link = sequelize.define("link", {
  sourceNodeId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: { model: "nodes", key: "nodeId", },
  },
  targetNodeId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: { model: "nodes", key: "nodeId", },
  },
});

module.exports = Link;