export {};
import { NextFunction, Request, Response, Router } from 'express';
const httpStatus = require('http-status');
import { User } from 'api/models';
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
import { apiJson, randomString } from 'api/utils/Utils';
import { sendEmail, welcomeEmail, forgotPasswordEmail, slackWebhook } from 'api/utils/MsgUtils';
const {
  JWT_EXPIRATION_MINUTES,
  SEC_ADMIN_EMAIL,
  slackEnabled,
  emailEnabled,
  setAdminToken
} = require('../../config/vars');

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
    const user = await new User({
      ...req.body,
      stars: [
        '5cd35e20638e3e625c3af1e6',
        '5cd35f02c41e0b642af63f85',
        '5cd4e13e2976c4c1a94ee133',
        '5cd4e15d2976c4c1a94ee13f',
        '5ce2bce9bd8c487a724cd7bb',
        '5ce39146ba6d1b5eff67324b',
        '5ce3aad448871205d49cb476',
        '5ce5eb7fea00fe57b9f87225',
        '5ce5ed3bea00fe57b9f8751f',
        '5ce5efc1ea00fe57b9f878ee',
        '5ce8ffb4cbdd034e766bee79',
        '5ceabc56fe5d8b0d06caa3ab',
        '5cec5bb5703ef859fc5f97af',
        '5cecab7a703ef859fc6002ed',
        '5cecabc8703ef859fc6003ad',
        '5cecac52703ef859fc6004d9',
        '5cecd06b703ef859fc605a79',
        '5ced7d40b7610906ce6e4827',
        '5cef79b1057adb845cf9daf7',
        '5cef79e4057adb845cf9dba6',
        '5cef7a71057adb845cf9e3dc',
        '5cef7aca057adb845cf9e49f',
        '5cef7af4057adb845cf9e55a',
        '5cef7d1d057adb845cf9f116',
        '5cef7d44057adb845cf9f175',
        '5cef84e8db580a114e5da10e',
        '5cef86a8a515ec174e1e8266',
        '5cef86fea515ec174e1e834e',
        '5cef8709a515ec174e1e83b3',
        '5cef8730a515ec174e1e846e',
        '5cef8797a515ec174e1e85e7',
        '5cef87b1a515ec174e1e864a',
        '5cef87d1a515ec174e1e870d',
        '5cef881da515ec174e1e87be',
        '5cef884da515ec174e1e88bd',
        '5cef88f5a515ec174e1e89e8',
        '5cef890ca515ec174e1e89f4',
        '5cef8914a515ec174e1e8a53',
        '5cef8955a515ec174e1e8b79',
        '5cef89b0a515ec174e1e8cf6',
        '5cef8b0ba515ec174e1e8d86',
        '5cef8b4ca515ec174e1e8de6',
        '5cef8c45a515ec174e1e8e48',
        '5cef8d50a515ec174e1e8eab',
        '5cef8d77a515ec174e1e8f0b',
        '5cef91037085472490e5d3d0',
        '5cef91bf7085472490e5d434'
      ]
    }).save();
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
      setAdminToken(token); // remember admin token for checking later
    } else {
      slackWebhook(`User logged in: ${email}`);
    }

    const userTransformed = user.transform();
    const data = { token, user: userTransformed };
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
