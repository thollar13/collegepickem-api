const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {

    try {
      // Get user input
      const { first_name, last_name, email, password, phone_number } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name && phone_number)) {
        return res.status(400).send("All fields are required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const queryParams = `
        SELECT COUNT(email)
        FROM collegepickems."Users"
        WHERE email = $1`

      const userExists = await pool.query(queryParams, [email])

      if (userExists.rows[0].count === '1') {
        return res.status(409).send("User Already Exists. Please Login.")
      } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign(
          { user_id: email },
            process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
        );

        const insertQuery = `
          INSERT INTO collegepickems."Users"(
            first_name, last_name, email, phone_number, token, password)
          VALUES ($1, $2, $3, $4, $5, $6);
        `

        const insertQueryValues = [first_name, last_name, email, phone_number, token, encryptedPassword]

        await pool.query(insertQuery, insertQueryValues, (error, results) => {
          if (error) {
            throw error
          }
          res.status(201).json({ token });
        })
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};