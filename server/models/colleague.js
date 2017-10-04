const mongoose = require('mongoose');

// model definition
const colleagueSchema = new mongoose.Schema({
  colleagueId: { type: String, unique: true},
  email: String,
  name: String,
  title: String,
  team: String
});

// Export the model
module.exports = mongoose.model('colleague', colleagueSchema);
