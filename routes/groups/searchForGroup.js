const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {

    const { count, page } = req.query
    if (!count || !page) {
        res.status(400).send("Missing Query Parameters")
    }

    const countInt = parseInt(count)
    const pageInt = parseInt(page)
    const offset = countInt * pageInt

    if (isNaN(countInt) || isNaN(pageInt)) {
        return res.status(400).send('Invalid Value for Query Parameters' );
    }

    if (countInt <= 0 || pageInt < 0) {
        return res.status(400).send('Query Parameters cannot contain negative value!' );
    }

    const queryParams = `
        SELECT id, name FROM collegepickems."Groups" 
        WHERE is_active = true
        LIMIT $1
        OFFSET $2`

    pool.query(queryParams, [countInt, offset], (error, results) => {
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