require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

module.exports = app;