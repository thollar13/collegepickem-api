const pool = require('../../config/database');

module.exports = getGroupsByGroupId = (userId) => {
  return new Promise((resolve, reject) => {
    const queryParams = `
        SELECT 
            PG.id,
            PG.name,
            PG.year,
            PG.is_active,
            PGM.is_admin,
            PG.is_private,
            E.entry_name
        FROM collegepickems."GroupEntries" PGM
        JOIN collegepickems."Groups" PG
            ON PG.id = PGM.group_id
        JOIN collegepickems."Entries" E
            ON E.id = PGM.entry_id
        WHERE PGM.user_id = $1`

    pool.query(queryParams, [userId], (error, results) => {
        if (error) {
            console.log(error)
            return reject(error)
        }
        return resolve(results)
    });
    
  })
}