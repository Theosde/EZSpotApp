const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://Nico:mongomdp@ezspotcluster-31df8.mongodb.net/EZSpotDB';

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
};

mongoose.connect(dbUrl, options, error => {
  if (error) {
    console.error(error);
  } else {
    console.log('DB connected')
  }
});

module.exports = mongoose;
