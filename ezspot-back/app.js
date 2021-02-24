require('./models/db');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var mediaRouter = require('./routes/media');
var spotRouter = require('./routes/spot');


var app = express();

app.use(fileUpload())

passport.use(new GoogleStrategy({
    clientID: "325877393852-0hbl2m6505f1tp38264db6bofms17b73.apps.googleusercontent.com",
    clientSecret: "rZr2VGVFObp5P4dj-s5BRfC0",
    callbackURL: "https://murmuring-fortress-85793.herokuapp.com/user/auth/google/callback",
    profileFields: ['id', 'first_name', 'last_name', 'email'],
    passReqToCallback: true
  },function(req, accessToken, refreshToken, profile, done) {

      var state = JSON.parse(req.query.state);
      console.log("profileGoogle",profile);

      return done(null, {...profile._json, redirectUrl : state.redirectUrl});

  }));


passport.use(new FacebookStrategy({
    clientID: "2326564374091115",
    clientSecret: "756e1b22c7b04bc3d7a4d84760241d01",
    callbackURL: 'https://murmuring-fortress-85793.herokuapp.com/user/auth/facebook/callback',

    profileFields: ['id', 'first_name', 'last_name', 'email'],

    passReqToCallback: true

}, function(req, accessToken, refreshToken, profile, done) {

    var state = JSON.parse(req.query.state);

    return done(null, {...profile._json, redirectUrl : state.redirectUrl});

}));

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/media', mediaRouter);
app.use('/spot', spotRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
