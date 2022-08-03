const pool = require('../../config/database')

module.exports = async (req, res) => {

    const userId = req.user.user_id
    
    if (!(userId)) {
        return res.status(400).send("Not Authorized");
    }

    console.log('get user entries')

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT id, user_id, entry_name
        FROM collegepickems."Entries"
        WHERE user_id = $1`;
        pool.query(queryParams, [userId], (error, results) => {
          if (error) {
            console.log(error)
            return reject(error)
          }
          return resolve(results)
        });
      })
    }

    async function sequentialQueries () {
        try {
            let entries = await queryPromise1();
            console.log(entries.rows)
            return res.status(200).send(entries.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};