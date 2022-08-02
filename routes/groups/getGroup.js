const pool = require('../../config/database')

module.exports = async (req, res) => {

    if (!(req.user.user_id)) {
        return res.status(400).send("Not Authorized");
    }

    const queryPromise1 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT * FROM collegepickems."Groups" WHERE id = $1`;
        pool.query(queryParams, [req.params.id], (error, results) => {
          if (error) {
            console.log(error)
            return reject(error)
          }
          return resolve(results)
        });
      })
    }

    const queryPromise2 = () => {
      return new Promise((resolve, reject) => {
        const queryParams = `SELECT 
            U.id,
            U.first_name,
            U.last_name,
            U.email,
            U.phone_number,
            PGM.is_admin,
            PGM.is_active,
            PGM.pending_activation
        FROM collegepickems."GroupMembers" PGM
        LEFT JOIN collegepickems."Users" U
        ON U.id = PGM.user_id
        WHERE PGM.pickem_group_id = $1`;
        pool.query(queryParams, [req.params.id], (error, results) => {
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
      const groups = await queryPromise1();
      const members = await queryPromise2();

      const result = {
        group: groups.rows[0],
        members: members.rows
      }
      
      return res.status(200).send(result)

    } catch (error) {
      console.log(error)
      return res.status(500).send("Something went wrong. Please contact support.")
    }
  }

  sequentialQueries();
};