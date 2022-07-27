const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    // Get user input
    const user_id = req.user.user_id;

    if (!(user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryParams = `
        SELECT * FROM collegepickems."Groups" 
        WHERE id = $1`

    pool.query(queryParams, [req.params.id], (error, results) => {
      if (error) {
          console.log(error)
        throw error
      }

      const groupData = results.rows[0]

      const queryParams = `
        SELECT 
            U.id,
            U.first_name,
            U.last_name,
            U.email,
            U.phone_number,
            PGM.is_admin,
            PGM.is_active,
            PGM.pending_activation
        FROM collegepickems."GroupMembers" PGM
        LEFT JOIN collegepickems."Users" U
        ON U.id = PGM.user_id
        WHERE PGM.pickem_group_id = $1`

      pool.query(queryParams, [req.params.id], (error, results) => {
        if (error) {
            console.log(error)
          throw error
        }

        return res.status(200).json({
          group: groupData,
          members: results.rows
        })
      })
    })
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please contact support.")
  }
};