const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const mailRoutes = require('./server/mail/mail.route');
const linkRoutes = require('./server/link/link.route');
const recipientRoutes = require('./server/recipient/recipient.route');
const recipientPropsRoutes = require('./server/recipient_props/recipient_props.route');
const emailCueRoutes = require('./server/email_cue/email_cue.route');


const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount mail routes at /mail
router.use('/mail', mailRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);


// mount link routes at /mail
router.use('/link', linkRoutes);

router.use('/recipient', recipientRoutes);
router.use('/recipient-props', recipientPropsRoutes);

router.use('/email-cue', emailCueRoutes);


module.exports = router;
