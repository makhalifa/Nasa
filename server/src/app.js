const path = require('path');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { Strategy } = require('passport-google-oauth20');

const v1Router = require('./routes/v1');

require('dotenv').config();

const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
};
function verify(accessToken, refreshToken, profile, cb) {
  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);
  console.log('profile', profile);
  cb(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verify));

// Save user to session
passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

// Get user from session
passport.deserializeUser((id, done) => {
  // User.findById(id, (err, user) => {
  //   done(err, user);
  done(null, id);
});

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('dev'));

app.use(helmet());

app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    session: true,
  }),
  (_req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  // Remove the user id from the session
  req.logout();

  // Remove the session cookie
  req.session = null;

  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  console.log('req.user', req.user);
  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    // res.redirect('/auth/google');
    res.status(401).send('Unauthorized ⚠️⚠️⚠️');
  }
}

app.get('/failure', (_req, res) => {
  res.send('Failed to authenticate..');
});

app.get('/secrets', isLoggedIn, (req, res) => {
  res.send('Secret ㊙㊙㊙㊙');
});

app.use('/v1', v1Router);

app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
