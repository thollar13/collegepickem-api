const pool = require('../../config/database')

module.exports = async (req, res) => {
  
  require('../../repositories/groups/getGroupsByUserIdRepository');

    // Get user input
    const userId = req.user.user_id;

    if (!(userId)) {
        return res.status(400).send("All fields are required");
    }

    async function sequentialQueries () {
      try {
          const groups = await getGroupsByGroupId(userId);
          return res.status(200).send(groups.rows)

      } catch (error) {
          console.log(error)
          return res.status(500).send("Something went wrong. Please contact support.")
      }
    }

    sequentialQueries();
  
};