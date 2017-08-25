// There are a lot of things to do in this module:
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
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var mongoUrl = process.env.MONGO_URI || 'mongodb://localhost/NebulaFeed';
var db;

// Initialize database connection once
mongoClient.connect(mongoUrl, function(err, database) {
  if(err) throw err;
  db = database;

  // Start the application after the database connection is ready
  app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });
});

// Return a list of colleagues
app.get('/api/colleagues', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log (`GET: ${req.url}`);

  // find all rows in colleagues collection and return the "public" fields
  db.collection('colleagues').find({}, { _id: false, __v:false })
  .toArray(function(err, result) {
    res.send(result);
  });
});

// create many new rating entries
app.post('/api/ratings/bulkInsert', function (req, res) {
  req.addListener('data', function(message)
  {
    let command = JSON.parse(message);
    console.log (`POST: ${JSON.stringify(command)}`);

    command.forEach((rating, index) => {
      let document = {
        fromColleagueId: rating.fromColleagueId,
        msg: rating.msg,
        toColleagueId: rating.toColleagueId,
        score: rating.score
      }
      db.collection('ratings').insert(document);
    });

    res.status("201").location("/api/ratings/:123").send("Created!");
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
