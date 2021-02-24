var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var mediaModel = require('../models/media');
var spotModel = require('../models/spot');

var passport = require('passport');

var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var uid2 = require("uid2");



router.get('/profile/:idUser', function(req, res, next) {

  mediaModel.find({"user":req.params.idUser})
  .populate({path: 'user'})
  .populate({path: 'spot'})
  .exec(function (err, infoMediaFind) {

    spotModel.find({}).populate({path: 'medias'})
    .exec(function (err, allSpots){

      var nbMediaLike = 0
      var nbSpotFollow = 0

      var filtreMedia = allSpots.filter(spot => spot.medias.length > 0);

      for (var i = 0; i < filtreMedia.length; i++) {
        for (var j = 0; j < filtreMedia[i].medias.length; j++) {
          if (filtreMedia[i].medias[j].likedBy.length > 0) {
            if (filtreMedia[i].medias[j].likedBy.includes(req.params.idUser)) {
              nbMediaLike++
            }
          }
        }
      }

      for (var i = 0; i < allSpots.length; i++) {

        if (allSpots[i].users.includes(req.params.idUser)) {
          nbSpotFollow++
        }
      }
      console.log("nb media like",nbMediaLike);
      console.log("nb follow",nbSpotFollow);

      res.json({"nbMedia":infoMediaFind.length, allMedia:infoMediaFind.sort(function(a,b){return b.timestamp - a.timestamp}), nbMediaLike:nbMediaLike, nbFollow:nbSpotFollow})


    })

  });


  // mediaModel.find({"user":req.params.idUser},null,{ sort: { timestamp : -1 }},function(error,infoMediaFind){
  //   console.log(infoMediaFind);
  //   mediaModel.find({"likedBy":req.params.idUser},function(error, allMediaLikeThis){
  //
  //       res.json({"nbMedia":infoMediaFind.length, allMedia:infoMediaFind, nbMediaLike:allMediaLikeThis.length, nbSpotFollow:allSpotFollow.length, allSpotFollow:allSpotFollow})
  //
  //   })
  // });

});



router.get('/profile/:like(true|false)/:mediaName/:idUser', function(req, res, next) {

  console.log(req.params.like);
  var update = req.params.like === "true" ? {$push:{ likedBy:req.params.idUser}} : {$pull:{ likedBy:req.params.idUser}}
  mediaModel.findOneAndUpdate({"name":req.params.mediaName},update,{new:true},function(error,newmedia){
    res.json({newmedia})
  })

});










router.get('/', function(req, res, next) {
  res.send('ok');
});

router.post('/signup', function(req, res, next) {

  var myPassword = req.body.password;
  var salt = uid2(32);

  var myPasswordHacke = SHA256(myPassword + salt).toString(encBase64);

  console.log(req.body);

  userModel.findOne({email:req.body.email},function(error,findUser){
    if (findUser) {
      res.json({result:false, error:"email"})
    }else {
      var newUser = new userModel({
        avatar: "http://res.cloudinary.com/dutedyimj/image/upload/profile_avatar",
        userName: req.body.userName,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        password: myPasswordHacke,
        salt: salt,
        idFacebook: req.body.idFacebook,
        idGoogle: req.body.idGoogle,
        idSpot: req.body.idSpot
      });
      newUser.save(function(error, user) {
        if(error) {
          console.log(error);
        }else {
          console.log(user);
          res.json({user, result:true, error:""})
        }
      });
    }

  });

});

router.post('/signin', function(req, res, next) {
  console.log(req.body);
  userModel.findOne({email:req.body.email},function(error,findUser){
    if (findUser != null) {

      var mdp = SHA256(req.body.password + findUser.salt).toString(encBase64);;

      if (findUser.password === mdp ) {
        console.log("password ok");

        res.json({user:findUser, result:true, error:""})

      }else {
        console.log("password fail");
        res.json({result:false, error:"password"})
      }

    }else {
      res.json({result:false, error:"email"})
    }
  });
})

router.get('/auth/facebook',
  function(req,res,next){
      //console.log('/auth/facebook', req.query.redirectUrl);
      passport.authenticate(
          'facebook', { scope : 'email', state: JSON.stringify(req.query) }
      )(req,res,next);
  }
)

router.get('/auth/facebook/callback',passport.authenticate('facebook', { session: false }),function(req, res) {
    console.log(req.user.redirectUrl);
    console.log(req.user.first_name);
    console.log(req.user.first_name);
    console.log(req.user.id);

    userModel.findOneAndUpdate({idFacebook:req.user.id},
    {email:req.user.email,firstName:req.user.first_name,lastName:req.user.last_name},
    {new:true},
    function(error,findUser){
        console.log(findUser);
        if (findUser != null){

          res.redirect(req.user.redirectUrl+"?idFacebook="+req.user.id
            +"&firstName="+findUser.first_name
            +"&lastName="+findUser.last_name
            +"&email="+findUser.email
          );

        }else {
          var newUser = new userModel({
            avatar: "http://res.cloudinary.com/dutedyimj/image/upload/profile_avatar",
            userName: req.user.first_name,
            lastName: req.user.last_name,
            firstName: req.user.first_name,
            email: req.user.email,
            password: "",
            salt: "",
            idFacebook: req.user.id,
            idGoogle: "",
            idSpot: []
          });
          newUser.save((error, user) => {
            if(error) {
              console.log(error);
            }else {
              console.log(user);
              res.redirect(req.user.redirectUrl+"?idFacebook="+user.idFacebook
                +"&firstName="+user.first_name
                +"&lastName="+user.last_name
                +"&email="+user.email
              );
            }
          });

        }

    });
});


router.post('/signFaceBook', function(req, res, next) {
  userModel.findOne({idFacebook:req.body.idFacebook},function(error,findUser){
    if (findUser != null) {
      res.json({user:findUser, result:true, error:""})
    }
  })
});


///////////////////// Google connect


router.get('/auth/google',
  function(req,res,next){
      //console.log('/auth/google', req.query.redirectUrl);
      passport.authenticate(
          'google', { scope : 'email', state: JSON.stringify(req.query) }
      )(req,res,next);
  }
)


router.get('/auth/google/callback',passport.authenticate('google', { session: false }),function(req, res) {
    console.log(req.user.redirectUrl);
    console.log(req);
    console.log("Data google",req.user);

    userModel.findOneAndUpdate({idGoogle:req.user.sub},
    {email:req.user.email},
    {new:true},
    function(error,findUser){
        console.log(findUser);
        if (findUser != null){

          res.redirect(req.user.redirectUrl+"?idGoogle="+req.user.sub
            +"&email="+findUser.email
          );

        }else {
          var newUser = new userModel({
            avatar: "http://res.cloudinary.com/dutedyimj/image/upload/profile_avatar",
            userName: req.user.email.split("@")[0],
            lastName: "",
            firstName: "",
            email: req.user.email,
            password: "",
            salt: "",
            idFacebook: "",
            idGoogle: req.user.sub,
            idSpot: []
          });
          newUser.save((error, user) => {
            if(error) {
              console.log(error);
            }else {
              console.log(user);
              res.redirect(req.user.redirectUrl+"?idGoogle="+user.idGoogle
                +"&email="+user.email
              );
            }
          });

        }

    });
});


router.post('/signGoogle', function(req, res, next) {
  userModel.findOne({idGoogle:req.body.idGoogle},function(error,findUser){
    if (findUser != null) {
      res.json({user:findUser, result:true, error:""})
    }
  })
});



module.exports = router;
