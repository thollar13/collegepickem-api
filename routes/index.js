const auth = require('../middleware/auth');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

const editUserRoute = require('./user/editUser');

module.exports = (app) => {
    // auth routes
    app.use('/api/auth/login', loginRoute);
    app.use('/api/auth/register', registerRoute);

    // user routes
    app.use('/api/users/:id/edit', auth, editUserRoute);
    
    // auth required routes
    app.use('/api/dashboard', auth, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
        });
  
};