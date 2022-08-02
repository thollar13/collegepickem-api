const pool = require('../../config/database')

module.exports = async (req, res) => {

    if (!(req.user.user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT * FROM collegepickems."Weeks" ORDER BY week ASC`;
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
            console.log('trying')
            const weeks = await queryPromise1();

            const result = {
                weeks: weeks.rows
            }
        
            return res.status(200).send(result)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};