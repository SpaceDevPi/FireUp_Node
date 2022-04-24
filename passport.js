const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const Entrepreneur = require('./model/entrepreneurModel');
const CLIENT_ID = '25280197858-chsg045ds3b1qgmgio220mg4lqasbje2.apps.googleusercontent.com';
const CLIENT_SECRET = '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'


module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    const defaultEntrepreneur = {
      displayName: profile.displayName,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      image: profile.photos[0].value,
      email: profile.emails[0].value,
      googleId: profile.id,
    }

    const entrepreneur = await Entrepreneur.findOrCreate({where: {googleId: profile.id}}, defaultEntrepreneur).catch((err) => { 
      console.log(err)
      done(err, null);
    });

    if(entrepreneur && entrepreneur[0]) {
      return done(null, entrepreneur && entrepreneur[0]);
    }

  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Entrepreneur.findById(id, (err, user) => done(err, user));
  });

}

