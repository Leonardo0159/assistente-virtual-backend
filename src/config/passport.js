const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/userModel');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTE_ID,
    clientSecret: process.env.GOOGLE_CLIENTE_SECRET,
    callbackURL: 'http://localhost:3333/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOrCreateUser(profile);
        done(null, user);
    } catch (err) {
        done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userModel.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
