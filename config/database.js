require("dotenv").config();
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.RDS_USERNAME || 'thomashollar',
    host: process.env.RDS_HOSTNAME || 'localhost',
    database: process.env.RDS_DB_NAME || 'collegepickems',
    password: process.env.RDS_PASSWORD || 'password',
    port: process.env.RDS_PORT || 5432,
})

module.exports = pool