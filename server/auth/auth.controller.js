const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../user/user.model');

// sample user, used for authentication
const user = {
  username: 'react',
  password: 'express'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
 // , $not: {status: false}
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]}).then((user) => {
      console.log('User:', user, req.body.password, user.password)
      if (req.body.password === user.password && user.status != false) {
        const token = jwt.sign({
          username: user.username
        }, config.jwtSecret);
        res.json({
          token,
          username: user.username,
          email: user.email,
          role: user.role
        });
    }
    else
      res.json({error: 'Username or Password is incorrect.'})
  })
  .catch(e => {
    res.json({error: 'Username or Password is incorrect.'})
  });

  // const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
// function getRandomNumber(req, res) {
//   // req.user is assigned by jwt middleware if valid token is provided
//   return res.json({
//     user: req.user,
//     num: Math.random() * 100
//   });
// }

module.exports = { login };
