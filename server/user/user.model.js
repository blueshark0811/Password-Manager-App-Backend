const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ""
  },
  passwordtype: {
    type: String,
    default: "Generic"
  },
  location: {
    type: String,
  },
  google: {
    type: String
  },
  facebook: {
    type: String
  },
  profile: {
    type: Object,
    default: {}
  },
  email: {
    type: Object
  },
  picture: {
    type: Object
  },
  tokens: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userid: {
    type: String,
    default: ''
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
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ userid, skip = 0, limit = 50 } = {}) {
    return this.find({userid})
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
