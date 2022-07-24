const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {
      // Get user input
      const { user_id, group_id } = req.body;

      // Validate user input
      if (!(user_id && group_id)) {
        return res.status(400).send("All fields are required");
      }

      /// NEED TO CHECK IS REQUEST IS ALREADY ACTIVE BY USER ID and GROUP ID
      const queryParams = `
            SELECT COUNT(*)	
            FROM collegepickems."PickemGroupMembers"
            WHERE user_id = $1 AND pickem_group_id = $2;
        `

      const groupExists = await pool.query(queryParams, [user_id, group_id])

      if (groupExists.rows[0].count === '1') {
          return res.status(409).send("Invitation already pending...")
        } else {
      
        const insertQuery = `
        INSERT INTO collegepickems."PickemGroupMembers"(
        user_id, pickem_group_id, is_admin, is_active, pending_activation)
        VALUES ($1, $2, false, true, true);`

        await pool.query(insertQuery, [user_id, group_id], (error, results) => {
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