const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {
      // Get user input
      const { name, year, user_id, is_private, group_password } = req.body;

      // Validate user input
      if (!(name && year && user_id && is_private)) {
        return res.status(400).send("All fields are required");
      }

      if (is_private && !group_password) {
          return res.status(400).send("Private groups must have a pasword");
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
      
        const queryType = is_private ? `
            with rows as (
                INSERT INTO collegepickems."PickemGroups"(
                name, year, is_active, is_private, group_password)
            VALUES ($1, $2, true, true, $3)
            RETURNING id) SELECT id FROM rows;
        ` : `
            with rows as (
                INSERT INTO collegepickems."PickemGroups"(
                name, year, is_active, is_private)
            VALUES ($1, $2, true, false)
            RETURNING id) SELECT id FROM rows;
            `

        const insertQueryValues = is_private ? [name, year, group_password] : [name, year]

        const createGroup = await pool.query(queryType, insertQueryValues)

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

// SELECT U.first_name, U.last_name, PG.name, PG.is_active, PGM.pending_activation
// FROM collegepickems."PickemGroupMembers" PGM
// INNER JOIN collegepickems."PickemGroups" PG
// ON PG.id = PGM.pickem_group_id
// FULL OUTER JOIN collegepickems."Users" U 
// ON U.id = PGM.user_id
// WHERE PGM.id = 2;