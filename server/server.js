// There are a lot of things TODO in this module:
// - check proper HTTP-response codes and responses
// - security and preventing all kinds of attacks against the api
// - error handling
// - logging

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const config = require('./config');

// here goes the database initialization
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, {useMongoClient: true})
  .then(
    () => {
      // Start the application after the database connection is ready
      app.listen(config.PORT, function () {
        console.log(`Listening on port ${config.PORT}`);
      });
    },
    err => {
      /** handle initial connection error */
      console.error.bind(console, `MongoDB connection error: ${err}`);
    }
  );

// load models
require('./models/user');

const app = express();

// log requests to console using morgan-middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// parse application/json-bodies
app.use(bodyParser.json());

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authentication checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware.checkAuthFromAuthHeader);

// and our routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
