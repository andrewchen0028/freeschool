const sequelize = require("../util/db");

const Node = require("./Node");
const Link = require("./Link");
const Resource = require("./Resource");

Node.hasOne(Link, { foreignKey: "sourceNodeId" });
Node.hasOne(Link, { foreignKey: "targetNodeId" });

Node.hasMany(Resource);

sequelize.sync({ force: true, logging: false });

module.exports = { Node, Link, Resource };