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
const getGroup = require('./groups/getGroup');
const recommendedGroupsRoute = require('./groups/recommendedGroups');

const schoolsRoute = require('./schools/getAllSchools');

const createGameRoute = require('./games/createGame');
const getGamesByWeek = require('./games/getGamesByWeek');
const getGameRoute = require('./games/getGame');
const updateGameRoute = require('./games/updateGame')

const getWeeksRoute = require('./weeks/getWeeks');
const getWeeksGamesRoute = require('./weeks/getWeeksGames');

const updatePicksRoute = require('./picks/update');
const getUserPicksByWeekRoute = require('./picks/getWeekPicks');
const getAllWeeksRoute = require('./weeks/getAllWeeks');

const getEntriesRoute = require('./entries/getEntries');
const getEntryRoute = require('./entries/getEntry');
const getUserEntrieRoute = require('./entries/getUserEntries');
const getOverallResultsRoute = require('./results/getOverallResults');
const getOverallGroupResultsRoute = require('./results/getOverallGroupResults');

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
    app.use('/api/groups/recommended', auth, recommendedGroupsRoute);
    app.use('/api/groups/:id/members', auth, userGroupMembers);
    app.use('/api/groups/search', auth, searchGroups);
    app.use('/api/groups/:id', auth, getGroup);

    // schools
    app.use('/api/schools', schoolsRoute);

    // weeks 
    app.use('/api/weeksall', auth, getAllWeeksRoute);
    app.use('/api/weeks/:id', getWeeksGamesRoute);
    app.use('/api/weeks', getWeeksRoute);

    // games
    app.use('/api/games/create', auth, createGameRoute);
    app.use('/api/games/week/:id', auth, getGamesByWeek);
    app.use('/api/games/:id/update', auth, updateGameRoute);
    app.use('/api/games/:id', auth, getGameRoute);

    // picks
    app.use('/api/pickems/:weekId/picks/:entryId', auth, getUserPicksByWeekRoute);
    app.use('/api/pickems/update', auth, updatePicksRoute);

    // entires
    app.use('/api/entries/user', auth, getUserEntrieRoute);
    app.use('/api/entries', auth, getEntriesRoute);
    app.use('/api/entry/:id', auth, getEntryRoute);

    // auth required routes
    app.use('/api/dashboard', auth, homeRoute);

    // results
    app.use('/api/results/overall', auth, getOverallResultsRoute);
    app.use('/api/results/group/:id', auth, getOverallGroupResultsRoute);
  
};