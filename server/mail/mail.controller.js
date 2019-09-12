const Mail = require('./mail.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Mail.findOne({_id: id})
    .then((mail) => {
      
      req.mail = mail; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.mail);
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
  const mail = new Mail(req.body);

  mail.save()
      .then(savedMail => res.json(savedMail))
      .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  let mail = req.mail;
  mail.author = req.body.author
  mail.subject = req.body.subject
  mail.mail_status = req.body.mail_status
  mail.delay = req.body.delay
  mail.sender_name = req.body.sender_name
  mail.sender_email = req.body.sender_email
  mail.mail_content = req.body.mail_content
  mail.mail_html = req.body.mail_html


  mail.save()
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
  Mail.list({ limit, skip })
    .then(mails => res.json(mails))
    .catch(e => next(e));
}

function getByUser(req, res, next) {
  console.log(req.user[0].username)
  Mail.find({author: req.user[0].username})
    .then(mails => res.json(mails))
    .catch(e => next(e));
}
/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const mail = req.mail;
  mail.remove()
    .then(deletedMail => res.json(deletedMail))
    .catch(e => next(e));
}

module.exports = { load, get, getByUser, create, update, list, remove };


