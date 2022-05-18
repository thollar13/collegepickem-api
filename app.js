require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded())

require("./routes")(app);

module.exports = app;