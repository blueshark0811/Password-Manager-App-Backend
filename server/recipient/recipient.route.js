const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const recipientCtrl = require('./recipient.controller');
const userCtrl = require('../user/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(recipientCtrl.list)
  
  /** POST /api/users - Create new user */
  .post(recipientCtrl.create);

router.route('/import')
  .post(recipientCtrl.import_data);

router.route('/update')
	.post(recipientCtrl.update)
router.route('/list/:userId')
  .get(recipientCtrl.getByUser)

router.route('/:recipientId')
  .get(recipientCtrl.get)
  .delete(recipientCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('recipientId', recipientCtrl.load);
router.param('userId', userCtrl.load);

module.exports = router;
