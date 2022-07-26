require("dotenv").config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../../config/database')

module.exports = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    console.log(req.body)

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const queryParams = `
        SELECT id, first_name, last_name, email, phone_number, token, password
        FROM collegepickems."Users"
        WHERE email = $1`

    let result = await pool.query(queryParams, [email.toLowerCase()])
    const user = result.rows[0]

    if (user) {
      // Check that passwords match 
      const passwordMatch = await bcrypt.compare(password, user.password)
      
      if (user && passwordMatch) {
        // Create token
        const token = jwt.sign(
          { user_id: user.id },
          process.env.JWT_KEY,
          {
            expiresIn: "4h",
          }
        );

        const updateToken = `
          UPDATE collegepickems."Users"
          SET token = $1
          WHERE email = $2`

        await pool.query(updateToken, [token, email])

        user.token = token

        res.status(200).json(user);
      } else {
          return res.status(400).send("Invalid Credentials");
      }
    } else {
      return res.status(400).send("User not found");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please contact support.")
  }
};