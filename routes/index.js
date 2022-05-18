const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

module.exports = (app) => {
   app.use('/api/auth/login', loginRoute);
   app.use('/api/auth/register', registerRoute);
};