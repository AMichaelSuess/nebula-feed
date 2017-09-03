// There are a lot of things TODO in this module:
// - check proper HTTP-response codes and responses
// - security and preventing all kinds of attacks against the api
// - error handling
// - logging

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// here goes the database initialization
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost/NebulaFeed';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL, {useMongoClient: true})
  .then(
    () => {
      // Start the application after the database connection is ready
      app.listen(PORT, function () {
        console.log(`Listening on port ${PORT}`);
      });
    },
    err => {
      /** handle initial connection error */
      console.error.bind(console, 'MongoDB connection error:');
    }
  );
const db = mongoose.connection;
const colleague = require('./models/colleague');
const rating = require('./models/rating');

// Return a list of colleagues
app.get('/api/colleagues', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log(`GET: ${req.url}`);

  // find all rows in colleagues collection and return the "public" fields
  colleague.find({}, function (err, colleagues) {
    res.send(colleagues);
  }).select({"_id": 0, "__v": 0});
});

// create many new rating entries
app.post('/api/ratings/bulkInsert', function (req, res) {
  req.addListener('data', function (message) {
    let command = JSON.parse(message);
    console.log(`POST: ${JSON.stringify(command)}`);

    command.forEach((sentRating, index) => {
      let newRating = rating({
        fromUserId: sentRating.fromUserId,
        msg: sentRating.msg,
        toColleagueId: sentRating.toColleagueId,
        score: sentRating.score
      });
      newRating.save(function (err) {
        if (err) throw err;

        console.log('Rating created!');
      });
    });

    // TODO: this location is fake and needs to be adapted to show all created ratings!
    res.status("201").location("/api/ratings/:123").send("Created!");
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
