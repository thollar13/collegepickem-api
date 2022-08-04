const pool = require('../../config/database');

module.exports = async (req, res) => {

  require('../../repositories/groups/getGroupsByIdRepository');
  require('../../repositories/groups/getGroupEntriesByGroupIdRepository');
  require('../../repositories/groups/getGroupOverallStandingsRepository');
  
  const userId = req.user.user_id
  const groupId = req.params.id

  if (!(userId)) {
      return res.status(400).send("Not Authorized");
  }

  async function sequentialQueries () {
    try {
      const groups = await getGroupByGroupId(groupId);
      const entries = await getGroupEntriesByGroupId(groupId);
  
      for (let index = 0; index < entries.rows.length; index++) {
        const groupId = entries.rows[index].group_id
        const entryId = entries.rows[index].entry_id
        const entryStats = await getGroupOverallStandings(groupId, entryId)

        entries.rows[index].wins = entryStats.rows.length > 0 ? parseInt(entryStats.rows[0].wins) : 0
        entries.rows[index].losses = entryStats.rows.length > 0 ? parseInt(entryStats.rows[0].losses) : 0
        entries.rows[index].points = entryStats.rows.length > 0 ? parseInt(entryStats.rows[0].points) : 0
        entries.rows[index].rank = entryStats.rows.length > 0 ? entryStats.rows[0].rank : 0
      }

      entries.rows.sort((b, a) => parseInt(a.points) - parseInt(b.points))
      var rank = 1;
      for (var i = 0; i < entries.rows.length; i++) {
        // increase rank only if current score less than previous
        if (i > 0 && entries.rows[i].points < entries.rows[i - 1].points) {
          rank++;
        }
        entries.rows[i].rank = rank;
      }
      const result = {
        group: groups.rows[0],
        entries: entries.rows
      }

      return res.status(200).send(result)

    } catch (error) {
      console.log(error)
      return res.status(500).send("Something went wrong. Please contact support.")
    }
  }

  sequentialQueries();
};