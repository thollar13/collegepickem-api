const auth = require('../middleware/auth');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

const getUsersRoute = require('./user/getUsers');
// const editUserRoute = require('./user/editUser');

// const homeRoute = require('./dashboard/home');

module.exports = (app) => {
    // auth routes
    app.use('/api/auth/login', loginRoute);
    app.use('/api/auth/register', registerRoute);

    // user routes
    app.use('/api/users', getUsersRoute);
    // app.use('/api/users/:id/edit', auth, editUserRoute);
    
    // auth required routes
    // app.use('/api/dashboard', auth, homeRoute);
  
};