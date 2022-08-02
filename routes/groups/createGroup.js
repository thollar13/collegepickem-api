const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {

  const { name, year, is_private, group_password, entry_id } = req.body;

  const user_id = req.user.user_id;

  if (!(user_id)) {
      return res.status(400).send("Not Authorized");
  }

  // Validate user input
  if (!(name && year && user_id && is_private)) {
    return res.status(400).send("All fields are required");
  }

  if (is_private === 'true' && !group_password) {
      return res.status(400).send("Private groups must have a pasword");
  }

  const queryPromise1 = () => {
    return new Promise((resolve, reject) => {
      const queryParams = `SELECT COUNT(name) FROM collegepickems."Groups" WHERE name = $1`;
      pool.query(queryParams, [name], (error, results) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

  const queryPublicGroup = () => {
    return new Promise((resolve, reject) => {
      const queryParams = `with rows as (
            INSERT INTO collegepickems."Groups"(
            name, year, is_active, is_private)
        VALUES ($1, $2, true, false)
        RETURNING id) SELECT id FROM rows`;
      pool.query(queryParams, [name, year], (error, results) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

  const queryPrivateGroup = () => {
    return new Promise((resolve, reject) => {
      const queryParams = `with rows as (
        INSERT INTO collegepickems."Groups"(
        name, year, is_active, is_private, group_password)
    VALUES ($1, $2, true, true, $3)
    RETURNING id) SELECT id FROM rows`;
      pool.query(queryParams, [name, year, group_password], (error, results) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

  const insertIntoPickemGroupsMembers = (groupId) => {
    return new Promise((resolve, reject) => {
      const queryParams = `INSERT INTO collegepickems."GroupEntries"(
        user_id, group_id, is_admin, is_active, pending_activation, entry_id)
          VALUES ($1, $2, true, true, false, $3)`;
      pool.query(queryParams, [user_id, groupId, entry_id], (error, results) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        return resolve(results)
      });
    })
  }

  async function sequentialQueries () {
    try {
        const groupsExist = await queryPromise1();
        
        let newGroup
        if (groupsExist.rows[0].count === '1') {
          return res.status(409).send("Group Already Exists.")
        } else {
          if (is_private === 'true') {
            newGroup = await queryPrivateGroup();
          } else {
            newGroup =await queryPublicGroup();
          }
        }


        const result = await insertIntoPickemGroupsMembers(newGroup.rows[0].id);

        return res.status(200).send(result)

    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong. Please contact support.")
    }
  }

  sequentialQueries()
};