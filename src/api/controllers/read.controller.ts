export {};
import { NextFunction, Request, Response } from 'express';
import { apiJson } from 'api/utils/Utils';
const { EMBED_ROCKS_API_KEY } = require('config/vars');

const axios = require('axios');

exports.read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const str = `https://api.embed.rocks/api?url=${req.query.url}`;

    const response = await axios.get(str, { headers: { 'x-api-key': EMBED_ROCKS_API_KEY } });
    const data = response.data;

    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};
