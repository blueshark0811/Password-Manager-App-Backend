const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Mail Schema
 */
const EmailCueSchema = new mongoose.Schema({
  recipient_id: {
    type: String,
    required: true
  },
  member_id: {
    type: String,
    required: true
  },
  mail_id: {
    type: String,
    required: true
  },
  send_at: {
    type: Date
  },
  failed_at: {
    type: Date
  },
  status: {
    type: String,
    default: 'PENDING'
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
EmailCueSchema.method({
});

/**
 * Statics
 */
EmailCueSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((mail_cue) => {
        if (mail_cue) {
          return mail_cue;
        }
        const err = new APIError('No such mail_cue exists!', httpStatus.NOT_FOUND);
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
module.exports = mongoose.model('Email_Cue', EmailCueSchema);
