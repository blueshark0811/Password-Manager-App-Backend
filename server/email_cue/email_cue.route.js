const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const mailCueCtrl = require('./email_cue.controller');
const userCtrl = require('../user/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(mailCueCtrl.list)
  .post(mailCueCtrl.create);

router.route('/list/:userId')
  .get(mailCueCtrl.getByUser)
  
router.route('/:mailCueId')
  .get(mailCueCtrl.get)
  .put(mailCueCtrl.update)
  .delete(mailCueCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('mailCueId', mailCueCtrl.load);
router.param('userId', userCtrl.load);

module.exports = router;
