export {};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { NextFunction, Request, Response } from 'express';
import { apiJson } from 'api/utils/Utils';
import { ArticleCache } from 'api/models';

const { EMBED_ROCKS_API_KEY } = require('config/vars');

const axios = require('axios');

const cacheData = async ({ userId, url, data }: { userId: string; url: string; data: any }) => {
  // const cache = new ArticleCache({
  //   url,
  //   response: {
  //     data: {
  //       article: 'aaa 1',
  //       description: 'ddd 1'
  //     }
  //   }
  // });
  // await cache.save();
  const cache = new ArticleCache({
    user: new ObjectId(userId),
    url,
    response: {
      data
    },
    size: JSON.stringify(data).length
  });
  await cache.save();
};

exports.read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.route.meta.user;
    const userId = _id.toString();

    const { url } = req.query;
    const foundArr = await ArticleCache.find({ url });
    let data = null;
    if (foundArr && foundArr.length > 0) {
      data = foundArr[0].response.data;
    } else {
      const str = `https://api.embed.rocks/api?url=${url}`;
      const response = await axios.get(str, { headers: { 'x-api-key': EMBED_ROCKS_API_KEY } });
      data = response.data;

      // if (data && data.article && data.article.length > 0 && data.article.indexOf('Twitter may be over capacity') < 0) {
      if (data && (data.article || data.description)) {
        cacheData({ userId, url, data });
      }
    }
    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};
