// auth.js
const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');

const config = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  responseType: 'code',
  responseMode: 'query',
  redirectUrl: process.env.REDIRECT_URI,
  allowHttpForRedirectUrl: true,
  scope: ['openid', 'profile'],
  passReqToCallback: false,
};

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new OIDCStrategy(config, (iss, sub, profile, accessToken, refreshToken, done) => {
    if (!profile.oid) return done(new Error('No OID found'), null);
    return done(null, profile);
  })
);

module.exports = passport;
