const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    // Get user input
    const user_id = req.user.user_id;

    if (!(user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryParams = `
    SELECT 
        G.id,
        G.home_team AS home_team_id,
		Home.name AS home_team_name,
        G.home_team_score,
        G.away_team AS away_team_id,
        Away.name AS away_team_name,
        G.away_team_score,
        G.is_pickem_game,
        G.last_updated,
        G.created_at,
        W.id as week_id,
        W.year,
        G.game_time,
        G.winner_id
    FROM collegepickems."Games" G
    JOIN collegepickems."Schools" Home
    ON Home.id = G.home_team
    JOIN collegepickems."Schools" Away
    ON Away.id = G.away_team
	JOIN collegepickems."Weeks" W
	ON G.week_id = W.id
    WHERE G.week_id = $1`

    pool.query(queryParams, [req.params.id], (error, results) => {
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

// SELECT
// (SELECT name FROM collegepickems."Schools" WHERE id = 2) AS Away,
// COALESCE(away_team_score, 0) AS AwayScore,
// (SELECT name FROM collegepickems."Schools" WHERE id = 1) AS Home,
// COALESCE(home_team_score, 0) AS HomeScore,
// week_number,
// year
// FROM collegepickems."Games"
// WHERE week_number = 1