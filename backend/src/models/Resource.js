const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Resource = sequelize.define("resource", {
  resourceId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nodeId: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: { model: "nodes", key: "nodeId", },
  },
});

module.exports = Resource;