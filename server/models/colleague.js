const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model definition
const colleagueSchema = new Schema({
  colleagueId: { type: String, unique: true},
  email: String,
  name: String,
  title: String,
  team: String
});

// Create the model class
const ModelClass = mongoose.model('colleague', colleagueSchema);

// Export the model
module.exports = ModelClass;
