export {};
import * as crypto from 'crypto';
const mongoose = require('mongoose');
// const crypto = require('crypto');
const moment = require('moment-timezone');
const APIError = require('../../api/utils/APIError');
const httpStatus = require('http-status');

/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: 'String',
    ref: 'User',
    required: true
  },
  expires: { type: Date }
});

refreshTokenSchema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
  generate(user: any) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();
    const tokenObject = new RefreshToken({
      token,
      userId,
      userEmail,
      expires
    });
    tokenObject.save();
    return tokenObject;
  },

  /**
   * Find user by user ID then delete token record from DB.
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndDeleteToken(options: any) {
    const { userId } = options;
    if (!userId) {
      throw new APIError({ message: 'An userId is required to delete a token' });
    }
    const tokenRec = await this.findOne({ userId: new mongoose.Types.ObjectId(userId) }).exec();
    const err: any = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (!tokenRec) {
      err.message = 'Logout failed. User already logged out?';
      throw new APIError(err);
    }
    await this.remove({ userId: new mongoose.Types.ObjectId(userId) });
    return { status: 'OK' };
  }
};

/**
 * @typedef RefreshToken
 */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
