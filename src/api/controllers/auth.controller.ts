export {};
import { NextFunction, Request, Response, Router } from 'express';
const httpStatus = require('http-status');
import { User } from '../../api/models';
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
import { apiJson, randomString } from '../../api/utils/Utils';
import { sendEmail, welcomeEmail, forgotPasswordEmail, slackWebhook } from '../../api/utils/MsgUtils';
const { SEC_ADMIN_EMAIL, JWT_EXPIRATION_MINUTES, slackEnabled, emailEnabled } = require('../../config/vars');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user: any, accessToken: string) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(JWT_EXPIRATION_MINUTES, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await new User(req.body).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    const data = { token, user: userTransformed };
    if (slackEnabled) {
      slackWebhook(`New User: ${user.email}`); // notify when new user registered
    }
    if (emailEnabled) {
      // for testing: it can only email to "authorized recipients" in Mailgun Account Settings.
      // sendEmail(welcomeEmail({ name: user.name, email: user.email }));
    }
    return apiJson({ req, res, data });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const { email } = user;
    const token = generateTokenResponse(user, accessToken);

    if (email === SEC_ADMIN_EMAIL) {
      // setAdminToken(token); // remember admin token for checking later
    } else {
      const { ip, headers } = req;
      slackWebhook(`User logged in: ${email} - IP: ${ip} - User Agent: ${headers['user-agent']}`);
    }
    const userTransformed = user.transform();
    const data = { token, user: userTransformed };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};

/**
 * Logout function: delete token from DB.
 * @public
 */
exports.logout = async (req: Request, res: Response, next: NextFunction) => {
  console.log('- logout');
  try {
    const { userId } = req.body;
    await RefreshToken.findAndDeleteToken({ userId });
    const data = { status: 'OK' };
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Send email to a registered user's email with a one-time temporary password
 * @public
 */
exports.forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: reqEmail } = req.body;
    const user = await User.findOne({ email: reqEmail });
    if (!user) {
      // RETURN A GENERIC ERROR - DON'T EXPOSE the real reason (user not found) for security.
      return next({ message: 'Invalid request' });
    }
    // user found => generate temp password, then email it to user:
    const { name, email } = user;
    const tempPass = randomString(10, 'abcdefghijklmnopqrstuvwxyz0123456789');
    user.tempPassword = tempPass;
    await user.save();
    sendEmail(forgotPasswordEmail({ name, email, tempPass }));

    return apiJson({ req, res, data: { status: 'OK' } });
  } catch (error) {
    return next(error);
  }
};
