const mongoose = require('mongoose');

// model definition
const ratingSchema = new mongoose.Schema({
  fromUserId: String,
  msg: String,
  toColleagueId: String,
  score: Number
});

// Export the model
module.exports = mongoose.model('rating', ratingSchema);
