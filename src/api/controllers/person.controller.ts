export {};
import { NextFunction, Request, Response } from 'express';
import { startTimer, apiJson } from 'api/utils/Utils';

import { Person } from 'api/models';

// list all people for current users
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    // const userId = req.params.userId; // , user: new ObjectId(userId)
    req.query = { ...req.query }; // append to query (by userId) to final query
    const data = (await Person.list({ query: req.query })).transform(req);
    apiJson({ req, res, data, model: Person });
  } catch (e) {
    next(e);
  }
};

exports.addPerson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { twitterId } = req.body;
    // TODO: validate Id with regex
    if (!twitterId) {
      return next({ message: 'Not a valid Id. Please try again.' });
    }
    // TODO: from req.body.twitterId => find out First & Last Name & other info => Save them

    const person = new Person(req.body);
    const savedPerson = await person.save();

    return apiJson({ req, res, data: savedPerson });
  } catch (error) {
    return next(error);
  }
};
