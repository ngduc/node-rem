export {};
import { NextFunction, Request, Response, Router } from 'express';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const httpStatus = require('http-status');
const { omit } = require('lodash');
import { User, UserNote } from 'api/models';
import { startTimer, apiJson } from 'api/utils/Utils';
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await User.get(id);
    req.route.meta = req.route.meta || {};
    req.route.meta.user = user;
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req: Request, res: Response) => res.json(req.route.meta.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req: Request, res: Response) => res.json(req.route.meta.user.transform());

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
exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.route.meta;
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
exports.update = (req: Request, res: Response, next: NextFunction) => {
  const ommitRole = req.route.meta.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.route.meta.user, updatedUser);

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
    startTimer(req);
    const data = (await User.list(req)).transform(req);
    apiJson({ req, res, data, model: User });
  } catch (e) {
    next(e);
  }
};

/**
 * Get user's notes.
 * NOTE: Any logged in user can get a list of notes of any user.
 * @public
 * @example GET https://localhost:3009/v1/users/USERID/notes
 */
exports.listUserNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    const userId = req.params.userId;
    req.query = { ...req.query, user: new ObjectId(userId) }; // append to query (by userId) to final query
    const data = (await UserNote.list({ query: req.query })).transform(req);
    apiJson({ req, res, data, model: UserNote });
  } catch (e) {
    next(e);
  }
};

/**
 * Delete user note
 * @public
 */
exports.deleteUserNote = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, noteId } = req.params;
  const { _id: currentUserId } = req.route.meta.user;
  if (userId !== currentUserId) {
    return next(); // only logged in user can delete her own notes
  }
  try {
    await UserNote.remove({ user: new ObjectId(userId), _id: new ObjectId(noteId) });
    apiJson({ req, res, data: {} });
  } catch (e) {
    next(e);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.route.meta;
  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: any) => next(e));
};
