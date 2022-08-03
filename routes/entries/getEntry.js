const pool = require('../../config/database')

module.exports = async (req, res) => {

    const userId = req.user.user_id
    
    if (!(userId)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT id, user_id, entry_name
        FROM collegepickems."Entries"
        WHERE id = $1`;
        pool.query(queryParams, [req.params.id], (error, results) => {
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
            let entry = await queryPromise1();
            return res.status(200).send(entry.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};