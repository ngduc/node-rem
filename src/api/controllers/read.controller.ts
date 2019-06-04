export {};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { NextFunction, Request, Response } from 'express';
import { startTimer, endTimer, apiJson } from 'api/utils/Utils';
import { Post, ArticleCache } from 'api/models';

const { EMBED_ROCKS_API_KEY } = require('config/vars');

const axios = require('axios');

const cacheData = async ({ userId, postId, url, data }: { userId: string; postId: string; url: string; data: any }) => {
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
    post: new ObjectId(postId),
    url,
    response: {
      data
    },
    size: JSON.stringify(data).length
  });
  const savedRec = await cache.save();

  // save "withUrlData" back to Post
  const foundPost = await Post.findOne({ _id: new ObjectId(postId) });
  if (foundPost) {
    foundPost.withUrlData = new ObjectId(savedRec._id);
    foundPost.save();
  }
};

exports.read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.route.meta.user;
    const userId = _id.toString();
    const { url, postId = '' } = req.query;

    let cachedArticle = await ArticleCache.findOne({ url });
    let data = null;
    if (cachedArticle) {
      // respond with cached article
      data = cachedArticle.response.data;
    } else {
      startTimer({ key: 'fetch-article' });
      // fetch article
      const str = `https://api.embed.rocks/api?url=${url}`;
      const response = await axios.get(str, { headers: { 'x-api-key': EMBED_ROCKS_API_KEY } });
      data = response.data;
      endTimer({ key: 'fetch-article' });

      // if (data && data.article && data.article.length > 0 && data.article.indexOf('Twitter may be over capacity') < 0) {
      if (data && (data.article || data.description)) {
        cacheData({ userId, postId, url, data });
      }
    }

    return apiJson({ req, res, data });
  } catch (error) {
    return next(error);
  }
};
