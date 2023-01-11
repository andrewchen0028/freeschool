const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Node = sequelize.define("node", {
  nodeId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
});

module.exports = Node;