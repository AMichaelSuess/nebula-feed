const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model definition
const ratingSchema = new Schema({
  fromUserId: String,
  msg: String,
  toColleagueId: String,
  score: Number
});

// Create the model class
const ModelClass = mongoose.model('rating', ratingSchema);

// Export the model
module.exports = ModelClass;
