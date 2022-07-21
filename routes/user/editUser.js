const User = require("../../model/user");  

module.exports = async (req, res) => {
  try {
    // Get user input
    const { email, password, firstName, lastName } = req.body;
    const userId = req.params.id;
    const tokenUserId = req.user.user_id;

    if (tokenUserId === userId) {
         // Validate if user exist in our database
        const user = await User.find({_id: tokenUserId})
    
        if (user) {

            console.log('can edit user here')
            res.status(200).json(user);

        } else {
            res.status(400).send("User not found");
        }
    } else {
        res.status(401).send('Access denied');
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Please contact support.")
  }
};