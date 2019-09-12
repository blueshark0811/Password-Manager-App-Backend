const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Mail Schema
 */
const MailSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
 
  mail_status: {
    type: String,
    required: true
  },
  delay: {
    type: String,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },
  sender_email: {
    type: String,
    required: true
  },

  mail_content: {
    type: String,
    required: true
  },
  mail_html: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
MailSchema.method({
});

/**
 * Statics
 */
MailSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((mail) => {
        if (mail) {
          return mail;
        }
        const err = new APIError('No such mail exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('Mail', MailSchema);
