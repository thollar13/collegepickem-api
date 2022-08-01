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
        G.id as game_id,
        G.home_team as home_team_id,
        S.name as home_team,
        G.home_team_score,
        G.away_team as away_team_id,
        SA.name as away_team,
        G.away_team_score,
        G.winner_id,
        (SELECT CASE WHEN EXISTS (SELECT * FROM collegepickems."Picks" P WHERE P.user_id = $1 AND p.game_id = G.id ) THEN 'TRUE' ELSE 'FALSE' END ) as has_picked,
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

// SELECT
// (SELECT name FROM collegepickems."Schools" WHERE id = 2) AS Away,
// COALESCE(away_team_score, 0) AS AwayScore,
// (SELECT name FROM collegepickems."Schools" WHERE id = 1) AS Home,
// COALESCE(home_team_score, 0) AS HomeScore,
// week_number,
// year
// FROM collegepickems."Games"
// WHERE week_number = 1
// SELECT
// (SELECT name FROM collegepickems."Schools" WHERE id = 2) AS Away,
// COALESCE(away_team_score, 0) AS AwayScore,
// (SELECT name FROM collegepickems."Schools" WHERE id = 1) AS Home,
// COALESCE(home_team_score, 0) AS HomeScore,
// week_number,
// year
// FROM collegepickems."Games"
// WHERE id = 1
// SELECT
// 	G.id as game_id,
// 	G.home_team as home_team_id,
// 	S.name as home_team,
// 	G.home_team_score,
// 	G.away_team as away_team_id,
// 	SA.name as away_team,
// 	G.away_team_score,
// 	G.winner_id,
// 	(SELECT CASE WHEN EXISTS (SELECT * FROM collegepickems."Picks" P WHERE P.user_id = 12 AND p.game_id = G.id ) THEN 'TRUE' ELSE 'FALSE' END ) as has_picked,
// 	(SELECT P.user_pick FROM collegepickems."Picks" P WHERE P.user_id = 12 AND p.game_id = G.id)
// FROM collegepickems."Games" G
// JOIN collegepickems."Schools" S
// ON S.id = G.home_team
// JOIN collegepickems."Schools" SA
// ON SA.id = G.away_team
// WHERE G.week_id = 2 
