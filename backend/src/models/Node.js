const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Node = sequelize.define("node", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Node;