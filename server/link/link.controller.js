const Link = require('./link.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Link.findOne({_id: id})
    .then((link) => {
      
      req.link = link; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.link);
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
  let link;
  let linklist = req.body
  for(var i = 0 ; i < linklist.length; i++) {
    link = new Link({title: linklist[i].title, url: linklist[i].url, mail_id: req.params.mailId})
    link.save()
      .then(savedLink => {console.log(savedLink)})
      .catch(e => next(e));
  }

}


function update(req, res, next) {

  // if(req.body.username == 'admin' || req.body.username == 'mattvisk')
  //   role = 'admin';
  // else
  //   role = 'user';
  let link;
  let linklist = req.body

  Link.remove({mail_id: req.params.mailId}).then(deletedLink => {
      for(var i = 0 ; i < linklist.length; i++) {
        link = new Link({title: linklist[i].title, url: linklist[i].url, mail_id: req.params.mailId})
        link.save()
          .then(savedLink => {console.log(savedLink)})
          .catch(e => next(e));
      }
  })
  .catch(e => next(e));
}
/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Link.list({ limit, skip })
    .then(links => res.json(links))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const link = req.link;
  link.remove()
    .then(deletedLink => res.json(deletedLink))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
