const pool = require('../../config/database');

module.exports = getGroupOverallStandings = (groupId, entryId) => {
  return new Promise((resolve, reject) => {
    const queryParams = `
        SELECT
            E.id as entry_id,
            E.entry_name,
            GE.is_active,
            GE.pending_activation,
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
        WHERE GE.group_id = $1 AND GE.entry_id = $2
            GROUP BY E.id, E.entry_name, GE.is_active, GE.pending_activation
            ORDER BY points DESC
    `;
    
    pool.query(queryParams, [groupId, entryId], (error, results) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      return resolve(results)
    });
    
  })
}