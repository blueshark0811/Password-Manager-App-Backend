const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const mailCtrl = require('./mail.controller');
const userCtrl = require('../user/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(mailCtrl.list)

  /** POST /api/users - Create new user */
  .post(mailCtrl.create);



router.route('/user/:userId')
  .get(mailCtrl.getByUser)
  
router.route('/:mailId')
  .get(mailCtrl.get)
  .put(mailCtrl.update)
  .delete(mailCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('mailId', mailCtrl.load);
router.param('userId', userCtrl.load);

module.exports = router;
