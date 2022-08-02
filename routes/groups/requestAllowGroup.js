const pool = require('../../config/database')

module.exports = async (req, res) => {
  
    try {
      // Get user input
      const { group_id, requester_id } = req.body;
      const user_id = req.user.user_id;
      
      // Validate user input
      if (!(user_id && group_id && requester_id)) {
        return res.status(400).send("All fields are required");
      }

      const getGroupAdminIdQuery = `
        SELECT id, user_id FROM collegepickems."GroupMembers" 
        WHERE pickem_group_id = $1 AND is_admin = true`
      const getGroupAdminIdResult = await pool.query(getGroupAdminIdQuery, [group_id])
      
      if (getGroupAdminIdResult.rows[0].user_id !== user_id) {
          return res.status(409).send("Not authorized")
      } else {

        /// NEED TO MAKE SURE A REQUEST RECORD EXISTS BEFORE UPDATING
        const getExistingRequestQuery = `
          SELECT COUNT(*) FROM collegepickems."GroupMembers"
          WHERE user_id = $1 
          AND pending_activation = true
          AND pickem_group_id = $2
        `
        const getExistingRequestResult = await pool.query(getExistingRequestQuery, [requester_id, group_id])
        console.log(getExistingRequestResult)
        if (getExistingRequestResult.rows[0].count !== '1') {
          return res.status(409).send("Could not find existing request.")
        } else {
          
          const updateRecordQuery = `
          UPDATE collegepickems."GroupMembers" 
          SET is_active=true, pending_activation=false 
          WHERE pickem_group_id = $1
          AND user_id = $2`

          await pool.query(updateRecordQuery, [group_id, requester_id], (error, results) => {
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