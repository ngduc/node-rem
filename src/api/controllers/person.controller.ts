export {};
import { NextFunction, Request, Response } from 'express';
import { startTimer, apiJson } from 'api/utils/Utils';
import { fetchTwitterUserDetails, fetchAndSavePosts } from 'api/utils/TwitterUtils';

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
    const { twitterId, category } = req.body;
    // TODO: validate Id with regex
    if (!twitterId || !category) {
      return next({ message: 'Please enter all required fields.' });
    }
    // TODO: from req.body.twitterId => find out First & Last Name & other info => Save them
    const { error, data }: any = await fetchTwitterUserDetails(twitterId);
    if (error) {
      return next({ message: error[0] && error[0].message ? error[0].message : JSON.stringify(error) });
    }
    console.log('> fetchTwitterUserDetails', data.name);

    const person = new Person({
      twitterId,
      category,
      firstName: data.name.indexOf(' ') >= 0 ? data.name.split(' ')[0] : data.name,
      lastName: data.name.indexOf(' ') >= 0 ? data.name.split(' ')[1] : '',
      avatarUrl: data.profile_image_url || ''
    });
    const savedPerson = await person.save();

    fetchAndSavePosts(savedPerson); // no need to wait for this (await)

    return apiJson({ req, res, data: savedPerson });
  } catch (error) {
    return next(error);
  }
};
