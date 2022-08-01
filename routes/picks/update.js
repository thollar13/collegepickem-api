const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const { groupId, pickId, gameId } = req.body
    
    // Get user input
    const user_id = req.user.user_id;
    if (!(user_id || groupId || pickId || gameId)) {
        return res.status(400).send("Not Authorized");
    }

    const recordCheck = `SELECT 1 FROM collegepickems."Picks"
    WHERE group_id = $1 AND user_id = $2 AND game_id = $3`

    pool.query(recordCheck, [groupId, user_id, gameId], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        let upsertQuery

        if (results.rows.length > 0) {
            upsertQuery = `UPDATE collegepickems."Picks" SET group_id = $1, user_pick = $2, user_id = $3, game_id = $4
            WHERE group_id = $1 AND user_id = $3 AND game_id = $4;`
        } else {
            upsertQuery = `INSERT INTO collegepickems."Picks" (group_id, user_pick, user_id, game_id) VALUES ($1, $2, $3, $4)`
        }

        pool.query(upsertQuery, [groupId, pickId, user_id, gameId], (error, results) => {
            if (error) {
                console.log(error)
            throw error
            }
            return res.status(200).json("success")
        })
    })
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please contact support.")
  }
};
