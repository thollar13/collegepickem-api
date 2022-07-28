const pool = require('../../config/database')

module.exports = async (req, res) => { 
  try {
    
    const queryParams = `
        SELECT * FROM collegepickems."Weeks"
        WHERE year = 2022
        ORDER BY week, year`

    pool.query(queryParams, (error, results) => {
      if (error) {
          console.log(error)
        throw error
      }
    
      return res.status(200).json(results.rows)
    })
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please contact support.")
  }
};