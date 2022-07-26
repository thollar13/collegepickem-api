const pool = require('../../config/database')

module.exports = async (req, res) => {

    require('../../repositories/entries/getEntryByIdRepository');
  
    const userId = req.user.user_id
    const entryId = req.params.id

    if (!(userId)) {
        return res.status(400).send("Not Authorized");
    }

    async function sequentialQueries () {
        try {
            let entry = await getEntryById(entryId);
            return res.status(200).send(entry.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};