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

    async function sequentialQueries () {
        try {
            let entries = await queryPromise1();
            const user = await queryPromise2();
            // console.log(user)

            const entryName = `${user.rows[0].first_name} ${user.rows[0].last_name} 1`

            if (entries.rows.length === 0) {
                await queryPromise3(entryName)
            }
            
            entries = await queryPromise1();
            
            for (let index = 0; index < entries.rows.length; index++) {
                const entryGroups = await queryPromise4(entries.rows[index].id); 
                if (entryGroups.rows[0]) {
                    entries.rows[index].groups = [entryGroups.rows[0]]
                } else {
                    entries.rows[index].groups = []
                }
                
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