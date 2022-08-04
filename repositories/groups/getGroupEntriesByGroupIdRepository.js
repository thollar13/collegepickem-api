const pool = require('../../config/database');

module.exports = getGroupEntriesByGroupId = (groupId) => {
  return new Promise((resolve, reject) => {
    const queryParams = `
      SELECT
        G.id as group_id,
        G.name as group_name,
        GE.user_id as user_id,
        E.entry_name,
        E.id as entry_id,
        GE.pending_activation,
        GE.is_active
      FROM collegepickems."GroupEntries" GE
      JOIN collegepickems."Users" U
        ON U.id = GE.user_id
      JOIN collegepickems."Entries" E
        ON E.user_id = U.id
      JOIN collegepickems."Groups" G
        ON GE.group_id = G.ID
        AND GE.entry_id = E.id
      WHERE G.id = $1
    `;
    
    pool.query(queryParams, [groupId], (error, results) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      return resolve(results)
    });
    
  })
}