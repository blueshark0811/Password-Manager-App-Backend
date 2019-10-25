const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');
// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
const moment = require('moment');

const User = require('../server/user/user.model.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * JWT Strategy.
 */
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'my_secret',
        passReqToCallback: true
    },
    function (req, jwtPayload, cb) {
        const origin = req.get('origin');

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findById(jwtPayload.id)
            .then(user => {
                if (user.domains.includes(origin))
                    return cb(null, user);
                else 
                    return cb();
            })
            .catch(err => {
                return cb(err);
            });
    }
));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
  profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            req.flash('info', { msg: 'Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Please sign in with that account or reset your password.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.username = `${profile.name.givenName} ${profile.name.familyName}`;
          user.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.location = (profile._json.location) ? profile._json.location.name : '';
          user.passwordtype = 'Facebook'
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Sign in with Google.
 */
const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, params, profile, done) => {
    if (req.user) {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.picture = user.profile.picture;
          user.save((err) => {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Please sign in with that account or reset your password.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.username = `${profile.name.givenName} ${profile.name.familyName}`;
          user.picture = '';
          user.location = (profile._json.location) ? profile._json.location.name : '';
          user.passwordtype = 'Google'
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
});
// passport.use('google', googleStrategyConfig);
// refresh.use('google', googleStrategyConfig);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/')[2];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    // Is there an access token expiration and access token expired?
    // Yes: Is there a refresh token?
    //     Yes: Does it have expiration and if so is it expired?
    //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
    //       No, Quickbooks and Google- refresh token and save, and then go to next();
    //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
    // No: we are good, go to next():
    if (token.accessTokenExpires && moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
      if (token.refreshToken) {
        if (token.refreshTokenExpires && moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
          res.redirect(`/auth/${provider}`);
        } else {
          refresh.requestNewAccessToken(`${provider}`, token.refreshToken, (err, accessToken, refreshToken, params) => {
            User.findById(req.user.id, (err, user) => {
              user.tokens.some((tokenObject) => {
                if (tokenObject.kind === provider) {
                  tokenObject.accessToken = accessToken;
                  if (params.expires_in) tokenObject.accessTokenExpires = moment().add(params.expires_in, 'seconds').format();
                  return true;
                }
                return false;
              });
              req.user = user;
              user.markModified('tokens');
              user.save((err) => {
                if (err) console.log(err);
                next();
              });
            });
          });
        }
      } else {
        res.redirect(`/auth/${provider}`);
      }
    } else {
      next();
    }
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
