const pool = require('../../config/database');

module.exports = updateEntry = (entryId, entryName) => {
    return new Promise((resolve, reject) => {
        const queryParams = `
        UPDATE collegepickems."Entries"
        SET entry_name=$2
        WHERE id=$1;`;
        pool.query(queryParams, [entryId, entryName], (error, results) => {
          if (error) {
            console.log(error)
            return reject(error)
          }
          return resolve(results)
        });
    })
}