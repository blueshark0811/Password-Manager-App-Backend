const User = require('./user.model');
const Pin = require('./pin.model');

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
  if(!req.headers['x-user-id'])
    res.json({'error': 'unauthorized error'});
  if(req.user.userid == req.headers['x-user-id'])
    return res.json(req.user);
  else
    res.json({'error': 'unauthorized error'});
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  if(!req.headers['x-user-id'])
    res.json({'error': 'unauthorized error'});
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
    location: req.body.location,
    userid: req.headers['x-user-id'] || ''
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
function getPin(req, res, next) {
  Pin.findOne({username: 'admin'})
    .then((pin) => res.json(pin))
    .catch(e => next(e));
}
function createPin(req, res, next) {
  const pin = new Pin({
    username: req.body.username,
    pin: req.body.pin
  });
  Pin.remove({}).then(removed => {
    pin.save()
    .then(savedPin => res.json(savedPin) )
    .catch(e => next(e));
  })
  .catch(e => next(e));
}
function updatePin(req, res, next) {
  Pin.findOne({username: req.body.username}).then((pin) => {
    const newPin = pin;
    newPin.pin = req.body.pin;
    newPin.save()
    .then(savedPin => res.json(savedPin) )
    .catch(e => next(e));
  }).catch(e => next(e));
}
function resetPin(req, res, next) {
  Pin.remove({})
  .then(removed => res.json(removed))
  .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  if(!req.headers['x-user-id'])
    res.json({'error': 'unauthorized error'});
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
  if(req.user.userid == req.headers['x-user-id'] || !req.user.userid || req.user.userid == '')
    user.save()
      .then(savedUser => {
        let tmp = savedUser;
        tmp.password = req.body.password;
        tmp.website= req.body.website;
        return res.json(tmp)
      })
      .catch(e => next(e));
  else
    res.json({'error': 'unauthorized error'});
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  if(!req.headers['x-user-id'])
    res.json({'error': 'unauthorized error'});
  var algorithm = config.security.algorithm;
  var key = config.security.password;
  const { limit = 50, skip = 0 } = req.query;
  User.list({ userid: req.headers['x-user-id'], limit, skip })
    .then(users => {
      var decryptedlist = []
      for(let index in users) {
        var decipher = crypto.createDecipher(algorithm, key);
        var decipher1 = crypto.createDecipher(algorithm, key);
        let tmp = {
          _id: users[index]._id,
          username: users[index].username,
          password: users[index].password,
          website: users[index].website,
          passwordtype: users[index].passwordtype,
          location: users[index].location,
          userid: users[index].userid
        };
        if(tmp.passwordtype == 'Generic') {
          tmp.password = decipher.update(tmp.password, 'hex', 'utf8') + decipher.final('utf8');
          tmp.website = decipher1.update(tmp.website, 'hex', 'utf8') + decipher1.final('utf8');
        }
        decryptedlist.push(tmp);
      }
      return res.json(decryptedlist); 
    })
    .catch(e => next(e));
}
function getPassword(req, res, next) {
  console.log(req.params)
  
  Pin.findOne({username: 'admin'})
    .then((pin) => {
      if(pin.pin == req.params.pin) {
        console.log(req.headers['x-user-id']);
        User.findOne({username: req.params.user, passwordtype: req.params.passwordtype})
          .then(user => {
            var algorithm = config.security.algorithm;
            var key = config.security.password;
            var decipher = crypto.createDecipher(algorithm, key);
            let password = decipher.update(user.password, 'hex', 'utf8') + decipher.final('utf8');
            res.json({username: user.username, password: password});
          })
          .catch(e => next(e));
      }
      else
        res.json({'error': 'incorrect pin'})
    })
    .catch(e => next(e));
  
}
/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  if(req.user.userid == req.headers['x-user-id'] || !req.user.userid || req.user.userid == '')
    user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
  else
    res.json({'error': 'unauthorized error'});
  
}

module.exports = { load, get, createPin, getPassword, updatePin, resetPin, getPin, create, update, list, remove };
