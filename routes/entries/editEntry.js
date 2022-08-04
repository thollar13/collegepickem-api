const pool = require('../../config/database')

module.exports = async (req, res) => {

    require('../../repositories/entries/editEntryRepository');
  
    const userId = req.user.user_id
    const entryId = req.params.id
    const entryName = req.body.entry_name
    console.log('hitting edit entry')
    if (!(userId)) {
        return res.status(400).send("Not Authorized");
    }

    if (!(entryId || entryName)) {
        return res.status(401).send("All fields are required");
    }

    async function sequentialQueries () {
        try {
            let entry = await updateEntry(entryId, entryName);
            return res.status(200).send(entry.rows)

        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong. Please contact support.")
        }
    }

    sequentialQueries();
};