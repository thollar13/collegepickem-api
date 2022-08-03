const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
      console.log(req.user)
    // Get user input
    const user_id = req.user.user_id;

    if (!(user_id)) {
        return res.status(400).send("All fields are required");
    }

    const queryParams = `
        SELECT 
            PG.id,
            PG.name,
            PG.year,
            PG.is_active,
            PGM.is_admin,
            PG.is_private
        FROM collegepickems."GroupEntries" PGM
        JOIN collegepickems."Groups" PG
        ON PG.id = PGM.group_id
        WHERE PGM.user_id = $1`

    pool.query(queryParams, [user_id], (error, results) => {
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