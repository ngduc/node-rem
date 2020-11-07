export {};
const jwtStrategy = require('passport-jwt').Strategy;
const bearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./vars');
const authProviders = require('../api/services/authProviders');
import { User } from '../api/models';

const jwtOptions = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
};

const jwt = async (payload: any, done: any) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service: any) => async (token: any, done: any) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

exports.jwt = new jwtStrategy(jwtOptions, jwt);
exports.facebook = new bearerStrategy(oAuth('facebook'));
exports.google = new bearerStrategy(oAuth('google'));
