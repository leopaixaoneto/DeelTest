const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");

const app = express();
const { RouterConfig } = require("./Routes/config");

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

RouterConfig.config(app);

module.exports = app;
