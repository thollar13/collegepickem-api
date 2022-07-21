require("dotenv").config();

const express = require("express");
const bodyParser = require('body-parser');

const app = express();

// const db = require('./queries')

// app.get('/api/users', db.getUsers)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

module.exports = app;