const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const { home_team_score, away_team_score, winner_id } = req.body
    console.log(winner_id)
    // Get user input
    const user_id = req.user.user_id;

    if (!(user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryParams = `
    UPDATE collegepickems."Games"
    SET 
        home_team_score = $2,
        away_team_score = $3,
        winner_id = $4
    WHERE id = $1`

    pool.query(queryParams, [req.params.id, home_team_score, away_team_score, winner_id], (error, results) => {
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