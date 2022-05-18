const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../../model/user");

module.exports = async (req, res) => {

    try {
      // Get user input
      const { first_name, last_name, email, password } = req.body;

      // Validate user input
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All fields are required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(409).send("User Already Exist. Please Login");
      } else {
         //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });
    
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
    
        // return new user
        res.status(201).json(user);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong. Please contact support.")
    }
};