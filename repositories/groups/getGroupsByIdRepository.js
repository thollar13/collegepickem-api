const pool = require('../../config/database');

module.exports = getGroupByGroupId = (groupId) => {
  return new Promise((resolve, reject) => {
    const queryParams = `SELECT * FROM collegepickems."Groups" WHERE id = $1`;
    
    pool.query(queryParams, [groupId], (error, results) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      return resolve(results)
    });
    
  })
}