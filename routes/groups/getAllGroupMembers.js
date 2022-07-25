const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    // Get user input
    const { group_id } = req.body;

    if (!(group_id)) {
        return res.status(400).send("All fields are required");
    }

    const queryParams = `
        SELECT 
            U.id,
            U.first_name,
            U.last_name,
            U.email,
            U.phone_number,
            PGM.is_admin
        FROM collegepickems."PickemGroupMembers" PGM
        LEFT JOIN collegepickems."Users" U
        ON U.id = PGM.user_id
        WHERE PGM.pickem_group_id = $1`

    pool.query(queryParams, [group_id], (error, results) => {
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