const mongoose = require('mongoose');

var spotSchema = mongoose.Schema({
  name: String,
  description: String,
  type: {
    ledge: Boolean,
    stairs: Boolean,
    rail: Boolean,
    gap: Boolean
  },
  level: {
    newbie: Boolean,
    advanced: Boolean,
    pro: Boolean,
    undefined: Boolean
  },
  environment: {
    public: Boolean,
    private: Boolean,
    indoor: Boolean,
    outdoor: Boolean
  },
  lat: Number,
  lon: Number,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  medias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medias' }]
});

var spotModel = mongoose.model('spots', spotSchema);

module.exports = spotModel;
