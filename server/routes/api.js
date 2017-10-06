const express = require('express');
const router = new express.Router();

const Colleague = require('../models/colleague');
const Rating = require('../models/rating');
const User = require('../models/user');

/**
 * Return a list of colleagues
 */
router.get('/colleagues', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log(`GET: ${req.url}`);

  // find all rows in colleagues collection and return the "public" fields
  Colleague.find({}, function (err, colleagues) {
    res.send(colleagues);
  }).select({"_id": 0, "__v": 0});
});

/**
 * Create a number of new ratings.
 */
router.post('/ratings/bulkInsert', function (req, res) {
  console.log(`POST: ${JSON.stringify(req.body)}`);

  req.body.forEach((sentRating) => {
    let newRating = Rating({
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

/**
 * GET information for the currently logged in user - based on the information in the passed jwt
 */
router.get('/users/me', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log(`GET: ${req.url}`);

  // figure out the current userId from the jwt
  const authCheckMiddleware = require('../middleware/auth-check');
  let userId;
  try {
    userId = authCheckMiddleware.getUserIdFromAuthHeader(req.headers.authorization);
  } catch (err) {
    console.log("Impossible error - cannot decode jwt of already authenticated request!");
  }

  // find the user with that userId and return its "public" fields
  User.findById(userId, '-_id -__v -password').exec(function (err, user) {
    res.send(user);
  });
});


module.exports = router;
