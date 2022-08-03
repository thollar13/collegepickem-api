const pool = require('../../config/database')

module.exports = async (req, res) => {

    const { entryId } = req.body

    if (!(req.user.user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT
                SUM(CASE WHEN G.winner_id = P.user_pick THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN G.winner_id != P.user_pick THEN 1 ELSE 0 END) as losses
            FROM collegepickems."Games" G
            JOIN collegepickems."Picks" P
            ON P.game_id = G.id
            WHERE P.entry_id = $1`;
        pool.query(queryParams, [entryId], (error, results) => {
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

// SELECT
// 	E.id,
// 	E.entry_name,
// 	SUM(CASE WHEN G.winner_id = P.user_pick THEN 1 ELSE 0 END) as wins,
// 	SUM(CASE WHEN G.winner_id != P.user_pick THEN 1 ELSE 0 END) as losses,
// 	SUM(CASE WHEN G.winner_id = P.user_pick THEN 10 ELSE 0 END) as points
// FROM collegepickems."Games" G
// JOIN collegepickems."Picks" P
// ON P.game_id = G.id
// JOIN collegepickems."Entries" E
// ON E.id = P.entry_id
// JOIN collegepickems."Users" U
// ON U.id = E.user_id
// -- JOIN collegepickems."GroupEntries" GE
// -- ON GE.entry_id = E.id
// -- WHERE GE.group_id = 20
// GROUP BY E.id, E.entry_name
// ORDER BY points DESC
