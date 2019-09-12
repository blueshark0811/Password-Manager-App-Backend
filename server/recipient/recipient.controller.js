const Recipient = require('./recipient.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Recipient.findOne({_id: id})
    .then((recipient) => {
      
      req.recipient = recipient; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.recipient);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {

  const recipient = new Recipient(req.body);
  recipient.save()
      .then(savedRecipient => res.json(savedRecipient))
      .catch(e => next(e));
}

function import_data(req, res, next) {
  const username = req.body.user;
  Recipient.remove({user: username}).then((removedRecipients) => {
    Recipient.create(req.body.recipients).then((importedList) => res.json(importedList))
  })

}
function getByUser(req, res, next) {
  Recipient.find({user: req.user[0].username})
    .then(recipients => res.json(recipients))
    .catch(e => next(e));
}
/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  Recipient.findOne({_id: req.body._id})
  .then((oldrecipient) => {
    
    let recipient = oldrecipient;
    recipient.firstName = req.body.firstName
    recipient.lastName = req.body.lastName
    recipient.phone = req.body.phone
    recipient.email = req.body.email
    recipient.unsubscribed = req.body.unsubscribed
    recipient.info = req.body.info

    recipient.save()
      .then(savedRecipient => res.json(savedRecipient))
      .catch(e => next(e));
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
  const { limit = 50, skip = 0 } = req.query;
  Recipient.list({ limit, skip })
    .then(recipients => res.json(recipients))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const recipient = req.recipient;
  recipient.remove()
    .then(deletedRecipient => res.json(deletedRecipient))
    .catch(e => next(e));
}

module.exports = { load, get, import_data, getByUser,create, update, list, remove };
