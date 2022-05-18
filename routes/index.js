const auth = require('../middleware/auth');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

module.exports = (app) => {
   app.use('/api/auth/login', loginRoute);
   app.use('/api/auth/register', registerRoute);
   app.use('/api/dashboard', auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
    });
  
};