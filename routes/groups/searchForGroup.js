const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    // Get user input
    const { search_string } = req.body;

    if (!(search_string)) {
        return res.status(400).send("All fields are required");
    }

    const queryParams = `
        SELECT id, is_active, name, year, is_private FROM collegepickems."PickemGroups"
        WHERE name LIKE '%'||$1||'%'`

    pool.query(queryParams, [search_string], (error, results) => {
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