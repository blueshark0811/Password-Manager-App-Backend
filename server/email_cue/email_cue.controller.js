const EmailCue = require('./email_cue.model');
const Mail = require('../mail/mail.model');
const Recipient = require('../recipient/recipient.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  EmailCue.findOne({_id: id})
    .then((mailcue) => {
      req.mailcue = mailcue; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.mailcue);
}
function sendemail() {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
		const nodemailer = require('nodemailer');
    console.log('11111111111111111111111111111111111111111111')
		let transporter = nodemailer.createTransport({
	        host: 'mail.bikemail.io',
	        port: 587,
	        secure: false, // true for 465, false for other ports
	        auth: {
	            user: 'blueshark0811@bikemail.io', // generated ethereal user
	            pass: 'myFirst100' // generated ethereal password
	        },
	        tls: {
                rejectUnauthorized: false
            }
	    });
		let info = transporter.sendMail({
			from: 'blueshark0811@bikemail.io', // sender address
			to: 'blueshark0811@gmail.com', // list of receivers
      // from: 'blueshark0811@outlook.com', // sender address
			// to: 'blueshark0811@gmail.com', // list of receivers
			subject: 'Test', // Subject line
			text: 'Hey Matt, First email on bikemail with our own SMTP server', // plain text body
			html: '<b>Hey Matt, First email on bikemail with our own SMTP server</b>' // html body
		}, function (error, info) {
			if (error) {
				console.log('Email Error', error);
			} else {
				// callback(true);
				console.log('Email sent: ' + info.response);
			}
			})
       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

       // Preview only available when sending through an Ethereal account

	}

function cronfunc() {
  EmailCue.find({status: 'PENDING'}).then((list) => {
    for(let x in list) {
      Mail.findOne({_id: list[x]['mail_id']}).then(mail => {
        Recipient.findOne({email: list[x]['recipient_id']}).then(recipient => {
          console.log(mail['mail_html'].replace('[first_name]', recipient['firstName']).replace('[last_name]', recipient['lastName']));
        if(mail['mail_status'] == 'active'){
          var cue = list[x]
          if(new Date().getTime() >= cue['send_at'].getTime()){
            cue.remove()
              .then(removedcue=>{});
              const mailcue = new EmailCue({
                  mail_id: cue.mail_id,
                  member_id: cue.member_id,
                  recipient_id: cue.recipient_id,
                  send_at: cue.send_at,
                  created_at: cue.created_at,
                  status: 'SENT'
                });
              mailcue.save()
                .then(savedcue => {console.log(savedcue)})
                .catch(e => {});
          }
        }
        })
      })

    }
    // console.log(list);
  });
  console.log('You will see this message every 2 mins', new Date());
  
}
cronfunc();
var CronJob = require('cron').CronJob;
new CronJob('*/2 * * * *', function() {
  cronfunc();
}, null, true, 'America/Los_Angeles');
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
  for(var x = 0 ; x < req.body.recipeintlist.length; x++){
    const mailcue = new EmailCue({
      mail_id: req.body.mail_id,
      member_id: req.body.member_id,
      recipient_id: req.body.recipeintlist[x],
      send_at: req.body.send_at
    });
    mailcue.save()
        .then(savedMailCue => {})
        .catch(e => next(e));
  }

  
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  let mailcue = req.mailcue;
  mailcue.recipient_id = req.body.recipient_id
  mailcue.member_id = req.body.member_id
  mailcue.mail_id = req.body.mail_id

  mailcue.save()
    .then(savedmailcue => res.json(savedmailcue))
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
  EmailCue.list({ limit, skip })
    .then(mailcues => res.json(mailcues))
    .catch(e => next(e));
}

function getByUser(req, res, next) {
  EmailCue.find({member_id: req.user[0].username})
    .then(mailcues => res.json(mailcues))
    .catch(e => next(e));
}
/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const mailcue = req.mailcue;
  mailcue.remove()
    .then(deletedMailCue => res.json(deletedMailCue))
    .catch(e => next(e));
}

module.exports = { load, get, getByUser, create, update, list, remove };


