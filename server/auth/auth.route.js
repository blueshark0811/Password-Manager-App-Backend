const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('./auth.controller');
const userCtrl = require('../user/user.controller');

const config = require('../../config/config');
const bodyParser = require('body-parser');
const User = require('../user/user.model');

const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/charge/:userId/:month/:year/:last4/:atype')
	.post(async (req, res) => {
	    let customer = await stripe.customers.create({
		  description: 'Customer for bikemail.io',
		  source: req.body // obtained with Stripe.js
		})
		const user = await User.findOne({username: req.params.userId})
		user.customer_id = customer.id
		user.account_type = req.params.atype
		user.cardInfo = {
			exp_month: req.params.month,
			exp_year: req.params.year,
			last4: req.params.last4
		}
		user.save()
		.then(savedUser => res.json(savedUser.customer_id))
		.catch(e => res.json(e));
	})

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
// router.route('/random-number')
//   .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

module.exports = router;
