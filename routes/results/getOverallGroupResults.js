const pool = require('../../config/database')

module.exports = async (req, res) => {

    const userId = req.user.user_id
    
    if (!(userId)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
        return new Promise((resolve, reject) => {
            const queryParams = `SELECT
                    E.id as entry_id,
                    E.entry_name,
                    SUM(CASE WHEN G.winner_id = P.user_pick THEN 1 ELSE 0 END) as wins,
                    SUM(CASE WHEN G.winner_id != P.user_pick THEN 1 ELSE 0 END) as losses,
                    SUM(CASE WHEN G.winner_id = P.user_pick THEN 10 ELSE 0 END) as points,
                    SUM(CASE WHEN G.winner_id IS NOT null THEN 1 ELSE 0 END) as totalGames
                FROM collegepickems."Games" G
                JOIN collegepickems."Picks" P
                ON P.game_id = G.id
                JOIN collegepickems."Entries" E
                ON E.id = P.entry_id
                JOIN collegepickems."Users" U
                ON U.id = E.user_id
                JOIN collegepickems."GroupEntries" GE
                ON GE.entry_id = E.id
                WHERE GE.group_id = $1
                GROUP BY E.id, E.entry_name
                ORDER BY points DESC`;
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

  
            const overallGroupStandings = await queryPromise1();

            // const overallRank = overallGroupStandings.rows.findIndex(n => n.entry_id === entries.rows[index].id) + 1
            // let winPercentage = overallGroupStandings.rows.filter(n =>  n.entry_id === entries.rows[index].id)

            // const 

            // entries.rows[index].wins = overallRecord.rows[0].wins
            // entries.rows[index].losses = overallRecord.rows[0].losses
            // entries.rows[index].points = overallRecord.rows[0].points
            // entries.rows[index].rank = overallRank
            // entries.rows[index].winPercentage = parseInt(winPercentage[0].wins) / parseInt(winPercentage[0].totalgames) * 100
            // entries.rows[index].totalentries = overallStandings.rows.length

        
            return res.status(200).send(overallGroupStandings.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};