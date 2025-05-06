const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require("../models/users.model");
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.clientID,       
  clientSecret: process.env.clientSecret, 
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, (token, accessToken, refreshToken, profile, done) => {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const username = profile.displayName;
    const image = profile.photos?.[0]?.value || null;
  
    let user = userModel.getByGoogleId(googleId);
  
    if (!user) {
      userModel.createGoogleUser({ google_id: googleId, username, email, image });
      user = userModel.getByGoogleId(googleId);
    }
  
    return done(null, user); // ✅ Return your actual DB user, not the raw profile
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.user_id); // ✅ use your DB user ID
  });
  
  passport.deserializeUser((id, done) => {
    const user = userModel.getById(id);
    done(null, user);
  });