const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const recipientpropsCtrl = require('./recipient_props.controller');
const userCtrl = require('../user/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(recipientpropsCtrl.list)
  
  /** POST /api/users - Create new user */
  .post(recipientpropsCtrl.create);

router.route('/update')
	.post(recipientpropsCtrl.update)
router.route('/list/:userId')
  .get(recipientpropsCtrl.getByUser)

router.route('/:recipientpropsId')
  .get(recipientpropsCtrl.get)
  .delete(recipientpropsCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('recipientpropsId', recipientpropsCtrl.load);
router.param('userId', userCtrl.load);

module.exports = router;
