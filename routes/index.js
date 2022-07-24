const auth = require('../middleware/auth');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

const getUsersRoute = require('./user/getUsers');
// const editUserRoute = require('./user/editUser');

const homeRoute = require('./dashboard/home');

const createGroupRoute = require('./groups/createGroups');
const requestJoinGroup = require('./groups/requestJoinGroup');

module.exports = (app) => {
    // auth routes
    app.use('/api/auth/login', loginRoute);
    app.use('/api/auth/register', registerRoute);

    // user routes
    app.use('/api/users', auth, getUsersRoute);
    // app.use('/api/users/:id/edit', auth, editUserRoute);
    
    // pickem groups
    app.use('/api/groups/create', auth, createGroupRoute);
    app.use('/api/groups/request', auth, requestJoinGroup);

    // auth required routes
    app.use('/api/dashboard', auth, homeRoute);
  
};