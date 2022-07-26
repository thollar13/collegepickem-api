const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const queryParams = `
      SELECT * FROM collegepickems."Schools"
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