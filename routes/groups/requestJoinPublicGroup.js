const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {

      const { user_id, group_id } = req.body;

      if (!(user_id && group_id)) {
        return res.status(400).send("All fields are required");
      }

      const checkIfGroupIsPrivateQuery = `SELECT is_private	FROM collegepickems."Groups" WHERE id = $1;`
      const checkIfPublicGroupResult = await pool.query(checkIfGroupIsPrivateQuery, [group_id])

      if (checkIfPublicGroupResult.rows[0].is_private === true) {
        return res.status(409).send("Attempting to join private group. Please enter password.")
      } else {

        const checkIfRequestAlreadyExistsQuery = `SELECT COUNT(*)	FROM collegepickems."GroupMembers" WHERE user_id = $1 AND pickem_group_id = $2;`
        const checkIfRequestAlreadyExistsResult = await pool.query(checkIfRequestAlreadyExistsQuery, [user_id, group_id])

        if (checkIfRequestAlreadyExistsResult.rows[0].count === '1') {
            return res.status(409).send("Invitation already pending.")
          } else {
        
          const insertQuery = `
          INSERT INTO collegepickems."GroupMembers" (user_id, pickem_group_id, is_admin, is_active, pending_activation)
          VALUES ($1, $2, false, true, true);`

          await pool.query(insertQuery, [user_id, group_id], (error, results) => {
              if (error) {
                throw error
              }
              res.status(201).json("success");
          })
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};