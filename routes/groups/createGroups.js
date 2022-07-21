const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {
      // Get user input
      const { name, year, user_id } = req.body;

        console.log(name)
        console.log(year)

      // Validate user input
      if (!(name && year)) {
        return res.status(400).send("All fields are required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const queryParams = `
        SELECT COUNT(name)
        FROM collegepickems."PickemGroups"
        WHERE name = $1`

      const groupExists = await pool.query(queryParams, [name])

      if (groupExists.rows[0].count === '1') {
        return res.status(409).send("Group Already Exists..")
      } else {
      
        const insertQuery = `
          with rows as (
              INSERT INTO collegepickems."PickemGroups"(
            name, year, is_active)
          VALUES ($1, $2, $3)
          RETURNING id) SELECT id FROM rows;
        `

        console.log(insertQuery)

        const insertQueryValues = [name, year, true]

        const createGroup = await pool.query(insertQuery, insertQueryValues)

        const insertIntoPickemGroupsMembers = `
            INSERT INTO collegepickems."PickemGroupMembers"(
                user_id, pickem_group_id, is_admin, is_active)
            VALUES ($1, $2, $3, $4);`

        await pool.query(insertIntoPickemGroupsMembers, [user_id, createGroup.rows[0].id, true, true], (error, results) => {
            if (error) {
              throw error
            }
            res.status(201).json("success");
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};