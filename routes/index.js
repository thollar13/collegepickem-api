const auth = require('../middleware/auth');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

const getUsersRoute = require('./user/getUsers');
// const editUserRoute = require('./user/editUser');

const homeRoute = require('./dashboard/home');

const createGroupRoute = require('./groups/createGroup');
const requestJoinPublicGroup = require('./groups/requestJoinPublicGroup');
const requestAllowGroup = require('./groups/requestAllowGroup');
const userGroups = require('./groups/getUserGroups');
const userGroupMembers = require('./groups/getAllGroupMembers');
const searchGroups = require('./groups/searchForGroup');

const schoolsRoute = require('./schools/getAllSchools');

const createGameRoute = require('./games/createGame');

module.exports = (app) => {
    // auth routes
    app.use('/api/auth/login', loginRoute);
    app.use('/api/auth/register', registerRoute);

    // user routes
    app.use('/api/users', auth, getUsersRoute);
    // app.use('/api/users/:id/edit', auth, editUserRoute);
    
    // pickem groups
    app.use('/api/groups/create', auth, createGroupRoute);
    app.use('/api/groups/public/request', auth, requestJoinPublicGroup);
    app.use('/api/groups/allow', auth, requestAllowGroup);
    app.use('/api/groups/usersgroups', auth, userGroups);
    app.use('/api/groups/groupmembers', auth, userGroupMembers);
    app.use('/api/groups/search', auth, searchGroups);

    // schools
    app.use('/api/schools', schoolsRoute);

    // games
    app.use('/api/games/create', auth, createGameRoute);

    // auth required routes
    app.use('/api/dashboard', auth, homeRoute);
  
};