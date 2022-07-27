const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const queryParams = `
      SELECT * FROM collegepickems."Schools"
      ORDER BY id ASC`

    pool.query(queryParams, (error, results) => {
      if (error) {
          console.log(error)
        throw error
      }
      res.status(200).json(results.rows)
    })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please contact support.")
  }
};

// SELECT 
//         G.id,
//         G.home_team,
//         G.home_team_score,
//         G.away_team,
//         G.away_team_score,
//         G.is_pickem_game,
//         G.last_updated,
//         G.created_at,
//         G.week_number,
//         G.year,
//         G.game_time,
//         Home.name AS home_team_name,
//         Away.name AS away_team_name
//     FROM collegepickems."Games" G
//     JOIN collegepickems."Schools" Home
//     ON Home.id = G.home_team
//     JOIN collegepickems."Schools" Away
//     ON Away.id = G.away_team
//     WHERE G.id = $1`