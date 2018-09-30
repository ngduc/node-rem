import { NextFunction, Request, Response, Router } from 'express';
const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('api/models/user.model');
const Utils = require('api/utils/Utils');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req: any, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req: any, res: Response) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req: any, res: Response) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req: any, res: Response, next: NextFunction) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser: any) => res.json(savedUser.transform()))
    .catch((e: any) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 * @example GET https://localhost:3009/v1/users?role=admin&limit=5&offset=0&sort=email:desc,createdAt
 */
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = (await User.list(req.query)).transform();
    res.json(await Utils.buildResponse({ req, data, listModel: User }));
  } catch (e) {
    next(e);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req: any, res: Response, next: NextFunction) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
};
