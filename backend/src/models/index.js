// TODO-deprecate: yeet this out of codebase
const sequelize = require("../util/db");

const Node = require("./Node");
const Link = require("./Link");
const Resource = require("./Resource");

sequelize.sync({ force: true, logging: false });

module.exports = { Node, Link, Resource };