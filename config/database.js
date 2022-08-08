const Pool = require('pg').Pool

let pool
if(process.env.NODE_ENV === 'production') {
  pool = new Pool({
    user: process.env.POSTGRE_DB_USER,
    host: process.env.POSTGRE_DB_HOST,
    database: process.env.POSTGRE_DB_DATABASE,
    password: process.env.POSTGRE_DB_PASSWORD,
    port: process.env.POSTGRE_DB_PORT,
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