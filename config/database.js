const Pool = require('pg').Pool

let pool
if(process.env.NODE_ENV === 'production') {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })
} else {
  pool = new Pool({
    user: 'thomashollar',
    host: 'localhost',
    database: 'collegepickems',
    password: 'password',
    port: 5432,
  }) 
}

module.exports = pool