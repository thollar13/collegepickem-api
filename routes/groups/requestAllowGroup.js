const pool = require('../../config/database')

module.exports = async (req, res) => {
  
    try {
      // Get user input
      const { user_id, group_id, requester_id } = req.body;

      // Validate user input
      if (!(user_id && group_id && requester_id)) {
        return res.status(400).send("All fields are required");
      }

      /// NEED TO CHECK IS REQUEST IS ALREADY ACTIVE BY USER ID and GROUP ID
      const queryParams = `
            SELECT id, user_id
            FROM collegepickems."PickemGroupMembers"
            WHERE pickem_group_id = $1 AND is_admin = true
        `

      const groupRecord = await pool.query(queryParams, [group_id])

      if (groupRecord.rows[0].user_id !== user_id) {
          return res.status(409).send("Not authorized")
        } else {
      
        const insertQuery = `
        UPDATE collegepickems."PickemGroupMembers"
        SET is_active=$1, pending_activation=$2
        WHERE id = $3`

        await pool.query(insertQuery, [true, true, groupRecord.rows[0].id], (error, results) => {
            if (error) {
              throw error
            }
            res.status(201).json("success");
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};

// SELECT U.first_name, U.last_name, PG.name, PG.is_active, PGM.pending_activation
// FROM collegepickems."PickemGroupMembers" PGM
// INNER JOIN collegepickems."PickemGroups" PG
// ON PG.id = PGM.pickem_group_id
// FULL OUTER JOIN collegepickems."Users" U 
// ON U.id = PGM.user_id
// WHERE PGM.id = 2;