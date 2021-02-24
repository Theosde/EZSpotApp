var mongoose = require('../models/db');

var userSchema = mongoose.Schema({
  avatar: String,
  userName: String,
  lastName: String,
  firstName: String,
  email: String,
  password: String,
  salt: String,
  idFacebook: String,
  idGoogle: String,
  idSpot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'spots' }]
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
