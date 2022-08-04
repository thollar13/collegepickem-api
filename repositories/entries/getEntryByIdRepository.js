const pool = require('../../config/database');

module.exports = getEntryById = (entryId) => {
    return new Promise((resolve, reject) => {
        const queryParams = `
        SELECT id, user_id, entry_name
        FROM collegepickems."Entries"
        WHERE id = $1`;
        pool.query(queryParams, [entryId], (error, results) => {
          if (error) {
            console.log(error)
            return reject(error)
          }
          return resolve(results)
        });
    })
}