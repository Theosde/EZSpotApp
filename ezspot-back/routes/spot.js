var express = require('express');
var router = express.Router();
var spotModel = require('../models/spot');
var userModel = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('ok');
});

router.post('/add-spot', function(req, res, next) {

  var newSpot = new spotModel({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    level: req.body.level,
    environment: req.body.environment,
    lat: req.body.lat,
    lon: req.body.lon,
    users: [req.body.users],
    medias: []
  });

  newSpot.save(function(error,spot){
    if (error) {
      console.log(error);
    } else {
      userModel.findOneAndUpdate({"_id": req.body.users}, {$push:{idSpot: spot._id}}, {new:true}, function(error, newUser){
        if (error) {
          console.log(error);
        } else {
          res.json({spot});
        }
      })
    }
  })
});

router.get('/spots-list', function(req, res, next) {
  spotModel.find(function(error, data){
    if(error) {
      console.log(error);
    } else {
      res.json({data});
    }
  })
});

router.get('/spots-feed/:idUser', function(req, res, next) {

  console.log(req.params);

  spotModel.find({users: req.params.idUser})
  .populate({path: 'medias', populate: { path: 'user' }}).exec((error, feed)=>{
    if (error) {
      console.log('erreur sur la route GET feed',error)
    } else {
        res.json({feed})
    }
  })
});

router.get('/:id', function(req, res, next) {
  spotModel.findById(req.params.id,
  function(error, data){
    if(error){
      console.log(error);
      res.json(error)
    } else {
      res.json({data});
    }
  })
})

router.get('/my-spots/:idUser', function(req, res, next) {

  console.log(req.params);

  spotModel.find({users: req.params.idUser}, function(error, spots){
    if (error) {
      console.log('erreur sur la route GET my spots',error)
    } else {
      res.json({spots})
    }
  })
});

router.get('/follow/:follow(true|false)/:spotName/:idUser', function(req, res, next) {

  console.log(req.params);

  var update = req.params.follow === "true" ? {$push:{ users:req.params.idUser}} : {$pull:{ users:req.params.idUser}}
  spotModel.findOneAndUpdate({"name":req.params.spotName},update,{new:true},function(error,spotFollow){
    res.json({spotFollow})
  })

});

module.exports = router;
