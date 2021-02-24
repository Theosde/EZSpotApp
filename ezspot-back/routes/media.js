var express = require('express');
var router = express.Router();
var mediaModel = require('../models/media');
var spotModel = require('../models/spot');
var cloudinary = require('cloudinary');

cloudinary.config({cloud_name: 'dutedyimj', api_key: '641972732856732', api_secret: 'EVHP0obpCsWqZPPf470dp-0eeMs'});


router.get('/', function(req, res, next) {
  res.send('ok');
});

router.post('/upload-media', function(req, res, next) {
  console.log(req.body.spotId);

  var randomName = Math.floor(Math.random() * 1000000)
  var photoPath = `public/images/picture-${randomName}.jpg`;
  var filename = req.files.photo;
     filename.mv(photoPath, function(err) {
       if (err){
         return res.status(500).send(err);
       }

       cloudinary.v2.uploader.upload(photoPath,
           function(error, result){
             if(result){
               console.log(result)

               var date = new Date();
               var timestamp = date.getTime();

               var newMedia = new mediaModel({
                 cloudinaryUrl: result.secure_url,
                 type: result.format,
                 name: result.original_filename,
                 timestamp: timestamp,
                 user: req.body.userId,
                 spot: req.body.spotId
               })
               newMedia.save(function(error, media){
                 console.log("media saved :" + media)
                 const fs = require('fs');
                 fs.unlinkSync(photoPath)

                 spotModel.findOneAndUpdate({"_id": req.body.spotId}, {$push:{medias: media._id}}, {new:true}, function(error, newSpot){
                   if (error) {
                     console.log(error);
                   } else {
                     res.send("ok")
                   }
                 })

               })

             } else {
               console.log(error)
             }
           })
     })

});

module.exports = router;
