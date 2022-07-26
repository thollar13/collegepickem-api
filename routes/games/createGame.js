const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {

      const { home_team_id, away_team_id, week_number, year, game_time } = req.body;

      if (!(home_team_id && away_team_id && week_number )) {
        return res.status(400).send("All fields are required");
      }

      if (req.user.user_id !== 'hollart13@gmail.com') {
        return res.status(409).send("Not Authorized")
      } else {
      
        const insertGameQuery = `
            INSERT INTO collegepickems."Games"
            (home_team, away_team, is_pickem_game, last_updated, created_at, week_number, year)
            VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $3, $4);`

        await pool.query(insertGameQuery, [home_team_id, away_team_id, week_number, year], (error, results) => {
            if (error) {
              throw error
            }
            res.status(201).json("success");
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};