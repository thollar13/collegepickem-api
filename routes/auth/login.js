require("dotenv").config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../../model/user");  

module.exports = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    // Check that passwords match 
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (user && passwordMatch) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
        res.status(400).send("Invalid Credentials");
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please contact support.")
  }
};