const pool = require('../../config/database')

module.exports = async (req, res) => {

    if (!(req.user.user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT *,
        (SELECT COUNT(*) FROM collegepickems."GroupEntries" GE WHERE GE.group_id = g.id) as group_size
        FROM collegepickems."Groups" G
        WHERE G.is_private = false
        LIMIT 30`;
        pool.query(queryParams, (error, results) => {
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
            const result = await queryPromise1();

            return res.status(200).send(result.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};