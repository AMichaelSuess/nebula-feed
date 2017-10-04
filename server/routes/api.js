const express = require('express');
const router = new express.Router();

const Colleague = require('../models/colleague');
const Rating = require('../models/rating');

// Return a list of colleagues
router.get('/colleagues', function (req, res) {
  res.set('Content-Type', 'application/json');
  console.log(`GET: ${req.url}`);

  // find all rows in colleagues collection and return the "public" fields
  Colleague.find({}, function (err, colleagues) {
    res.send(colleagues);
  }).select({"_id": 0, "__v": 0});
});

// create many new rating entries
router.post('/ratings/bulkInsert', function (req, res) {
  console.log(`POST: ${JSON.stringify(req.body)}`);

  req.body.forEach((sentRating, index) => {
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

module.exports = router;
