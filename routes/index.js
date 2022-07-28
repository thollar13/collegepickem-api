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
const getGroup = require('./groups/getGroup')

const schoolsRoute = require('./schools/getAllSchools');

const createGameRoute = require('./games/createGame');
const getGamesByWeek = require('./games/getGamesByWeek');
const getGameRoute = require('./games/getGame');
const updateGameRoute = require('./games/updateGame')

const getWeeksRoute = require('./weeks/getWeeks');
const getWeeksGamesRoute = require('./weeks/getWeeksGames');

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
    app.use('/api/groups/:id/members', auth, userGroupMembers);
    app.use('/api/groups/search', auth, searchGroups);
    app.use('/api/groups/:id', auth, getGroup);

    // schools
    app.use('/api/schools', schoolsRoute);

    // weeks 
    app.use('/api/weeks/:id', getWeeksGamesRoute);
    app.use('/api/weeks', getWeeksRoute);

    // games
    app.use('/api/games/create', auth, createGameRoute);
    app.use('/api/games/week/:id', auth, getGamesByWeek);
    app.use('/api/games/:id/update', auth, updateGameRoute);
    app.use('/api/games/:id', auth, getGameRoute);

    // auth required routes
    app.use('/api/dashboard', auth, homeRoute);
  
};