const Pool = require('pg').Pool
const pool = new Pool({
  user: 'thomashollar',
  host: 'localhost',
  database: 'collegepickems',
  password: 'password',
  port: 5432,
})

module.exports = pool