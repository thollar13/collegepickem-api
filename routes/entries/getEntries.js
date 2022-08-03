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

    const queryPromise2 = () => {
        return new Promise((resolve, reject) => {
            const queryParams = `SELECT * FROM collegepickems."Users" WHERE id = $1`;
            pool.query(queryParams, [userId], (error, results) => {
              if (error) {
                console.log(error)
                return reject(error)
              }
              return resolve(results)
            });
          })
    }

    const queryPromise3 = (entryName) => {
        return new Promise((resolve, reject) => {
            const queryParams = `INSERT INTO collegepickems."Entries"(
                user_id, entry_name)
                VALUES ($1, $2)`;
            pool.query(queryParams, [userId, entryName], (error, results) => {
              if (error) {
                console.log(error)
                return reject(error)
              }
              return resolve(results)
            });
          })
    }

    const queryPromise4 = (entryId) => {
        return new Promise((resolve, reject) => {
            const queryParams = `SELECT 
                G.id,
                G.name
            FROM collegepickems."GroupEntries" GE
            JOIN collegepickems."Entries" E
            ON E.id = GE.entry_id
            JOIN collegepickems."Groups" G
            ON G.id = GE.group_id
            WHERE GE.entry_id = $1`;
            pool.query(queryParams, [entryId], (error, results) => {
              if (error) {
                console.log(error)
                return reject(error)
              }
              return resolve(results)
            });
        })
    }

    const queryPromise5 = (entryId) => {
        return new Promise((resolve, reject) => {
            const queryParams = `SELECT
                    SUM(CASE WHEN G.winner_id = P.user_pick THEN 1 ELSE 0 END) as wins,
                    SUM(CASE WHEN G.winner_id != P.user_pick THEN 1 ELSE 0 END) as losses,
                    SUM(CASE WHEN G.winner_id = P.user_pick THEN 10 ELSE 0 END) as points
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

    const queryPromise6 = () => {
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
                GROUP BY E.id, E.entry_name
                ORDER BY points DESC`;
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
            let entries = await queryPromise1();
            const user = await queryPromise2();
            

            if (entries.rows.length === 0) {
                const entryName = `${user.rows[0].first_name} ${user.rows[0].last_name} 1`
                await queryPromise3(entryName)
            }
            
            entries = await queryPromise1();
            
            for (let index = 0; index < entries.rows.length; index++) {
                const entryGroups = await queryPromise4(entries.rows[index].id); 
                const overallRecord = await queryPromise5(entries.rows[index].id);
                const overallStandings = await queryPromise6();

                const overallRank = overallStandings.rows.findIndex(n => n.entry_id === entries.rows[index].id) + 1
                let winPercentage = overallStandings.rows.filter(n =>  n.entry_id === entries.rows[index].id)

                if (entryGroups.rows[0]) {
                    entries.rows[index].groups = [entryGroups.rows]
                } else {
                    entries.rows[index].groups = []
                }

                entries.rows[index].wins = overallRecord.rows[0].wins
                entries.rows[index].losses = overallRecord.rows[0].losses
                entries.rows[index].points = overallRecord.rows[0].points
                entries.rows[index].rank = overallRank
                entries.rows[index].winPercentage = parseInt(winPercentage[0].wins) / parseInt(winPercentage[0].totalgames) * 100
                entries.rows[index].totalentries = overallStandings.rows.length
            }

            const result = {
                entries: entries.rows,
            }
        
            return res.status(200).send(result)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};