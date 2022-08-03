const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const { entryId, pickId, gameId } = req.body
    
    // Get user input
    const user_id = req.user.user_id;
    if (!(user_id || entryId || pickId || gameId)) {
        return res.status(400).send("Not Authorized");
    }

    console.log(entryId, gameId)
    const recordCheck = `SELECT 1 FROM collegepickems."Picks"
    WHERE entry_id = $1 AND game_id = $2`

    pool.query(recordCheck, [entryId, gameId], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        let upsertQuery

        if (results.rows.length > 0) {
            upsertQuery = `UPDATE collegepickems."Picks" SET entry_id = $1, user_pick = $2, game_id = $3
            WHERE entry_id = $1 AND game_id = $3;`
        } else {
            upsertQuery = `INSERT INTO collegepickems."Picks" (entry_id, user_pick, game_id) VALUES ($1, $2, $3)`
        }

        pool.query(upsertQuery, [entryId, pickId, gameId], (error, results) => {
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
