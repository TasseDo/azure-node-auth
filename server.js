// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./auth');

const app = express();

app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hello ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
  } else {
    res.send('<h1>Home</h1><a href="/login">Login with Azure</a>');
  }
});

// Auth routes
app.get('/login', passport.authenticate('azuread-openidconnect'));
app.get('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
      console.log('✅ User Authenticated:', req.user);
      res.redirect('/');
    }
  );
  app.get('/whoami', (req, res) => {
    res.send(req.user ? req.user : '🚫 Not authenticated');
  });
  
// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(`https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`);
  });
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
