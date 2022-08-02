const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    // Get user input
    const user_id = req.user.user_id;

    if (!(user_id)) {
        return res.status(400).send("Not Authorized");
    }
    console.log('user id ', user_id)
    console.log(req.params.weekId)
    const queryParams = `
    SELECT
        G.id as game_id,
        G.home_team as home_team_id,
        S.name as home_team,
        S.mascot as home_mascot,
        G.home_team_score,
        G.away_team as away_team_id,
        SA.name as away_team,
        SA.mascot as away_mascot,
        G.away_team_score,
        G.game_time,
        S.city,
        S.state,
        S.stadium_name,
        G.winner_id,
        (SELECT P.user_pick FROM collegepickems."Picks" P WHERE P.user_id = $1 AND p.game_id = G.id)
    FROM collegepickems."Games" G
    JOIN collegepickems."Schools" S
    ON S.id = G.home_team
    JOIN collegepickems."Schools" SA
    ON SA.id = G.away_team
    WHERE G.week_id = $2`

    pool.query(queryParams, [user_id, req.params.weekId], (error, results) => {
      if (error) {
          console.log(error)
        throw error
      }
      return res.status(200).json(results.rows)
    })
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please contact support.")
  }
};
