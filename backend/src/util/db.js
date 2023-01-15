// TODO-deprecate: yeet this out of codebase
const { Sequelize } = require("sequelize");

const credentials = require("./db.json");

const sequelize = new Sequelize(
  credentials.DATABASE,
  credentials.DATABASE_USERNAME,
  credentials.DATABASE_PASSWORD,
  {
    host: "localhost", dialect: "postgres",
    logging: false,
    define: { timestamps: false }
  });

sequelize.authenticate({ logging: false }).then(() => {
  console.log("Connection has been established successfully");
}).catch((error) => {
  console.error("Unable to connect to the database:", error);
});

module.exports = sequelize;