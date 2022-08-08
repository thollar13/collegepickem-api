require("dotenv").config();
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.DB_USER || 'thomashollar',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'collegepickems',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.PORT || 5432,
})

module.exports = pool