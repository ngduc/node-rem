export {};
const httpStatus = require('http-status');
const passport = require('passport');
import { User } from 'api/models';
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

import * as Bluebird from 'bluebird';
// declare global {
//   export interface Promise<T> extends Bluebird<T> {}
// }

const handleJWT = (req: any, res: any, next: any, roles: any) => async (err: any, user: any, info: any) => {
  const error = err || info;
  const logIn: any = Bluebird.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined
  });
  let isError = false;

  try {
    if (error || !user) {
      throw error;
    }
    await logIn(user, { session: false });
  } catch (e) {
    isError = true;
    // return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      isError = true;
      // return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    isError = true;
    // return next(apiError);
  } else if (err || !user) {
    isError = true;
    // return next(apiError);
  }

  req.route.meta = req.route.meta || {};
  req.route.meta.user = user;

  if (isError) {
    return next(apiError);
  } else {
    return next();
  }
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

exports.authorize = (roles = User.roles) => (req: any, res: any, next: any) =>
  passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles))(req, res, next);

exports.oAuth = (service: any) => passport.authenticate(service, { session: false });
