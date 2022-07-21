// const pool = require('./config/database')

// const getUsers = (request, response) => {
//     pool.query('SELECT id, first_name, last_name, email, phone_number, token FROM collegepickems."Users" ORDER BY id ASC', (error, results) => {
//       if (error) {
//           console.log(error)
//         throw error
//       }
//       response.status(200).json(results.rows)
//     })
// }


// module.exports = {
//     getUsers
// }