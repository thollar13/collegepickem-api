const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {

      const { group_id, entry_id } = req.body;
      const user_id = req.user.user_id;

      console.log(group_id, entry_id)
      if (!(user_id && group_id && entry_id)) {
        return res.status(400).send("All fields are required");
      }

      const checkIfGroupIsPrivateQuery = `SELECT is_private	FROM collegepickems."Groups" WHERE id = $1;`
      const checkIfPublicGroupResult = await pool.query(checkIfGroupIsPrivateQuery, [group_id])

      if (checkIfPublicGroupResult.rows[0].is_private === true) {
        return res.status(409).send("Attempting to join private group. Please enter password.")
      } else {

        const checkIfRequestAlreadyExistsQuery = `SELECT COUNT(*)	FROM collegepickems."GroupEntries" WHERE group_id = $1 AND entry_id = $2;`
        const checkIfRequestAlreadyExistsResult = await pool.query(checkIfRequestAlreadyExistsQuery, [group_id, entry_id])

        if (checkIfRequestAlreadyExistsResult.rows[0].count === '1') {
            return res.status(409).send("You have already joined this group.")
          } else {
        
          const insertQuery = `
          INSERT INTO collegepickems."GroupEntries" (user_id, group_id, is_admin, is_active, pending_activation, entry_id)
          VALUES ($1, $2, false, true, false, $3);`

          await pool.query(insertQuery, [user_id, group_id, entry_id], (error, results) => {
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