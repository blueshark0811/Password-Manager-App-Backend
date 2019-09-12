const User = require('./user.model');
const AccountType = require('./accounttype.model');



function get_account_list(req, res, next) {
  AccountType.find({ })
    .then(typelist => res.json(typelist))
    .catch(e => next(e));
}
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.find({username: id})
    .then((user) => {
      // delete user['_id']
      console.log(user)
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

  // if(req.body.username == 'admin' || req.body.username == 'mattvisk')
  //   role = 'admin';
  // else
  //   role = 'user';
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  });

  user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user[0];
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  console.log(user)
  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip, status: true})
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user[0];
  user.status = false;
  user.save()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, get_account_list, create, update, list, remove };
