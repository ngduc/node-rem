export {};
import { NextFunction, Request, Response } from 'express';
import { startTimer, apiJson } from 'api/utils/Utils';
import { fetchTwitterUserDetails, fetchAndSavePosts } from 'api/utils/TwitterUtils';

import { User, Person } from 'api/models';
const { isAdmin } = require('../../config/vars');

// list all people for current users
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    startTimer(req);
    const { _id } = req.route.meta.user;
    const currentUser = await User.findById(_id);
    const { stars } = currentUser;

    // const userId = req.params.userId; // , user: new ObjectId(userId)
    req.query = { ...req.query }; // append to query (by userId) to final query
    // const fullList = (await Person.list({ query: req.query })).transform(req);
    // const filteredList = fullList.filter((p: any) => stars.includes(p.id));
    req.query['_id'] = {
      $in: stars
    };
    const filteredList = (await Person.list({ query: req.query })).transform(req);

    apiJson({ req, res, data: filteredList, model: Person });
  } catch (e) {
    next(e);
  }
};

// list all people
exports.listAll = async (req: Request, res: Response, next: NextFunction) => {
  console.log('----- ', isAdmin);
  try {
    startTimer(req);
    req.query = { ...req.query };
    const fullList = (await Person.list({ query: req.query })).transform(req);

    apiJson({ req, res, data: fullList, model: Person });
  } catch (e) {
    next(e);
  }
};

// add a new Person (Star) to DB (if not existed), then add to Current User's ".stars" array
exports.addPerson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { twitterId, category } = req.body;
    // TODO: validate Id with regex
    if (!twitterId || !category) {
      return next({ message: 'Please enter all required fields.' });
    }
    let existingPerson = await Person.findOne({ twitterId });
    console.log('existingPerson: ', typeof existingPerson);

    if (!existingPerson) {
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
        avatarUrl: data.profile_image_url_https || ''
      });
      existingPerson = await person.save();
    }

    // add this new Person (star) to currentUser.stars array
    const { _id } = req.route.meta.user;
    const currentUser = await User.findById(_id);
    console.log('--- existingPerson: ', existingPerson._id);
    if (currentUser.stars.indexOf(existingPerson._id) < 0) {
      currentUser.stars.push(existingPerson._id);
    }
    await currentUser.save();

    fetchAndSavePosts(existingPerson); // no need to wait for this (await)

    return apiJson({ req, res, data: existingPerson });
  } catch (error) {
    return next(error);
  }
};

// remove a Person (Star) from Current User's "stars" array
exports.removePerson = async (req: Request, res: Response, next: NextFunction) => {
  const { personId } = req.params;
  const { _id } = req.route.meta.user;
  const currentUser = await User.findById(_id);

  currentUser.stars = currentUser.stars.filter((id: string) => id !== personId);
  await currentUser.save();

  try {
    apiJson({ req, res, data: { status: 'OK' } });
  } catch (e) {
    next(e);
  }
};
