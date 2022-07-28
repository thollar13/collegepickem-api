const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    
    const queryParams = `
    SELECT
        W.id,
        W.year,
        W.week,
        W.week_start_date,
        COUNT(G.week_id)
    FROM collegepickems."Weeks" W
    JOIN collegepickems."Games" G
    ON G.week_id = W.id
    WHERE w.year = $1
    GROUP BY W.id
    ORDER BY W.week`

    pool.query(queryParams, [req.params.id], (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        
        return res.status(200).json(results.rows)
        })
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please contact support.")
  }
};