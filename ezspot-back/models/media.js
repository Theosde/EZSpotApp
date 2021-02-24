var mongoose = require('../models/db');

var mediaSchema = mongoose.Schema({
  cloudinaryUrl: String,
  type: String,
  name: String,
  timestamp: String,
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  spot: { type: mongoose.Schema.Types.ObjectId, ref: 'spots' }
});

var mediaModel = mongoose.model('medias', mediaSchema);

module.exports = mediaModel;
