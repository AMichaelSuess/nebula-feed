const express = require('express');
const router = new express.Router();

const Rating = require('../models/rating');
const User = require('../models/user');

/**
 * GET the list of users
 */
router.get('/users', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log(`GET: ${req.url}`);

  let query = {};
  // return only those entries that do not match a certain userId (if "userId-ne" is given)
  if (req.query["userId-ne"]) {
    query["userId"] = {$ne: req.query["userId-ne"]};
  }

  // return only those entries with a specific right (if "rights-inc" parameter is given)
  if (req.query["rights-inc"]) {
    query["rights"] = req.query["rights-inc"];
  }

  // console.log(`query: ${JSON.stringify(query)}`);
  // find all rows in users collection matching the query and return the "public" fields
  User.find({query}, function (err, users) {
    res.send(users);
  }).select({"_id": 0, "__v": 0, "password": 0});
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

/**
 * POST a number of new ratings.
 */
router.post('/ratings/bulkInsert', function (req, res) {
  console.log(`POST: ${JSON.stringify(req.body)}`);

  // TODO: make sure a user cannot rate himself!

  req.body.forEach((sentRating) => {
    let newRating = Rating({
      fromUserId: sentRating.fromUserId,
      msg: sentRating.msg,
      toUserId: sentRating.toUserId,
      score: sentRating.score
    });
    newRating.save(function (err) {
      if (err) throw err;

      console.log('Rating created!');
    });
  });

  // TODO: this location is fake and needs to be adapted to show all created ratings!
  res.status(201).location("/api/ratings/:123").json({
    success: true,
    message: "Success: Thanks for rating!"
  });
});

module.exports = router;
