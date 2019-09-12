const RecipientProps = require('./recipient_props.model');
const Recipient = require('../recipient/recipient.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  RecipientProps.findOne({_id: id})
    .then((recipientprops) => {
      
      req.recipientprops = recipientprops; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.recipientprops);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {

  const recipientprops = new RecipientProps(req.body);
  recipientprops.save()
      .then(savedRecipient => res.json(savedRecipient))
      .catch(e => next(e));
}
function getByUser(req, res, next) {
  RecipientProps.find({user: req.user[0].username})
    .then(recipientprops => res.json(recipientprops))
    .catch(e => next(e));
}
/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  RecipientProps.findOne({_id: req.body._id})
  .then((oldrecipientprops) => {
    Recipient.find({user: req.body.user}).then((recipients) => {
        old = oldrecipientprops.field
        for(let index in recipients) {
          let oldrecipient = recipients[index];
          if(oldrecipient['info']){
            let info = oldrecipient['info'];
            info[req.body.field] = info[old];
            oldrecipient['info'][req.body.field] = oldrecipient['info'][old];
            delete oldrecipient['info'][old];
            Recipient.update({_id: oldrecipient['_id']}, oldrecipient)
              .then(savedRecipient => {console.log(savedRecipient)})
              .catch(e => next(e));
          }
        }
        let recipientprops = oldrecipientprops;
        recipientprops.field = req.body.field
        recipientprops.save()
          .then(savedRecipient => res.json(savedRecipient))
          .catch(e => next(e));
    });
    
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
  RecipientProps.list({ limit, skip })
    .then(recipientprops => res.json(recipientprops))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const recipientprops = req.recipientprops;
  recipientprops.remove()
    .then(deletedRecipient => res.json(deletedRecipient))
    .catch(e => next(e));
}

module.exports = { load, get,getByUser,create, update, list, remove };
