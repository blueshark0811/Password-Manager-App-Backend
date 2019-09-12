const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const linkCtrl = require('./link.controller');

const router = express.Router(); // eslint-disable-line new-cap


router.route('/:mailId')
  .get(linkCtrl.get)
  .post(linkCtrl.create)
  .put(linkCtrl.update)
  .delete(linkCtrl.remove);

/** Load user when API with userId route parameter is hit */

module.exports = router;
