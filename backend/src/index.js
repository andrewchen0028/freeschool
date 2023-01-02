const cors = require("cors");
const express = require("express");
const sequelize = require("./util/db");

const app = express();
app.use(express.json());
app.use(cors());