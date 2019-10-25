const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('./user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);




router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/pin/create')
  .post(userCtrl.createPin);
router.route('/pin/get')
  .get(userCtrl.getPin)
router.route('/pin/update')
  .post(userCtrl.updatePin);
router.route('/pin/reset')
  .delete(userCtrl.resetPin);
/** Load user when API with userId route parameter is hit */
// http://45.63.27.167:4040/api/users/credential/ABCD/test/Tripadvisor
router.route('/credential/:pin/:user/:passwordtype')
  /** GET /api/users - Get list of users */
  .get(userCtrl.getPassword)

router.param('userId', userCtrl.load);

module.exports = router;
// http://localhost:4040/api/users/credential/ABCD/test/Tripadvisor