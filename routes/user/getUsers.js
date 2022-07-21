const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const queryParams = `
      SELECT id, first_name, last_name, email, phone_number, token
      FROM collegepickems."Users"
      ORDER BY id ASC`

    pool.query(queryParams, (error, results) => {
      if (error) {
          console.log(error)
        throw error
      }
      res.status(200).json(results.rows)
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please contact support.")
  }
};