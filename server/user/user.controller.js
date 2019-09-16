const User = require('./user.model');
var crypto = require('crypto');
const config = require('../../config/config')
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  var algorithm = config.security.algorithm;
  var key = config.security.password;
  var text = req.body.password;

  var cipher = crypto.createCipher(algorithm, key);  
  var cipher1 = crypto.createCipher(algorithm, key)

  const user = new User({
    username: req.body.username,
    password: cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex'),
    passwordtype: req.body.passwordtype,
    website: cipher1.update(req.body.website, 'utf8', 'hex') + cipher1.final('hex'),
    location: req.body.location
  });

  user.save()
    .then(savedUser => {
      let tmp = savedUser;
      tmp.password = req.body.password;
      tmp.password= req.body.website;
      return res.json(tmp)
    })
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  var algorithm = config.security.algorithm;
  var key = config.security.password;

  var cipher = crypto.createCipher(algorithm, key);  
  var cipher1 = crypto.createCipher(algorithm, key)
  const user = req.user;
  user.username = req.body.username;
  user.password = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
  user.passwordtype = req.body.passwordtype;
  user.website = cipher1.update(req.body.website, 'utf8', 'hex') + cipher1.final('hex');
  user.location = req.body.location;
  user.save()
    .then(savedUser => {
      let tmp = savedUser;
      tmp.password = req.body.password;
      tmp.website= req.body.website;
      return res.json(tmp)
    })
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  var algorithm = config.security.algorithm;
  var key = config.security.password;
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => {
      var decryptedlist = []
      for(let index in users) {
        var decipher = crypto.createDecipher(algorithm, key);
        var decipher1 = crypto.createDecipher(algorithm, key);
        let tmp = users[index];
        tmp.password = decipher.update(tmp.password, 'hex', 'utf8') + decipher.final('utf8');
        tmp.website = decipher1.update(tmp.website, 'hex', 'utf8') + decipher1.final('utf8');
        decryptedlist.push(tmp);
      }
      return res.json(decryptedlist); 
    })
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
